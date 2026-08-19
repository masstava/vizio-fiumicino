-- =============================================================
-- Vizio Bistrot — nota orari temporanei
--
-- Gli orari in dashboard possono essere stagionali (es. estivi) e
-- non definitivi. Senza un promemoria, a stagione finita il sito
-- continua a mostrarli in silenzio — e lo stesso dato alimenta PDF
-- e (in futuro) lo schema markup.
--
-- Due campi facoltativi, niente sistema di stagionalità:
--   nota           — testo libero mostrato accanto agli orari
--                    (es. "Orario estivo fino al 31 agosto")
--   valida_fino_al — data oltre la quale la dashboard segnala che
--                    gli orari vanno verificati (solo un avviso:
--                    nessun dato viene cambiato automaticamente)
--
-- Sono impostazioni globali, non per-giorno: stanno in una tabella
-- separata a riga singola, non come colonne duplicate su ogni fascia
-- di public.orari.
--
-- Idempotente: "create table if not exists", insert con
-- "on conflict do nothing", drop+create per le policy (stesso
-- pattern delle migration precedenti).
-- =============================================================

-- La PK boolean con check(id) ammette un solo valore possibile (true):
-- la tabella non può contenere più di una riga, senza bisogno di
-- trigger o vincoli applicativi.
create table if not exists public.orari_config (
  id             boolean primary key default true check (id),
  nota           text,
  valida_fino_al date
);

-- La riga unica deve esistere sempre, così il resto del codice può
-- fare update/select senza gestire il caso "riga assente".
insert into public.orari_config (id) values (true) on conflict (id) do nothing;

alter table public.orari_config enable row level security;

-- Stessa macro delle altre tabelle: lettura pubblica (la nota si
-- mostra sul sito), scrittura solo autenticata.
drop policy if exists "lettura pubblica" on public.orari_config;
drop policy if exists "scrittura auth"   on public.orari_config;
drop policy if exists "modifica auth"    on public.orari_config;
drop policy if exists "elimina auth"     on public.orari_config;

create policy "lettura pubblica" on public.orari_config for select using (true);
create policy "scrittura auth"   on public.orari_config for insert with check (auth.uid() is not null);
create policy "modifica auth"    on public.orari_config for update using (auth.uid() is not null);
create policy "elimina auth"     on public.orari_config for delete using (auth.uid() is not null);
