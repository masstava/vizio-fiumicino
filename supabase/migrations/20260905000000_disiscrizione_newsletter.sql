-- =============================================================
-- Vizio Bistrot — meccanismo reale di disiscrizione dalla newsletter
-- =============================================================
-- La Privacy Policy prometteva un link di disiscrizione che non
-- esisteva: l'email di benvenuto non ne contiene uno, e coupon non ha
-- alcuna colonna che registri una revoca. Questa migration costruisce
-- il meccanismo vero: un token dedicato, una colonna che registra la
-- revoca, e la RPC che la applica.
--
-- TOKEN SEPARATO DAL CODICE SCONTO, non riusato — decisione presa dal
-- committente, motivata: il codice sconto è pensato per essere
-- condiviso/mostrato in cassa, un token di disiscrizione deve restare
-- noto solo al diretto interessato, altrimenti chiunque riceva il
-- codice condiviso potrebbe disiscrivere il titolare originale. Per
-- lo stesso motivo l'email non può fare da identificatore nel link:
-- è univoca ma non segreta, chiunque la conosca disiscriverebbe
-- chiunque altro.
--
-- Stessa entropia già in uso in questo progetto per lo stesso scopo
-- (prenotazioni.token_gestione, 20260825000000): due uuid v4
-- concatenati senza trattini, 64 caratteri esadecimali, ~244 bit —
-- non lo stesso VALORE per definizione (sono generati indipendentemente
-- e servono a tabelle diverse), stesso SCHEMA di generazione, per
-- coerenza e perché il ragionamento sull'entropia vale identico qui.
--
-- RIATTIVAZIONE vs NUOVA RIGA — chi si disiscrive e poi si re-iscrive
-- con la stessa email riattiva la STESSA riga (consenso_revocato_il
-- torna a null), non ne crea una seconda. Due motivi, non uno:
--   1. coerenza con la decisione già presa che iscrizione e coupon
--      sono la stessa riga (audit sicurezza, 2026-09-04): una seconda
--      riga per la stessa email romperebbe di nuovo quella modellazione
--      e richiederebbe un vincolo di unicità più complesso (l'attuale
--      indice unique su coupon_email_newsletter_unique_idx dovrebbe
--      diventare condizionale anche allo stato di revoca).
--   2. anti-abuso: se ogni ri-iscrizione generasse un coupon NUOVO,
--      disiscriversi e re-iscriversi sarebbe un modo per farmare più
--      coupon "-10% prima visita" con la stessa email, un utilizzo
--      ciascuno — esattamente quello che utilizzo_massimo=1 vuole
--      impedire. Riattivare la stessa riga (stesso codice, comunque
--      soggetto al suo tetto di utilizzo già esistente) non apre
--      questa strada.
--
-- Migration idempotente: "add column if not exists", backfill con
-- where mirato (non ri-genera token già presenti), vincoli con drop
-- preventivo, funzioni "create or replace".
-- =============================================================


-- ---------------------------------------------------------------
-- Nuove colonne su coupon
-- ---------------------------------------------------------------
alter table public.coupon add column if not exists token_disiscrizione text;
alter table public.coupon add column if not exists consenso_revocato_il timestamptz;

-- Backfill: qualunque riga newsletter già esistente (create prima di
-- questa migration) riceve un token adesso, altrimenti il vincolo
-- sotto la respingerebbe. Il "where" la rende rilanciabile: una riga
-- che ha già un token non viene toccata una seconda volta.
update public.coupon
   set token_disiscrizione =
         replace(gen_random_uuid()::text, '-', '')
         || replace(gen_random_uuid()::text, '-', '')
 where tipo = 'newsletter'
   and token_disiscrizione is null;

alter table public.coupon drop constraint if exists coupon_token_disiscrizione_unique;
alter table public.coupon
  add constraint coupon_token_disiscrizione_unique unique (token_disiscrizione);

-- Stesso principio già in uso per email/descrizione: una colonna
-- specifica di un tipo è vietata per l'altro, non semplicemente
-- ignorata.
alter table public.coupon drop constraint if exists coupon_token_disiscrizione_per_tipo;
alter table public.coupon
  add constraint coupon_token_disiscrizione_per_tipo
  check (
    (tipo = 'newsletter' and token_disiscrizione is not null)
    or
    (tipo = 'campagna' and token_disiscrizione is null)
  );


-- ---------------------------------------------------------------
-- iscriviti_newsletter — genera anche il token, gestisce la riattivazione
-- ---------------------------------------------------------------
-- Cambia il TIPO DI RITORNO (non solo il corpo): prima restituiva
-- solo il codice sconto, ora anche il token di disiscrizione — serve
-- all'email di benvenuto per costruire il link vero. Un cambio di
-- ritorno, come un cambio di firma, richiede "drop" esplicito: "create
-- or replace" da solo non può cambiare cosa restituisce una funzione.
drop function if exists public.iscriviti_newsletter(text);

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
  if v_email is null or v_email = '' or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'email non valida';
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

revoke all on function public.iscriviti_newsletter(text) from public;
grant execute on function public.iscriviti_newsletter(text) to anon, authenticated;


-- ---------------------------------------------------------------
-- disiscriviti_newsletter — unica via di revoca
-- ---------------------------------------------------------------
-- SECURITY DEFINER: chi chiama arriva dal link nell'email, spesso
-- senza sessione autenticata — stessa ragione già documentata per
-- annulla_prenotazione/prenotazione_da_token. Nessuna lettura pubblica
-- di coupon: la funzione legge solo la riga che corrisponde al token,
-- mai un filtro arbitrario (il parametro è solo il token, non un id o
-- un'email).
--
-- Due motivi di rifiuto distinti, non un booleano solo: chi visita il
-- link deve poter distinguere "link rotto/scaduto" da "ti sei già
-- disiscritto" (quest'ultimo non è un errore, è già lo stato voluto).
create or replace function public.disiscriviti_newsletter(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupon public.coupon%rowtype;
begin
  select * into v_coupon
    from public.coupon
   where tipo = 'newsletter' and token_disiscrizione = p_token;

  if v_coupon.id is null then
    return jsonb_build_object('ok', false, 'motivo', 'token_non_valido');
  end if;

  if v_coupon.consenso_revocato_il is not null then
    return jsonb_build_object('ok', false, 'motivo', 'gia_disiscritto');
  end if;

  update public.coupon
     set consenso_revocato_il = now()
   where id = v_coupon.id;

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.disiscriviti_newsletter(text) from public, anon, authenticated;
grant execute on function public.disiscriviti_newsletter(text) to anon, authenticated;
