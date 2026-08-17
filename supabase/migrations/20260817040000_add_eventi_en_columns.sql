-- =============================================================
-- Vizio Bistrot — colonne multilingua per eventi
-- Idempotente: "add column if not exists".
-- =============================================================

alter table public.eventi add column if not exists titolo_en text;
alter table public.eventi add column if not exists descrizione_en text;
