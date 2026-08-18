-- =============================================================
-- Vizio Bistrot — seeding una tantum di "Bar", "Birre" e
-- "Cocktail Analcolici" (macro-categoria "Bar & Cocktail")
--
-- Le categorie esistono già (vedi 20260817010000_seed_categorie.sql),
-- quindi qui si inseriscono solo i piatti/bevande. Stesso pattern
-- idempotente già usato per "Vini": ogni riga della VALUES è protetta
-- singolarmente da "where not exists" (non solo l'istruzione nel suo
-- complesso) — rilanciare lo script non produce duplicati anche se
-- solo alcune righe fossero già presenti.
--
-- Nessun allergene assegnato: il menu originale non riporta codici
-- allergene per bevande/spirits in queste categorie.
--
-- Esegui l'intero blocco in un colpo unico nell'SQL Editor di
-- Supabase.
-- =============================================================

-- ---------------------------------------------------------------
-- Bar, Birre, Cocktail Analcolici
-- ---------------------------------------------------------------
insert into public.piatti (categoria_id, nome, nome_en, descrizione, descrizione_en, prezzo, prezzo_variabile, disponibile, foto_url, ordine)
select c.id, v.nome, v.nome_en, v.descrizione, v.descrizione_en, v.prezzo, false, true, null, v.ordine
from (values
  -- Bar
  ('Bar', 'Caffè', 'Coffee', null, null, 1.50, 0),
  ('Bar', 'Caffè decaffeinato', 'Decaffeinated coffee', null, null, 1.50, 1),
  ('Bar', 'Cappuccino', 'Cappuccino', null, null, 2.50, 2),
  ('Bar', 'Succo di frutta', 'Fruit Juice', null, null, 2.50, 3),

  -- Birre
  ('Birre', 'Birra artigianale alla spina (piccola 0,2l)', 'Craft Draft Beer (small 0.2l)', null, null, 4.00, 0),
  ('Birre', 'Birra artigianale alla spina (media 0,4l)', 'Craft Draft Beer (medium 0.4l)', null, null, 6.00, 1),
  ('Birre', 'Birra artigianale in bottiglia', 'Bottled Craft Beer', 'Rigele; Calourus Rossa', 'Rigele; Calourus Rossa', 5.00, 2),

  -- Cocktail Analcolici
  ('Cocktail Analcolici', 'Tropical Passion Fruit', 'Tropical Passion Fruit', 'passion fruit, mango, ananas, succo di limone, tonica', 'passion fruit, mango, pineapple, lemon juice, tonic', 10.00, 0),
  ('Cocktail Analcolici', 'Cocktail al mango', 'Mango Cocktail', null, null, 10.00, 1),
  ('Cocktail Analcolici', 'Cocktail al cocco e ananas', 'Coconut & Pineapple Cocktail', null, null, 10.00, 2),
  ('Cocktail Analcolici', 'Cocktail al passion fruit', 'Passion Fruit Cocktail', null, null, 10.00, 3),
  ('Cocktail Analcolici', 'Cranberry cocktail', 'Cranberry Cocktail', null, null, 10.00, 4),
  ('Cocktail Analcolici', 'Virgin Paloma', 'Virgin Paloma', null, null, 10.00, 5),
  ('Cocktail Analcolici', 'Virgin Negroni', 'Virgin Negroni', null, null, 10.00, 6),
  ('Cocktail Analcolici', 'Virgin Bloody Mary', 'Virgin Bloody Mary', null, null, 10.00, 7),
  ('Cocktail Analcolici', 'Virgin Strawberry Daiquiri', 'Virgin Strawberry Daiquiri', null, null, 10.00, 8),
  ('Cocktail Analcolici', 'Virgin Margarita', 'Virgin Margarita', null, null, 10.00, 9),
  ('Cocktail Analcolici', 'Virgin Moscow Mule', 'Virgin Moscow Mule', null, null, 10.00, 10),
  ('Cocktail Analcolici', 'Virgin Mojito', 'Virgin Mojito', null, null, 10.00, 11),
  ('Cocktail Analcolici', 'Cocktail Vizio', 'Vizio Cocktail', null, null, 10.00, 12),
  ('Cocktail Analcolici', 'Blackberry', 'Blackberry', null, null, 10.00, 13),
  ('Cocktail Analcolici', 'Virgin Piña Colada', 'Virgin Piña Colada', null, null, 10.00, 14),
  ('Cocktail Analcolici', 'Virgin Gin Tonic (Tanqueray 0.0)', 'Virgin Gin Tonic (Tanqueray 0.0)', null, null, 10.00, 15),
  ('Cocktail Analcolici', 'Virgin Gin Lemon (Tanqueray 0.0)', 'Virgin Gin Lemon (Tanqueray 0.0)', null, null, 10.00, 16)
) as v(categoria_nome, nome, nome_en, descrizione, descrizione_en, prezzo, ordine)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Bar & Cocktail')
where not exists (
  select 1 from public.piatti p where p.categoria_id = c.id and p.nome = v.nome
);

-- ---------------------------------------------------------------
-- Verifica — quanti piatti per categoria dopo il seeding
-- ---------------------------------------------------------------
select c.nome as categoria, count(p.id) as piatti
from public.categorie c
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome = 'Bar & Cocktail'
left join public.piatti p on p.categoria_id = c.id
where c.nome in ('Bar', 'Birre', 'Cocktail Analcolici')
group by c.nome, c.ordine
order by c.ordine;
