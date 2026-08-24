-- =============================================================
-- Vizio Bistrot — traduzione inglese delle macro-categorie
--
-- La migration 20260817090000 aggiungeva nome_en solo a "categorie":
-- le macro erano rimaste scoperte, ma la pagina /menu le chiedeva lo
-- stesso. PostgREST rispondeva 400 e l'intera pagina si svuotava.
--
-- Idempotente: "add column if not exists" e update per nome
-- (rilanciabile senza effetti collaterali, riscrive lo stesso valore).
-- Le macro non elencate qui restano a null e ricadono sull'italiano.
-- =============================================================

alter table public.categorie_macro add column if not exists nome_en text;

update public.categorie_macro as m
set nome_en = v.nome_en
from (values
  ('Da mangiare',    'Food'),
  ('Vini',           'Wines'),
  ('Bar & Cocktail', 'Bar & Cocktails'),
  ('Experience',     'Experience')
) as v(nome, nome_en)
where m.nome = v.nome
  and m.nome_en is distinct from v.nome_en;
