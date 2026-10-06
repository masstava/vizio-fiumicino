-- =============================================================
-- Vizio Bistrot — validazione delle email da campo libero, nel database
-- =============================================================
-- crea_prenotazione e iscriviti_newsletter sono eseguibili da anon e
-- raggiungibili direttamente via PostgREST, saltando le Server Action
-- (stessa lezione dell'audit §22): un controllo solo nell'applicazione
-- non basta. Finora:
--   - crea_prenotazione non controllava l'email: "a@x.it, b@y.it"
--     veniva salvata e la conferma partiva verso più destinatari;
--   - iscriviti_newsletter usava una regex che ammetteva virgole,
--     punti e virgola e < > (es. "a,b@example.com").
--
-- Regola unica, identica a src/lib/email/indirizzo.ts (se cambia una,
-- va cambiata l'altra): UN solo indirizzo, senza spazi o a capo,
-- virgole, punti e virgola, < >; al massimo 254 caratteri.
--
-- Tre livelli:
--   1. public.email_valida — la regola, una volta sola;
--   2. le due RPC la applicano e rispondono EMAIL_NON_VALIDA (l'errore
--      che le Server Action traducono in un messaggio per l'utente);
--   3. vincoli CHECK su prenotazioni.email e coupon.email, per ogni
--      altra strada (lo staff autenticato può aggiornare le righe
--      direttamente via PostgREST).
--
-- RIGHE ESISTENTI: un vincolo, anche NOT VALID, viene ricontrollato a
-- ogni UPDATE della riga — una riga di prova con email malformata
-- impedirebbe perfino di cambiarne lo stato dalla dashboard. Per
-- questo la migration NON tocca dati e si FERMA, prima di qualunque
-- modifica, se trova righe che violerebbero la regola: si decide a mano
-- cosa farne (vedi la query di verifica nel riepilogo della revisione).
--
-- Idempotente: "create or replace", vincoli con drop preventivo.
-- =============================================================

-- ---------------------------------------------------------------
-- 1) La regola
-- ---------------------------------------------------------------
create or replace function public.email_valida(p_email text)
returns boolean
language sql
immutable
parallel safe
set search_path = ''
as $$
  select p_email is not null
     and length(p_email) <= 254
     and p_email ~ '^[^@[:space:]<>,;]+@[^@[:space:]<>,;]+\.[^@[:space:]<>,;]+$';
$$;

-- Eseguibile da tutti di proposito: Postgres verifica il permesso
-- EXECUTE anche quando la funzione è chiamata da un vincolo CHECK, con
-- il ruolo che scrive la riga (es. lo staff autenticato). È una
-- funzione pura su una stringa: non legge né espone nulla.
grant execute on function public.email_valida(text) to anon, authenticated;

-- ---------------------------------------------------------------
-- 2) Stop se esistono righe che violerebbero la regola
-- ---------------------------------------------------------------
do $$
declare
  n_prenotazioni int;
  n_coupon       int;
begin
  select count(*) into n_prenotazioni
    from public.prenotazioni
   where email is not null and not public.email_valida(email);
  select count(*) into n_coupon
    from public.coupon
   where email is not null and not public.email_valida(email);

  if n_prenotazioni > 0 or n_coupon > 0 then
    raise exception 'Email non valide già presenti: % prenotazioni, % coupon. Nessuna modifica applicata: correggerle o svuotarle a mano, poi rilanciare.',
      n_prenotazioni, n_coupon;
  end if;
end;
$$;

-- ---------------------------------------------------------------
-- 3) crea_prenotazione — controllo dell'email (resto invariato da
--    20260904000000)
-- ---------------------------------------------------------------
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
  v_email    text;
begin
  if p_coperti is null or p_coperti <= 0 then
    raise exception 'Numero di coperti non valido';
  end if;

  -- Email facoltativa; se c'è, un solo indirizzo valido (stessa regola
  -- della Server Action). Spazi attorno tolti prima del controllo.
  v_email := nullif(btrim(p_email), '');
  if v_email is not null and not public.email_valida(v_email) then
    raise exception 'EMAIL_NON_VALIDA';
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
      (p_nome, p_telefono, v_email, p_data, p_fascia, p_coperti,
       p_note, p_evento_id, p_risposte_extra, coalesce(p_locale, 'it'))
    returning prenotazioni.id, prenotazioni.token_gestione;
end;
$$;

-- Permessi riscritti come in ogni ridefinizione precedente
-- (20260826, 20260828, 20260904): identici a prima, anon compreso.
revoke all on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb, text
) from public;
grant execute on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb, text
) to anon, authenticated;


-- ---------------------------------------------------------------
-- 4) iscriviti_newsletter — regola unica (resto invariato da
--    20260905000000)
-- ---------------------------------------------------------------
create or replace function public.iscriviti_newsletter(p_email text)
returns table (codice text, token_disiscrizione text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alfabeto  constant text := '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  v_email     text := lower(btrim(p_email));
  v_codice    text;
  v_token     text;
  v_esistente public.coupon%rowtype;
  v_tentativi int := 0;
  i           int;
begin
  -- Prima: una regex propria che ammetteva virgole, punti e virgola e
  -- < > (es. "a,b@example.com"). Ora la regola unica.
  if v_email is null or v_email = '' or not public.email_valida(v_email) then
    raise exception 'EMAIL_NON_VALIDA';
  end if;

  if not public.verifica_limite_richieste_newsletter() then
    raise exception 'RATE_LIMITATO';
  end if;

  select * into v_esistente
    from public.coupon
   where tipo = 'newsletter' and email = v_email;

  if v_esistente.id is not null then
    -- Idempotente per email: stesso codice e stesso token restituiti
    -- sempre. Se il consenso era stato revocato, ri-iscriversi lo
    -- riattiva sulla STESSA riga — vedi il commento in testa alla
    -- migration.
    if v_esistente.consenso_revocato_il is not null then
      update public.coupon
         set consenso_revocato_il = null
       where id = v_esistente.id;
    end if;
    return query select v_esistente.codice, v_esistente.token_disiscrizione;
    return;
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

    v_token := replace(gen_random_uuid()::text, '-', '')
            || replace(gen_random_uuid()::text, '-', '');

    begin
      insert into public.coupon (codice, tipo, email, utilizzo_massimo, token_disiscrizione)
      values (v_codice, 'newsletter', v_email, 1, v_token);
      return query select v_codice, v_token;
      return;
    exception when unique_violation then
      -- Collisione sul codice o sul token, oppure due iscrizioni
      -- concorrenti con la stessa email: in quest'ultimo caso c'è già
      -- una riga da rileggere invece di continuare a tentare.
      select * into v_esistente
        from public.coupon
       where tipo = 'newsletter' and email = v_email;
      if v_esistente.id is not null then
        return query select v_esistente.codice, v_esistente.token_disiscrizione;
        return;
      end if;
    end;
  end loop;
end;
$$;

-- Permessi riscritti come in 20260902, 20260904 e 20260905: identici a
-- prima, anon compreso.
revoke all on function public.iscriviti_newsletter(text) from public;
grant execute on function public.iscriviti_newsletter(text) to anon, authenticated;


-- ---------------------------------------------------------------
-- 5) Vincoli
-- ---------------------------------------------------------------
alter table public.prenotazioni drop constraint if exists prenotazioni_email_valida;
alter table public.prenotazioni
  add constraint prenotazioni_email_valida
  check (email is null or public.email_valida(email));

alter table public.coupon drop constraint if exists coupon_email_valida;
alter table public.coupon
  add constraint coupon_email_valida
  check (email is null or public.email_valida(email));
