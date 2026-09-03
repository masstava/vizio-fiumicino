-- =============================================================
-- Vizio Bistrot — sistema coupon unificato (newsletter + campagne)
-- =============================================================
-- Una sola tabella "coupon" copre due casi d'uso distinti:
--   - tipo 'newsletter': generato automaticamente da iscriviti_newsletter,
--     una riga per email, sempre utilizzo_massimo = 1;
--   - tipo 'campagna': codice scelto dallo staff (es. "PROMOSVALE"),
--     condiviso fra più clienti, con finestra di validità e/o tetto
--     utilizzi opzionali.
--
-- "coupon_utilizzi" è il registro dei riscatti: un coupon campagna può
-- essere riscattato più volte da persone diverse, un singolo flag
-- "usato_il" sulla riga del coupon non basterebbe a distinguerli.
--
-- Migration idempotente: "create table if not exists" + drop/create
-- per policy e funzioni, "create or replace" per le funzioni.
-- =============================================================


-- ---------------------------------------------------------------
-- coupon
-- ---------------------------------------------------------------
create table if not exists public.coupon (
  id                uuid primary key default gen_random_uuid(),
  codice            text not null,
  tipo              text not null,
  descrizione       text,
  email             text,
  valido_dal        date,
  valido_al         date,
  utilizzo_massimo  int,
  attivo            boolean not null default true,
  creato_il         timestamptz not null default now(),

  constraint coupon_codice_unique unique (codice),

  constraint coupon_tipo_valido
    check (tipo in ('newsletter', 'campagna')),

  -- Un coupon newsletter è sempre legato a un'email (chi si iscrive),
  -- un coupon campagna non ne ha una: è condiviso, non nominale.
  constraint coupon_email_per_tipo
    check (
      (tipo = 'newsletter' and email is not null)
      or
      (tipo = 'campagna' and email is null)
    ),

  -- Il testo del coupon newsletter ricade sempre sullo stesso
  -- messaggio standard in contenuti_sito: qui può restare vuoto. Un
  -- coupon campagna invece è testo libero scelto dallo staff apposta
  -- per quella promozione, e senza non si saprebbe cosa mostrare.
  constraint coupon_descrizione_per_campagna
    check (
      tipo <> 'campagna'
      or (descrizione is not null and btrim(descrizione) <> '')
    ),

  constraint coupon_finestra_valida
    check (valido_dal is null or valido_al is null or valido_dal <= valido_al),

  constraint coupon_utilizzo_massimo_positivo
    check (utilizzo_massimo is null or utilizzo_massimo > 0)
);

-- Vincolo di unicità PARZIALE: un'email può comparire una sola volta
-- fra i coupon newsletter, ma la colonna è nullable (i coupon
-- campagna non hanno email) e una "unique" semplice su una colonna
-- nullable non impedirebbe comunque due NULL — qui serve vincolare
-- solo le righe newsletter, non le altre.
create unique index if not exists coupon_email_newsletter_unique_idx
  on public.coupon (email)
  where tipo = 'newsletter';

-- Lookup per codice (riscatta_coupon) — già coperto dal vincolo
-- unique su codice, che crea comunque un indice.

create index if not exists coupon_tipo_idx on public.coupon (tipo);


-- ---------------------------------------------------------------
-- coupon_utilizzi — registro dei riscatti
-- ---------------------------------------------------------------
create table if not exists public.coupon_utilizzi (
  id             uuid primary key default gen_random_uuid(),
  coupon_id      uuid not null references public.coupon (id) on delete cascade,
  utilizzato_il  timestamptz not null default now()
);

-- riscatta_coupon conta gli utilizzi di un coupon per confrontarli
-- col tetto: un indice sulla FK serve esattamente quella query.
create index if not exists coupon_utilizzi_coupon_idx
  on public.coupon_utilizzi (coupon_id);


-- ---------------------------------------------------------------
-- RLS — coupon
-- ---------------------------------------------------------------
-- Nessuna lettura pubblica (i coupon newsletter portano un'email —
-- dato personale) e nessun inserimento pubblico diretto: l'iscrizione
-- newsletter passa solo da iscriviti_newsletter, un coupon campagna lo
-- crea solo lo staff dalla dashboard.
alter table public.coupon enable row level security;

drop policy if exists "lettura auth"   on public.coupon;
drop policy if exists "scrittura auth" on public.coupon;
drop policy if exists "modifica auth"  on public.coupon;

create policy "lettura auth"   on public.coupon for select using (auth.uid() is not null);
create policy "scrittura auth" on public.coupon for insert with check (auth.uid() is not null);
create policy "modifica auth"  on public.coupon for update using (auth.uid() is not null);

-- Nessuna policy di elimina, di proposito: cancellare un coupon
-- cancellerebbe a cascata anche il suo registro utilizzi (audit dei
-- riscatti). Per ritirare un coupon lo staff lo disattiva
-- (attivo = false), non lo elimina.


-- ---------------------------------------------------------------
-- RLS — coupon_utilizzi
-- ---------------------------------------------------------------
-- Lettura per lo staff (deve poter vedere lo storico riscatti), ma
-- NESSUNA policy di scrittura, nemmeno per l'utente autenticato: se lo
-- staff potesse inserire una riga direttamente, potrebbe farlo
-- bypassando i controlli di riscatta_coupon (attivo, finestra di
-- validità, tetto utilizzi già raggiunto). L'unico modo di scrivere
-- qui è la funzione sotto, che gira con i privilegi del proprietario.
alter table public.coupon_utilizzi enable row level security;

drop policy if exists "lettura auth" on public.coupon_utilizzi;

create policy "lettura auth" on public.coupon_utilizzi for select using (auth.uid() is not null);


-- ---------------------------------------------------------------
-- rate-limit dedicato per iscriviti_newsletter — mirror esatto di
-- limite_richieste_prenotazione (20260830010000), volutamente
-- separato: un budget per IP condiviso fra due form scorrelati
-- lascerebbe che il traffico dell'uno esaurisca quello dell'altro.
-- ---------------------------------------------------------------
create table if not exists public.limite_richieste_newsletter (
  id        bigint generated always as identity primary key,
  ip        text not null,
  creata_il timestamptz not null default now()
);

create index if not exists limite_richieste_newsletter_ip_idx
  on public.limite_richieste_newsletter (ip, creata_il);

-- RLS attiva, nessuna policy: stessa ragione di
-- limite_richieste_prenotazione, l'unico accesso è la funzione sotto.
alter table public.limite_richieste_newsletter enable row level security;

create or replace function public.verifica_limite_richieste_newsletter(p_ip text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conteggio integer;
begin
  if p_ip is null or btrim(p_ip) = '' then
    return true;
  end if;

  select count(*) into v_conteggio
    from public.limite_richieste_newsletter
   where ip = p_ip
     and creata_il > now() - interval '10 minutes';

  if v_conteggio >= 5 then
    return false;
  end if;

  insert into public.limite_richieste_newsletter (ip) values (p_ip);
  return true;
end;
$$;

revoke all on function public.verifica_limite_richieste_newsletter(text) from public;
grant execute on function public.verifica_limite_richieste_newsletter(text) to anon, authenticated;


-- ---------------------------------------------------------------
-- iscriviti_newsletter — chiamata pubblica, crea un coupon newsletter
-- ---------------------------------------------------------------
-- SECURITY DEFINER: chi chiama è anonimo e non ha (né deve avere)
-- alcun permesso diretto sulla tabella "coupon" — stessa ragione già
-- documentata per le funzioni di auto-gestione prenotazioni.
--
-- Idempotente per email: stessa email due volte non crea un secondo
-- coupon né restituisce un errore che riveli l'iscrizione altrui —
-- restituisce semplicemente lo stesso codice di sempre.
--
-- L'alfabeto del codice esclude 0/O/1/I/L: leggibile ad alta voce e
-- digitabile senza ambiguità.
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
      -- Collisione sul codice, oppure due iscrizioni concorrenti con
      -- la stessa email: in quel caso c'è già una riga da rileggere
      -- invece di continuare a tentare un nuovo codice.
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


-- ---------------------------------------------------------------
-- riscatta_coupon — uso staff, registra un riscatto in cassa
-- ---------------------------------------------------------------
-- SECURITY DEFINER anche qui, ma per un motivo diverso dalle funzioni
-- anonime sopra: chi chiama è staff già autenticato e ha già, tramite
-- RLS, il permesso di leggere "coupon" — ma NON quello di scrivere
-- direttamente in "coupon_utilizzi" (di proposito: vedi la policy
-- sopra). La funzione gira con i privilegi del proprietario proprio
-- per poter registrare il riscatto senza aprire quella scrittura
-- diretta a tutto il resto del pannello staff.
--
-- Il confronto con "oggi" usa il fuso di Roma, non current_date: su
-- Supabase il TimeZone di sessione è UTC, e current_date calcolerebbe
-- la data sbagliata nelle ore fra mezzanotte UTC e mezzanotte locale
-- (stesso bug già corretto due volte in questo progetto sui contatori
-- eventi/prenotazioni in sidebar).
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

revoke all on function public.riscatta_coupon(text) from public;
grant execute on function public.riscatta_coupon(text) to authenticated;
