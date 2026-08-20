-- =============================================================
-- Vizio Bistrot — contenuti_sito (CMS leggero, NON editor di layout)
--
-- Decisione di progetto: nessun CMS a blocchi. L'impianto della home
-- resta blindato nel codice (Strato 1). Qui vivono soltanto poche
-- stringhe di testo che il ristoratore deve poter cambiare da solo,
-- senza toccare struttura, ordine o presenza delle sezioni.
--
-- La chiave è tecnica ma non viene mai mostrata in dashboard: la
-- pagina di gestione espone etichette in italiano leggibile
-- ("Titolo principale della home"), mappate lato codice.
--
-- Nessun seed di valori: una chiave assente o vuota fa ricadere la
-- home sul testo attuale scritto nel codice, così il sito non mostra
-- mai uno spazio vuoto.
--
-- Idempotente: "create table if not exists" + drop/create policy.
-- =============================================================

create table if not exists public.contenuti_sito (
  chiave    text primary key,
  valore    text,
  valore_en text
);

alter table public.contenuti_sito enable row level security;

drop policy if exists "lettura pubblica" on public.contenuti_sito;
drop policy if exists "scrittura auth"   on public.contenuti_sito;
drop policy if exists "modifica auth"    on public.contenuti_sito;
drop policy if exists "elimina auth"     on public.contenuti_sito;

create policy "lettura pubblica" on public.contenuti_sito for select using (true);
create policy "scrittura auth"   on public.contenuti_sito for insert with check (auth.uid() is not null);
create policy "modifica auth"    on public.contenuti_sito for update using (auth.uid() is not null);
create policy "elimina auth"     on public.contenuti_sito for delete using (auth.uid() is not null);
