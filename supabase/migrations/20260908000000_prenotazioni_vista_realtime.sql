-- =============================================================
-- Vizio Bistrot — dashboard prenotazioni: colonna "vista" + Realtime (§ mockup approvato)
-- =============================================================
-- Solo schema e collegamento Realtime: nessuna interfaccia in questa
-- migration (striscia settimanale, toast, refresh generale arrivano
-- dopo, su un prompt separato).
--
-- Migration idempotente: "add column if not exists", indice "if not
-- exists", "alter publication" guardato da un controllo su
-- pg_publication_tables (non esiste una forma "if not exists" per
-- quel comando).
-- =============================================================


-- ---------------------------------------------------------------
-- 1) prenotazioni.vista
-- ---------------------------------------------------------------
-- true = lo staff ha già aperto il pannello di dettaglio di questa
-- prenotazione almeno una volta. Si imposta una sola volta e non
-- torna mai a false: serve a sapere cosa non è ancora stato guardato,
-- non a tracciare l'ultima apertura.
--
-- Nessun default retroattivo diverso da false: le prenotazioni già
-- esistenti risultano "non viste" finché lo staff non apre ciascuna
-- almeno una volta. È il comportamento corretto per un contatore che
-- deve riflettere lo stato reale della coda di lavoro, non nascondere
-- lavoro arretrato dietro un backfill comodo.
alter table public.prenotazioni
  add column if not exists vista boolean not null default false;

-- Serve esattamente alla query che pallino e contatore faranno:
-- "quali/quante prenotazioni non viste in un intervallo di date".
-- Parziale (where vista = false): resta piccolo e si restringe da
-- solo mano a mano che lo staff apre le prenotazioni, invece di
-- crescere con l'intera tabella.
create index if not exists prenotazioni_non_viste_idx
  on public.prenotazioni (data)
  where vista = false;

-- NOTA: la colonna è raggiungibile dalle policy RLS già esistenti su
-- prenotazioni (select/update per auth.uid() is not null) — nessuna
-- policy nuova o modificata qui. Il trigger prenotazioni_aggiornata_il
-- (dalla migration 20260825000000) tocca comunque aggiornata_il anche
-- quando si aggiorna solo "vista": stesso comportamento già in vigore
-- per qualunque altro update sulla riga, non un caso speciale da
-- gestire qui.


-- ---------------------------------------------------------------
-- 2) Realtime — abilitazione a livello di tabella
-- ---------------------------------------------------------------
-- Supabase Realtime (evento "Postgres Changes") trasmette solo le
-- modifiche delle tabelle incluse nella publication "supabase_realtime"
-- — questa riga è l'equivalente esatto del toggle "Enable Realtime"
-- che si vede accanto alla tabella in Database > Replication sul
-- pannello Supabase: quel toggle non fa altro che questo ALTER
-- PUBLICATION. Farlo qui invece che a mano nel pannello significa che
-- l'abilitazione è nel repo, si riapplica da sola su ogni ambiente
-- (staging/produzione) e non dipende dal ricordarsi di rifare un click.
--
-- "alter publication ... add table" non ha una forma "if not exists":
-- rilanciarlo su una tabella già presente darebbe errore
-- (42710/duplicate_object) e romperebbe l'idempotenza di questa
-- migration. Il blocco sotto controlla pg_publication_tables prima di
-- agire, stesso principio dei controlli già usati altrove nel
-- progetto per operazioni senza una forma "if not exists" nativa.
do $$
begin
  if not exists (
    select 1
      from pg_publication_tables
     where pubname    = 'supabase_realtime'
       and schemaname  = 'public'
       and tablename   = 'prenotazioni'
  ) then
    alter publication supabase_realtime add table public.prenotazioni;
  end if;
end $$;

-- NON serve "replica identity full" per questo passo: l'evento che
-- serve ora è solo INSERT (toast di nuova prenotazione), e su INSERT
-- Postgres include comunque la riga intera nel replication feed a
-- prescindere dalla replica identity. Servirà rivalutarlo quando (fuori
-- da questo prompt) si vorrà ascoltare anche UPDATE/DELETE per il
-- refresh generale della sezione: lì la riga "prima della modifica"
-- richiede la replica identity, altrimenti Realtime la manda a null.
