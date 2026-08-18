-- =============================================================
-- Vizio Bistrot — traduzione inglese delle categorie
-- Idempotente: "add column if not exists", update per nome+macro
-- (rilanciabile senza effetti collaterali, riscrive sempre lo stesso
-- valore).
-- =============================================================

alter table public.categorie add column if not exists nome_en text;

update public.categorie as c
set nome_en = v.nome_en
from (values
  ('Aperitivo',  'Aperitif'),
  ('Fritti',     'Fried Snacks'),
  ('Pinse',      'Flatbread'),
  ('Special',    'Special'),
  ('Vizi Caldi', 'Hot Temptations'),
  ('Burger',     'Burger'),
  ('Taglieri',   'Charcuterie Boards'),
  ('Crudi',      'Raw Selection'),
  ('Carne',      'Meat'),
  ('Contorni',   'Sides'),
  ('Dolci',      'Dessert')
) as v(nome, nome_en)
where c.nome = v.nome
  and c.categoria_macro_id = (
    select id from public.categorie_macro where nome = 'Da mangiare'
  );
