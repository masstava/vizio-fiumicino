-- =============================================================
-- Vizio Bistrot — audit di sicurezza esterno: chiusura drift RPC
-- =============================================================
-- Un audit indipendente con accesso reale al database (i controlli
-- precedenti giravano in sandbox, senza quell'accesso) ha trovato che
-- pulizia_dati_prenotazioni() — una funzione distruttiva pensata per
-- girare solo via pg_cron — è oggi eseguibile da "anon" via PostgREST,
-- nonostante la sua migration dichiari esplicitamente
-- "revoke all ... from public" e nessun grant a anon/authenticated.
--
-- DIAGNOSI, confermata empiricamente dal committente (query su
-- has_function_privilege per tutte le 13 funzioni dello schema, stesso
-- script di scripts/verifica-schema-reale.sql): il progetto Supabase
-- concede EXECUTE direttamente ai ruoli anon/authenticated su ogni
-- funzione nuova dello schema public — un default privilege separato
-- dal grant-a-PUBLIC automatico di Postgres alla creazione di una
-- funzione. "revoke all ... from public" toglie solo quest'ultimo:
-- un grant fatto DIRETTAMENTE a un ruolo richiede una revoke che
-- nomini quel ruolo, altrimenti resta in piedi. Ogni funzione che
-- doveva restare riservata e si limitava a "revoke ... from public"
-- (pulizia_dati_prenotazioni, ma anche riscatta_coupon) aveva quindi
-- lo stesso buco. Le funzioni PENSATE per anon (crea_prenotazione,
-- iscriviti_newsletter, ecc.) non ne hanno mai risentito: il loro
-- grant esplicito copre comunque il caso, indipendentemente dal
-- meccanismo di default.
--
-- Trovato con la stessa diagnosi, MAI segnalato prima: save_piatto,
-- save_orari, reorder_piatti, save_evento non hanno MAI avuto, in
-- nessuna migration, una "revoke ... from public" — il grant-a-PUBLIC
-- automatico di Postgres alla creazione non è mai stato tolto. Sono
-- però "security invoker" con un controllo interno esplicito
-- "if auth.uid() is null then raise exception": un chiamante anonimo
-- viene respinto PRIMA di qualunque scrittura. Non erano quindi
-- sfruttabili per una modifica reale, ma restava la stessa igiene
-- mancante — corretta qui per lo stesso principio, non perché fosse
-- già stata usata con successo.
--
-- Rimedio uniforme: revoke esplicito da public, anon E authenticated
-- (non solo public) su ogni funzione riservata, poi grant esplicito
-- SOLO ai ruoli previsti. Applicato a tutte e 9 le funzioni toccate da
-- questo audit — le 5 genuinamente pubbliche (crea_prenotazione,
-- iscriviti_newsletter, capienza_del_giorno, prenotazione_da_token,
-- annulla_prenotazione) restano invariate, il loro grant a
-- anon/authenticated è quello voluto.
--
-- Migration idempotente: "drop function" solo dove la firma cambia
-- (verifica_limite_richieste/_newsletter perdono p_ip), "create or
-- replace" altrove, revoke/grant sempre ripetibili.
-- =============================================================


-- =================================================================
-- 1) IP lato server, non più un parametro del chiamante
-- =================================================================
-- verifica_limite_richieste(p_ip text) accettava l'IP da chi chiama:
-- chiunque poteva passarne uno arbitrario (consumare il budget altrui,
-- o evitare il proprio) chiamando la funzione via PostgREST invece che
-- passare dalla Server Action. Tolto il parametro: l'IP si deriva qui
-- dentro, non esiste più nulla da manipolare direttamente.
--
-- ip_chiamante() legge l'header X-Forwarded-For dalla richiesta HTTP
-- originale, esposto da PostgREST come GUC di sessione JSON
-- ("request.headers") — meccanismo documentato di Supabase/PostgREST
-- per leggere gli header della richiesta da dentro una funzione SQL.
--
-- LIMITE DA CONOSCERE, non silenziato: oggi ci si fida di
-- X-Forwarded-For perché Vercel (il proxy davanti a Next.js) lo imposta
-- lui in base alla connessione TCP reale — un client non può
-- falsificarlo verso Vercel. Se PostgREST è raggiungibile DIRETTAMENTE
-- (bypassando Vercel — lo scenario che questo fix vuole chiudere), non
-- è verificabile da qui se il gateway di Supabase davanti a PostgREST
-- sovrascrive l'header allo stesso modo per chi lo chiama diretto, o
-- lo passa così com'è. Questo fix chiude comunque la falla più
-- grossolana di oggi (un campo esplicito, compilabile da chiunque
-- senza alcuna conoscenza del sistema) e resta coerente con la
-- filosofia già scritta per questo meccanismo: "un freno per bot, non
-- un contatore preciso al centesimo".
--
-- Nessun grant a nessuno: è supporto interno, chiamata solo da dentro
-- altre funzioni SECURITY DEFINER (che quindi girano già coi privilegi
-- del proprietario, e non hanno bisogno di alcun grant per chiamarla).
create or replace function public.ip_chiamante()
returns text
language plpgsql
security invoker
stable
set search_path = public
as $$
declare
  v_headers text;
  v_xff     text;
begin
  v_headers := current_setting('request.headers', true);
  if v_headers is null or v_headers = '' then
    return null;
  end if;

  begin
    v_xff := v_headers::json ->> 'x-forwarded-for';
  exception when others then
    -- GUC presente ma non è un JSON valido (es. sessione psql normale
    -- con la variabile impostata a mano in modo scorretto durante un
    -- test): stesso trattamento di un header assente, non un errore
    -- che blocca chi chiama.
    return null;
  end;

  if v_xff is null or btrim(v_xff) = '' then
    return null;
  end if;

  -- Il primo indirizzo della lista (eventuali proxy intermedi si
  -- aggiungono in coda) — stessa logica già scritta lato Next.js in
  -- ipChiamante() dentro le Server Action, ora spostata qui.
  return nullif(btrim(split_part(v_xff, ',', 1)), '');
end;
$$;

revoke all on function public.ip_chiamante() from public, anon, authenticated;


-- =================================================================
-- 2) verifica_limite_richieste — non più parametrizzata, non più
--    chiamabile direttamente
-- =================================================================
-- La firma cambia (perde p_ip): drop esplicito, "create or replace"
-- da solo creerebbe un secondo overload invece di sostituire.
drop function if exists public.verifica_limite_richieste(text);

create or replace function public.verifica_limite_richieste()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip        text;
  v_conteggio integer;
begin
  v_ip := public.ip_chiamante();

  if v_ip is null or btrim(v_ip) = '' then
    return true;
  end if;

  select count(*) into v_conteggio
    from public.limite_richieste_prenotazione
   where ip = v_ip
     and creata_il > now() - interval '10 minutes';

  if v_conteggio >= 5 then
    return false;
  end if;

  insert into public.limite_richieste_prenotazione (ip) values (v_ip);
  return true;
end;
$$;

-- Nessun grant: non più chiamabile via PostgREST da nessun ruolo —
-- solo crea_prenotazione (sotto) la chiama, da dentro il proprio
-- contesto SECURITY DEFINER.
revoke all on function public.verifica_limite_richieste() from public, anon, authenticated;


-- =================================================================
-- 3) verifica_limite_richieste_newsletter — stesso trattamento
-- =================================================================
drop function if exists public.verifica_limite_richieste_newsletter(text);

create or replace function public.verifica_limite_richieste_newsletter()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip        text;
  v_conteggio integer;
begin
  v_ip := public.ip_chiamante();

  if v_ip is null or btrim(v_ip) = '' then
    return true;
  end if;

  select count(*) into v_conteggio
    from public.limite_richieste_newsletter
   where ip = v_ip
     and creata_il > now() - interval '10 minutes';

  if v_conteggio >= 5 then
    return false;
  end if;

  insert into public.limite_richieste_newsletter (ip) values (v_ip);
  return true;
end;
$$;

revoke all on function public.verifica_limite_richieste_newsletter() from public, anon, authenticated;


-- =================================================================
-- 4) crea_prenotazione — rate-limit dentro la RPC, non aggirabile
-- =================================================================
-- Stessa firma di prima (20260828000000): solo il corpo cambia,
-- "create or replace" basta. La Server Action non chiama più
-- verifica_limite_richieste da sola prima di questa — il controllo è
-- ora incorporato qui, quindi vale anche per chi chiamasse questa RPC
-- direttamente via PostgREST saltando la Server Action.
create or replace function public.crea_prenotazione(
  p_nome            text,
  p_telefono        text,
  p_email           text,
  p_data            date,
  p_fascia          time,
  p_coperti         smallint,
  p_note            text,
  p_evento_id       uuid,
  p_risposte_extra  jsonb,
  p_locale          text
)
returns table (id uuid, token_gestione text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limite   smallint;
  v_occupati numeric;
begin
  if p_coperti is null or p_coperti <= 0 then
    raise exception 'Numero di coperti non valido';
  end if;

  -- Rate-limit per IP, derivato qui dentro (vedi ip_chiamante sopra):
  -- non più un parametro che la Server Action passava da fuori.
  if not public.verifica_limite_richieste() then
    raise exception 'RATE_LIMITATO';
  end if;

  -- Serializza SOLO chi prenota per la stessa data e fascia: due
  -- richieste su turni diversi non si aspettano a vicenda.
  perform pg_advisory_xact_lock(
    hashtextextended(p_data::text || ' ' || p_fascia::text, 0)
  );

  select cc.limite_coperti into v_limite
    from public.capienza_config cc
   where cc.data = p_data and cc.fascia = p_fascia;

  if v_limite is not null then
    select coalesce(sum(pr.coperti), 0) into v_occupati
      from public.prenotazioni pr
     where pr.data = p_data and pr.fascia = p_fascia
       and pr.stato in ('confermata', 'completata');

    if v_occupati + p_coperti > v_limite then
      raise exception 'CAPIENZA_ESAURITA'
        using detail = format('%s posti liberi', v_limite - v_occupati);
    end if;
  end if;

  return query
    insert into public.prenotazioni
      (nome, telefono, email, data, fascia, coperti, note,
       evento_id, risposte_extra, locale)
    values
      (p_nome, p_telefono, p_email, p_data, p_fascia, p_coperti,
       p_note, p_evento_id, p_risposte_extra, coalesce(p_locale, 'it'))
    returning prenotazioni.id, prenotazioni.token_gestione;
end;
$$;

-- Grant invariato rispetto a prima: crea_prenotazione resta
-- genuinamente pubblica, la sua esposizione ad anon è voluta.
revoke all on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb, text
) from public;

grant execute on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb, text
) to anon, authenticated;


-- =================================================================
-- 5) iscriviti_newsletter — stesso trattamento
-- =================================================================
create or replace function public.iscriviti_newsletter(p_email text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alfabeto  constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  v_email     text := lower(btrim(p_email));
  v_codice    text;
  v_esistente text;
  v_tentativi int := 0;
  i           int;
begin
  if v_email is null or v_email = '' or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'email non valida';
  end if;

  if not public.verifica_limite_richieste_newsletter() then
    raise exception 'RATE_LIMITATO';
  end if;

  select codice into v_esistente
    from public.coupon
   where tipo = 'newsletter' and email = v_email;

  if v_esistente is not null then
    return v_esistente;
  end if;

  loop
    v_tentativi := v_tentativi + 1;
    if v_tentativi > 20 then
      raise exception 'impossibile generare un codice coupon univoco';
    end if;

    v_codice := '';
    for i in 1..8 loop
      v_codice := v_codice
        || substr(v_alfabeto, (floor(random() * length(v_alfabeto)))::int + 1, 1);
    end loop;

    begin
      insert into public.coupon (codice, tipo, email, utilizzo_massimo)
      values (v_codice, 'newsletter', v_email, 1);
      return v_codice;
    exception when unique_violation then
      select codice into v_esistente
        from public.coupon
       where tipo = 'newsletter' and email = v_email;
      if v_esistente is not null then
        return v_esistente;
      end if;
    end;
  end loop;
end;
$$;

revoke all on function public.iscriviti_newsletter(text) from public;
grant execute on function public.iscriviti_newsletter(text) to anon, authenticated;


-- =================================================================
-- 6) riscatta_coupon — chiude il buco di grant E la race condition
-- =================================================================
-- Stesso identico buco di pulizia_dati_prenotazioni (revoke solo da
-- public, mai da anon/authenticated) ma senza le sue conseguenze
-- pratiche: SECURITY DEFINER sì, ma con "if auth.uid() is null then
-- raise exception" — un chiamante anonimo veniva comunque respinto
-- prima di leggere o scrivere qualunque riga. Corretto qui per lo
-- stesso principio del resto di questa migration, non perché fosse
-- già sfruttabile.
--
-- Race condition (punto 3 dell'audit): conteggio utilizzi, confronto
-- col tetto e insert del riscatto avvenivano senza alcun lucchetto —
-- due riscatti simultanei sull'ultimo utilizzo disponibile potevano
-- entrambi superare la select-count, leggere lo stesso conteggio
-- ancora sotto il tetto, ed entrambi inserire. Stesso identico
-- pattern già risolto per crea_prenotazione: pg_advisory_xact_lock
-- sulla chiave che identifica la risorsa contesa (qui, il codice
-- stesso) PRIMA di leggere il coupon — non solo prima dell'insert,
-- altrimenti due letture concorrenti passerebbero comunque insieme il
-- controllo prima che il lock abbia un effetto.
create or replace function public.riscatta_coupon(p_codice text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon  public.coupon%rowtype;
  v_oggi    date := (now() at time zone 'Europe/Rome')::date;
  v_usati   integer;
begin
  if auth.uid() is null then
    raise exception 'non autorizzato';
  end if;

  -- Serializza SOLO i riscatti dello stesso codice: due codici
  -- diversi non si aspettano a vicenda.
  perform pg_advisory_xact_lock(hashtextextended(p_codice, 0));

  select * into v_coupon from public.coupon where codice = p_codice;

  if v_coupon.id is null then
    return jsonb_build_object('ok', false, 'motivo', 'non_trovato');
  end if;

  if not v_coupon.attivo then
    return jsonb_build_object('ok', false, 'motivo', 'disattivato');
  end if;

  if v_coupon.valido_dal is not null and v_oggi < v_coupon.valido_dal then
    return jsonb_build_object('ok', false, 'motivo', 'non_ancora_valido');
  end if;

  if v_coupon.valido_al is not null and v_oggi > v_coupon.valido_al then
    return jsonb_build_object('ok', false, 'motivo', 'scaduto');
  end if;

  if v_coupon.utilizzo_massimo is not null then
    select count(*) into v_usati
      from public.coupon_utilizzi
     where coupon_id = v_coupon.id;

    if v_usati >= v_coupon.utilizzo_massimo then
      return jsonb_build_object('ok', false, 'motivo', 'esaurito');
    end if;
  end if;

  insert into public.coupon_utilizzi (coupon_id) values (v_coupon.id);

  return jsonb_build_object(
    'ok', true,
    'codice', v_coupon.codice,
    'tipo', v_coupon.tipo,
    'descrizione', v_coupon.descrizione
  );
end;
$$;

revoke all on function public.riscatta_coupon(text) from public, anon, authenticated;
grant execute on function public.riscatta_coupon(text) to authenticated;


-- =================================================================
-- 7) Le altre 4 funzioni mai state revocate da public — nessun cambio
--    di corpo, solo il grant che avrebbero sempre dovuto avere
-- =================================================================
-- pulizia_dati_prenotazioni: nessun grant a nessuno, di proposito —
-- solo pg_cron/il proprietario devono poterla eseguire. Qui il buco
-- era reale e diretto: SECURITY DEFINER, nessun controllo interno,
-- oggi eseguibile da chiunque con la chiave anon.
revoke all on function public.pulizia_dati_prenotazioni()
  from public, anon, authenticated;

-- save_piatto, save_orari, reorder_piatti, save_evento: mai avuta una
-- revoke da public in nessuna migration — il grant-a-PUBLIC
-- automatico di Postgres alla creazione non è mai stato tolto. Sono
-- SECURITY INVOKER con "if auth.uid() is null then raise exception":
-- non sfruttabili per una scrittura, ma senza motivo per lasciare
-- l'unica barriera a un controllo applicativo interno invece che al
-- permesso della funzione stessa.
revoke all on function public.save_piatto(
  uuid, uuid, text, text, text, text, numeric, boolean, boolean,
  text, smallint[], jsonb, boolean, smallint, boolean, smallint
) from public, anon, authenticated;

grant execute on function public.save_piatto(
  uuid, uuid, text, text, text, text, numeric, boolean, boolean,
  text, smallint[], jsonb, boolean, smallint, boolean, smallint
) to authenticated;

revoke all on function public.save_orari(jsonb) from public, anon, authenticated;
grant execute on function public.save_orari(jsonb) to authenticated;

revoke all on function public.reorder_piatti(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.reorder_piatti(uuid, jsonb) to authenticated;

revoke all on function public.save_evento(
  uuid, text, text, text, text, date, boolean, jsonb
) from public, anon, authenticated;

grant execute on function public.save_evento(
  uuid, text, text, text, text, date, boolean, jsonb
) to authenticated;

-- tocca_aggiornata_il: funzione trigger (returns trigger) — Postgres
-- rifiuta comunque di eseguirla fuori dal contesto di un trigger reale
-- (non esistono NEW/OLD in una chiamata diretta), quindi il grant
-- mancante non era in pratica sfruttabile. Corretta per la stessa
-- igiene delle altre, bassa priorità.
revoke all on function public.tocca_aggiornata_il()
  from public, anon, authenticated;
