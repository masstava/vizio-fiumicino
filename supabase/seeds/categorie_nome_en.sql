-- =============================================================
-- Vizio Bistrot — traduzioni dei titoli di categoria
--
-- 17 categorie (Vini, Bar & Cocktail, Experience) avevano nome_en
-- vuoto. Per i NOMI DEI PIATTI la ricaduta sull'italiano è una scelta
-- voluta e resta; per i TITOLI DI CATEGORIA no: sono etichette di
-- navigazione, e in versione inglese servono a orientarsi.
--
-- Due scelte volutamente NON tradotte, perché la forma italiana è
-- quella corretta anche in inglese:
--   Grappe          → Grappa   (prodotto italiano; in inglese si usa
--                               al singolare come nome del distillato)
--   Amari & Liquori → Amari & Liqueurs  ("amaro" è entrato nell'uso
--                               inglese: tradurlo lo impoverirebbe)
--
-- Idempotente: aggiorna solo dove nome_en è ancora vuoto, quindi non
-- sovrascrive mai una traduzione corretta a mano in seguito.
-- =============================================================

update public.categorie c
set nome_en = t.en
from (values
  ('Calici',              'By the Glass'),
  ('Bollicine',           'Sparkling'),
  ('Vini Bianchi',        'White Wines'),
  ('Vini Rossi',          'Red Wines'),
  ('Bar',                 'Bar'),
  ('Birre',               'Beers'),
  ('Cocktail Analcolici', 'Alcohol-Free Cocktails'),
  ('Cocktail',            'Cocktails'),
  ('Tequila',             'Tequila'),
  ('Mezcal',              'Mezcal'),
  ('Whisky',              'Whisky'),
  ('Vodka',               'Vodka'),
  ('Gin',                 'Gin'),
  ('Rum',                 'Rum'),
  ('Grappe',              'Grappa'),
  ('Amari & Liquori',     'Amari & Liqueurs'),
  ('Experience',          'Experiences')
) as t(it, en)
where c.nome = t.it
  and (c.nome_en is null or btrim(c.nome_en) = '');

-- VERIFICA 1: quali categorie restano senza traduzione
select nome, nome_en
from public.categorie
where nome_en is null or btrim(nome_en) = ''
order by nome;

-- VERIFICA 2: il risultato completo, per rilettura
select nome, nome_en from public.categorie order by nome;
