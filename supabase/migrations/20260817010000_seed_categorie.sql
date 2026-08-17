-- =============================================================
-- Vizio Bistrot — seed categorie_macro e categorie
-- Idempotente: ogni insert è guardato da "where not exists",
-- rilanciare questa migration non produce errori né duplicati.
-- =============================================================

-- ---------------------------------------------------------------
-- categorie_macro
-- ---------------------------------------------------------------
insert into public.categorie_macro (nome, ordine)
select v.nome, v.ordine
from (values
  ('Da mangiare',    0),
  ('Vini',           1),
  ('Bar & Cocktail', 2),
  ('Experience',     3)
) as v(nome, ordine)
where not exists (
  select 1 from public.categorie_macro cm where cm.nome = v.nome
);

-- ---------------------------------------------------------------
-- categorie — collegate alla rispettiva categoria_macro per nome
-- ---------------------------------------------------------------
insert into public.categorie (categoria_macro_id, nome, ordine)
select cm.id, v.nome, v.ordine
from (values
  -- Da mangiare
  ('Da mangiare', 'Aperitivo',  0),
  ('Da mangiare', 'Fritti',     1),
  ('Da mangiare', 'Pinse',      2),
  ('Da mangiare', 'Special',    3),
  ('Da mangiare', 'Vizi Caldi', 4),
  ('Da mangiare', 'Burger',     5),
  ('Da mangiare', 'Taglieri',   6),
  ('Da mangiare', 'Crudi',      7),
  ('Da mangiare', 'Carne',      8),
  ('Da mangiare', 'Contorni',   9),
  ('Da mangiare', 'Dolci',      10),
  -- Vini
  ('Vini', 'Calici',       0),
  ('Vini', 'Bollicine',    1),
  ('Vini', 'Vini Bianchi', 2),
  ('Vini', 'Vini Rossi',   3),
  -- Bar & Cocktail
  ('Bar & Cocktail', 'Bar',                  0),
  ('Bar & Cocktail', 'Birre',                1),
  ('Bar & Cocktail', 'Cocktail Analcolici',  2),
  ('Bar & Cocktail', 'Cocktail',             3),
  ('Bar & Cocktail', 'Tequila',              4),
  ('Bar & Cocktail', 'Mezcal',               5),
  ('Bar & Cocktail', 'Whisky',               6),
  ('Bar & Cocktail', 'Vodka',                7),
  ('Bar & Cocktail', 'Gin',                  8),
  ('Bar & Cocktail', 'Rum',                  9),
  ('Bar & Cocktail', 'Grappe',               10),
  ('Bar & Cocktail', 'Amari & Liquori',      11),
  -- Experience
  ('Experience', 'Experience', 0)
) as v(macro_nome, nome, ordine)
join public.categorie_macro cm on cm.nome = v.macro_nome
where not exists (
  select 1 from public.categorie c
  where c.categoria_macro_id = cm.id and c.nome = v.nome
);
