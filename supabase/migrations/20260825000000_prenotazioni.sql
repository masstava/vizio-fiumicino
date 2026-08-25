-- =============================================================
-- Vizio Bistrot — prenotazioni (§21, passo 1: solo schema)
-- =============================================================
-- Tre tabelle: prenotazioni, capienza_config, campi_extra_evento.
--
-- ATTENZIONE — la RLS di "prenotazioni" NON segue il pattern del
-- resto del progetto, ed è deliberato. Le altre tabelle hanno
-- "lettura pubblica using (true)" perché contengono dati pubblici per
-- natura (menu, orari, eventi). Qui ci sono nome, telefono ed email di
-- persone reali: la stessa policy applicata per abitudine renderebbe
-- l'intera rubrica clienti leggibile da chiunque abbia la chiave anon,
-- che è pubblica per definizione.
--
-- Migration idempotente: "if not exists" ovunque, policy ricreate con
-- drop preventivo, funzioni con "create or replace".
-- =============================================================


-- ---------------------------------------------------------------
-- prenotazioni
-- ---------------------------------------------------------------
-- fascia: ora di inizio del turno prenotato (es. 20:00). Vedi la nota
-- sulla modellazione in fondo al file: è l'unica decisione di disegno
-- che ho dovuto prendere da solo.
create table if not exists public.prenotazioni (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  telefono        text not null,
  email           text,
  data            date not null,
  fascia          time not null,
  coperti         smallint not null,
  note            text,
  stato           text not null default 'confermata',
  evento_id       uuid references public.eventi (id) on delete set null,
  risposte_extra  jsonb,

  -- Token del link di auto-gestione. NON è un id sequenziale né un
  -- uuid singolo prevedibile: due uuid v4 concatenati, 64 caratteri
  -- esadecimali, circa 244 bit di entropia. Indovinarlo non è una
  -- strada praticabile, che è il punto — chi ha il link può annullare
  -- la prenotazione senza autenticarsi.
  --
  -- Perché non pgcrypto/gen_random_bytes: su Supabase le estensioni
  -- stanno nello schema "extensions" e il riferimento andrebbe
  -- qualificato, rendendo la migration dipendente da come è
  -- installata l'estensione su quel progetto. gen_random_uuid() è
  -- nel core da PostgreSQL 13 e usa comunque un generatore
  -- crittografico.
  token_gestione  text not null unique
    default replace(gen_random_uuid()::text, '-', '')
         || replace(gen_random_uuid()::text, '-', ''),

  creata_il       timestamptz not null default now(),
  aggiornata_il   timestamptz not null default now(),

  constraint prenotazioni_stato_valido
    check (stato in ('confermata', 'cancellata', 'completata', 'no-show')),
  constraint prenotazioni_coperti_positivi
    check (coperti > 0)
);

-- Verifiche di capienza: si contano i coperti di una data e fascia.
create index if not exists prenotazioni_data_fascia_idx
  on public.prenotazioni (data, fascia);

-- Lookup dal link di auto-gestione. È già unique (quindi indicizzato),
-- ma il vincolo è dichiarato sulla colonna: l'indice esiste di
-- conseguenza e non serve crearne un secondo.

-- L'agenda di sala si legge per giorno, escludendo le cancellate.
create index if not exists prenotazioni_data_stato_idx
  on public.prenotazioni (data, stato);

-- Le prenotazioni legate a un evento si contano per evento.
create index if not exists prenotazioni_evento_idx
  on public.prenotazioni (evento_id)
  where evento_id is not null;


-- ---------------------------------------------------------------
-- capienza_config
-- ---------------------------------------------------------------
-- Riga presente = quella fascia ha un tetto. Riga assente = nessun
-- limite. Non si pre-popola nulla: si aggiunge una riga solo dove
-- serve limitare.
create table if not exists public.capienza_config (
  data            date not null,
  fascia          time not null,
  limite_coperti  smallint,
  evento_id       uuid references public.eventi (id) on delete cascade,

  primary key (data, fascia),

  constraint capienza_limite_positivo
    check (limite_coperti is null or limite_coperti > 0)
);


-- ---------------------------------------------------------------
-- campi_extra_evento
-- ---------------------------------------------------------------
-- Domande aggiuntive mostrate nel form quando si prenota per un
-- evento specifico. Le risposte finiscono in prenotazioni.risposte_extra.
--
-- Il massimo di 3 campi per evento NON è un vincolo del database, per
-- scelta: è lo stesso trattamento già dato a "max 3 piatti in
-- evidenza", dove il limite vive nell'interfaccia. Un check qui
-- farebbe fallire un insert legittimo con un errore incomprensibile,
-- mentre in dashboard il limite si spiega mentre lo si raggiunge.
create table if not exists public.campi_extra_evento (
  id         uuid primary key default gen_random_uuid(),
  evento_id  uuid not null references public.eventi (id) on delete cascade,
  etichetta  text not null,
  ordine     smallint not null default 0
);

create index if not exists campi_extra_evento_evento_idx
  on public.campi_extra_evento (evento_id, ordine);


-- ---------------------------------------------------------------
-- aggiornata_il automatico
-- ---------------------------------------------------------------
create or replace function public.tocca_aggiornata_il()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.aggiornata_il := now();
  return new;
end;
$$;

drop trigger if exists prenotazioni_aggiornata_il on public.prenotazioni;
create trigger prenotazioni_aggiornata_il
  before update on public.prenotazioni
  for each row execute function public.tocca_aggiornata_il();


-- ---------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------
alter table public.prenotazioni       enable row level security;
alter table public.capienza_config    enable row level security;
alter table public.campi_extra_evento enable row level security;

-- --- prenotazioni: NESSUNA lettura pubblica ---------------------
drop policy if exists "inserimento pubblico" on public.prenotazioni;
drop policy if exists "lettura auth"         on public.prenotazioni;
drop policy if exists "modifica auth"        on public.prenotazioni;
drop policy if exists "elimina auth"         on public.prenotazioni;

-- Chiunque può creare una prenotazione dal form, senza autenticarsi.
--
-- ATTENZIONE, da rivedere al passo 2: finché questa policy esiste,
-- chiunque abbia la chiave anon può inserire una riga chiamando
-- direttamente l'endpoint REST, SALTANDO qualunque verifica di
-- capienza fatta dalla funzione di creazione. Quando la RPC atomica
-- sarà pronta, questa policy va REVOCATA e l'inserimento deve
-- passare solo da lì.
create policy "inserimento pubblico" on public.prenotazioni
  for insert with check (true);

-- Volutamente NON esiste una policy di select per il pubblico: senza,
-- una select con chiave anon non restituisce righe. Conseguenza
-- pratica per chi scriverà il form: l'insert va fatto SENZA .select()
-- di ritorno, altrimenti Supabase prova a rileggere la riga appena
-- scritta e fallisce.
create policy "lettura auth" on public.prenotazioni
  for select using (auth.uid() is not null);

create policy "modifica auth" on public.prenotazioni
  for update using (auth.uid() is not null);

create policy "elimina auth" on public.prenotazioni
  for delete using (auth.uid() is not null);

-- --- capienza_config: pubblica in lettura -----------------------
-- Il form deve poter sapere se una fascia è al completo prima di far
-- compilare tutto. Qui non ci sono dati personali: solo un numero.
drop policy if exists "lettura pubblica" on public.capienza_config;
drop policy if exists "scrittura auth"   on public.capienza_config;
drop policy if exists "modifica auth"    on public.capienza_config;
drop policy if exists "elimina auth"     on public.capienza_config;

create policy "lettura pubblica" on public.capienza_config for select using (true);
create policy "scrittura auth"   on public.capienza_config for insert with check (auth.uid() is not null);
create policy "modifica auth"    on public.capienza_config for update using (auth.uid() is not null);
create policy "elimina auth"     on public.capienza_config for delete using (auth.uid() is not null);

-- --- campi_extra_evento: pubblica in lettura --------------------
drop policy if exists "lettura pubblica" on public.campi_extra_evento;
drop policy if exists "scrittura auth"   on public.campi_extra_evento;
drop policy if exists "modifica auth"    on public.campi_extra_evento;
drop policy if exists "elimina auth"     on public.campi_extra_evento;

create policy "lettura pubblica" on public.campi_extra_evento for select using (true);
create policy "scrittura auth"   on public.campi_extra_evento for insert with check (auth.uid() is not null);
create policy "modifica auth"    on public.campi_extra_evento for update using (auth.uid() is not null);
create policy "elimina auth"     on public.campi_extra_evento for delete using (auth.uid() is not null);


-- ---------------------------------------------------------------
-- Auto-gestione via token — il cliente non tocca mai la tabella
-- ---------------------------------------------------------------
-- Queste due funzioni sono l'UNICO modo in cui un utente non
-- autenticato può vedere o modificare una prenotazione.
--
-- security definer, a differenza di save_piatto e save_orari che sono
-- invoker: quelle girano per uno staff già autenticato, che ha i
-- permessi. Qui l'utente è anonimo e per definizione non ha alcun
-- permesso sulla tabella — è proprio quello che vogliamo. La funzione
-- gira con i privilegi del proprietario, valida il token al suo
-- interno e restituisce solo la riga che corrisponde.
--
-- Le tre precauzioni che rendono definer accettabile qui:
--   1. set search_path = public — impedisce di dirottare i nomi non
--      qualificati creando oggetti omonimi in uno schema in testa al
--      search_path di chi chiama;
--   2. revoke from public, poi grant esplicito ai soli ruoli previsti;
--   3. la funzione non accetta MAI un id o un filtro arbitrario, solo
--      il token: non esiste un parametro con cui allargare la query.

create or replace function public.prenotazione_da_token(p_token text)
returns table (
  id            uuid,
  nome          text,
  data          date,
  fascia        time,
  coperti       smallint,
  note          text,
  stato         text,
  evento_id     uuid,
  creata_il     timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  -- Si restituisce un sottoinsieme delle colonne: telefono, email,
  -- token e risposte_extra non servono a mostrare la prenotazione a
  -- chi l'ha fatta, e ciò che non esce non può essere esposto per
  -- errore da un componente distratto.
  select p.id, p.nome, p.data, p.fascia, p.coperti, p.note,
         p.stato, p.evento_id, p.creata_il
  from public.prenotazioni p
  where p.token_gestione = p_token;
$$;

create or replace function public.annulla_prenotazione(p_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_righe integer;
begin
  update public.prenotazioni
     set stato = 'cancellata'
   where token_gestione = p_token
     and stato = 'confermata';

  get diagnostics v_righe = row_count;
  return v_righe > 0;
end;
$$;

-- Nessuno può eseguirle se non i ruoli elencati: "public" include
-- anche ruoli futuri, quindi si revoca prima e si concede dopo.
revoke all on function public.prenotazione_da_token(text) from public;
revoke all on function public.annulla_prenotazione(text)  from public;

grant execute on function public.prenotazione_da_token(text) to anon, authenticated;
grant execute on function public.annulla_prenotazione(text)  to anon, authenticated;


-- =============================================================
-- SCHIZZO, NON ATTIVO — creazione atomica al passo 2
-- =============================================================
-- Il problema: due richieste simultanee sull'ultimo posto della
-- stessa fascia. Entrambe contano i coperti, entrambe vedono che c'è
-- spazio, entrambe inseriscono. Il limite viene superato e nessuna
-- delle due query è sbagliata presa da sola.
--
-- Contare e poi inserire in due istruzioni separate non basta,
-- nemmeno dentro una transazione: in READ COMMITTED la seconda
-- transazione non vede l'insert non ancora committato della prima.
-- Serve che le due richieste si mettano in fila.
--
-- Stessa logica di save_orari — un'unica funzione, una sola
-- transazione implicita — con in più un lucchetto sulla coppia
-- (data, fascia): non blocca l'intera tabella, solo chi prenota per
-- lo stesso turno. Si rilascia da solo al commit.
--
-- create or replace function public.crea_prenotazione(
--   p_nome text, p_telefono text, p_email text,
--   p_data date, p_fascia time, p_coperti smallint,
--   p_note text, p_evento_id uuid, p_risposte_extra jsonb
-- )
-- returns text                     -- il token, da mettere nel link
-- language plpgsql
-- security definer
-- set search_path = public
-- as $$
-- declare
--   v_limite   smallint;
--   v_occupati integer;
--   v_token    text;
-- begin
--   if p_coperti is null or p_coperti <= 0 then
--     raise exception 'Numero di coperti non valido';
--   end if;
--
--   -- Serializza SOLO chi prenota per la stessa data e fascia.
--   -- hashtextextended dà un bigint stabile dalla coppia; il lock è
--   -- di transazione, quindi si rilascia da solo al commit o al
--   -- rollback, senza bisogno di ricordarsene.
--   perform pg_advisory_xact_lock(
--     hashtextextended(p_data::text || ' ' || p_fascia::text, 0)
--   );
--
--   -- Da qui in poi siamo soli su questa fascia.
--   select limite_coperti into v_limite
--     from public.capienza_config
--    where data = p_data and fascia = p_fascia;
--
--   if v_limite is not null then
--     select coalesce(sum(coperti), 0) into v_occupati
--       from public.prenotazioni
--      where data = p_data and fascia = p_fascia
--        and stato in ('confermata', 'completata');
--
--     if v_occupati + p_coperti > v_limite then
--       raise exception 'CAPIENZA_ESAURITA'
--         using detail = format('%s posti liberi', v_limite - v_occupati);
--     end if;
--   end if;
--
--   insert into public.prenotazioni
--     (nome, telefono, email, data, fascia, coperti, note,
--      evento_id, risposte_extra)
--   values
--     (p_nome, p_telefono, p_email, p_data, p_fascia, p_coperti,
--      p_note, p_evento_id, p_risposte_extra)
--   returning token_gestione into v_token;
--
--   return v_token;
-- end;
-- $$;
--
-- Quando questa funzione entrerà in servizio:
--   - revocare la policy "inserimento pubblico" su prenotazioni,
--     altrimenti resta una porta che salta la verifica di capienza;
--   - grant execute a anon, authenticated, con revoke from public
--     come sopra.
-- =============================================================


-- =============================================================
-- NOTA DI MODELLAZIONE — "fascia"
-- =============================================================
-- "fascia" è qui l'ORA DI INIZIO del turno (time), non un nome di
-- periodo ('pranzo', 'cena'). Nella specifica prenotazioni ha data,
-- fascia e coperti ma nessun campo orario separato: se fascia fosse
-- un'etichetta, non resterebbe da nessuna parte l'ora effettiva della
-- prenotazione, che è il dato che serve alla sala.
--
-- Conseguenza su capienza_config: si aggiunge una riga solo per le
-- fasce che si vogliono limitare, quindi il carico di
-- configurazione resta basso anche con turni ogni mezz'ora.
--
-- Se invece "fascia" doveva essere il nome del periodo, il cambio è
-- circoscritto: "time" diventa "text" con un check sui valori
-- ammessi, in tre punti (prenotazioni, capienza_config e la funzione
-- di creazione). Meglio deciderlo ora che dopo il primo dato reale.
-- =============================================================
