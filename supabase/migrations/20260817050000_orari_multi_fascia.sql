-- =============================================================
-- Vizio Bistrot — orari: supporto a più fasce orarie per giorno
-- (es. pranzo 12:00–15:00 + cena 18:00–01:00 nello stesso giorno).
--
-- Prima: una riga per giorno_settimana (PK), un'unica fascia.
-- Dopo: più righe per giorno_settimana possibile, ciascuna una
-- fascia distinta con un "ordine" (0 = prima fascia, 1 = seconda...).
--
-- Idempotente: drop+add per i vincoli (stesso pattern già usato per
-- le policy RLS), "add column if not exists" per le colonne.
-- =============================================================

-- Rimuove la chiave primaria su giorno_settimana: ora più righe
-- possono condividere lo stesso giorno.
alter table public.orari drop constraint if exists orari_pkey;

-- Nuova chiave surrogata + numero di fascia. Su una tabella con righe
-- esistenti, "default gen_random_uuid()" viene calcolato per ogni riga
-- già presente (i default non costanti forzano il backfill).
alter table public.orari add column if not exists id uuid not null default gen_random_uuid();
alter table public.orari add column if not exists ordine smallint not null default 0;

alter table public.orari drop constraint if exists orari_id_pkey;
alter table public.orari add constraint orari_id_pkey primary key (id);
