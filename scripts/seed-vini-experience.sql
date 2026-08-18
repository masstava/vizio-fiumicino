-- =============================================================
-- Vizio Bistrot — seeding una tantum di "Vini" (Calici, Bollicine,
-- Vini Bianchi, Vini Rossi) e "Experience"
--
-- Stesso approccio già usato per "Da mangiare": le categorie
-- coinvolte esistono già (vedi 20260817010000_seed_categorie.sql),
-- quindi qui si inseriscono solo i piatti/vini. Idempotente: ogni
-- insert è guardato da "where not exists", rilanciarlo non produce
-- duplicati.
--
-- Esegui l'intero blocco in un colpo unico nell'SQL Editor di
-- Supabase (le 5 istruzioni sono eseguite in sequenza).
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Vini (Calici, Bollicine, Vini Bianchi, Vini Rossi)
--    nome_en = nome (nomi propri, nessuna traduzione), descrizione
--    vuota (non fornita per nessun vino), prezzo_variabile = false.
-- ---------------------------------------------------------------
insert into public.piatti (categoria_id, nome, nome_en, descrizione, prezzo, prezzo_variabile, disponibile, foto_url, ordine)
select c.id, v.nome, v.nome, null, v.prezzo, false, true, null, v.ordine
from (values
  -- Calici (vini al bicchiere)
  ('Calici', 'Valdobbiadene Val D''Oca', 7.00, 0),
  ('Calici', 'Prosecco Rosè', 7.00, 1),
  ('Calici', 'Calice del giorno (bollicine)', 9.00, 2),
  ('Calici', 'Franciacorta', 9.00, 3),
  ('Calici', 'Ribolla Gialla Valpanera Veneto', 6.00, 4),
  ('Calici', 'Chardonnay Villa Gianna', 6.00, 5),
  ('Calici', 'Sauvignon Antonutti', 7.00, 6),
  ('Calici', 'Calice del giorno (bianco)', 8.00, 7),
  ('Calici', 'Montepulciano d''Abruzzo Sirio San Lorenzo', 6.00, 8),
  ('Calici', 'Primitivo Imprint Puglia', 6.00, 9),
  ('Calici', 'Merlot Antonutti', 7.00, 10),
  ('Calici', 'Calice del giorno (rosso)', 10.00, 11),
  ('Calici', 'Passito Moscato di Villa Gianna', 8.00, 12),
  ('Calici', 'Recioto Della Valpolicella', 8.00, 13),

  -- Bollicine (bottiglia)
  ('Bollicine', 'Valdobbiadene Val D''Oca', 25.00, 0),
  ('Bollicine', 'Prosecco Rosé Pitars', 25.00, 1),
  ('Bollicine', 'Franciacorta Brut Muratori', 40.00, 2),
  ('Bollicine', 'Franciacorta Rosé Muratori', 40.00, 3),
  ('Bollicine', 'Franciacorta Monterossa Brut', 50.00, 4),
  ('Bollicine', 'Franciacorta Monterossa Flamingo Rosè', 60.00, 5),
  ('Bollicine', 'Champagne Veuve Clicquot', 85.00, 6),

  -- Vini Bianchi (bottiglia)
  ('Vini Bianchi', 'Sauvignon Antonutti', 25.00, 0),
  ('Vini Bianchi', 'Ribolla Gialla Valpanera Veneto', 25.00, 1),
  ('Vini Bianchi', 'Chardonnay Villa Gianna Lazio', 25.00, 2),
  ('Vini Bianchi', 'Gewürztraminer St. Michael-Eppan Sudtirol', 29.00, 3),
  ('Vini Bianchi', 'Roero Arneis Dosio Piemonte', 32.00, 4),
  ('Vini Bianchi', 'Schulthaus Pinot Bianco St. Michael-Eppan Sudtirol', 34.00, 5),
  ('Vini Bianchi', 'Sauvignon Fallwind St. Michael-Eppan Sudtirol', 38.00, 6),
  ('Vini Bianchi', 'Cervaro Della Sala Antinori Castello Della Sala Bio', 90.00, 7),
  ('Vini Bianchi', 'Vintage Tunina Jermann Friuli Bio 2022', 90.00, 8),

  -- Vini Rossi (bottiglia)
  ('Vini Rossi', 'Merlot Antonutti Veneto', 25.00, 0),
  ('Vini Rossi', 'Primitivo Imprint Puglia Vegan', 25.00, 1),
  ('Vini Rossi', 'Montepulciano d''Abruzzo Sirio San Lorenzo', 25.00, 2),
  ('Vini Rossi', 'Cerasuolo di Vittoria Planeta Sicilia', 27.00, 3),
  ('Vini Rossi', 'Nebbiolo Delle Langhe Massolino Piemonte', 30.00, 4),
  ('Vini Rossi', 'Cesanese Del Piglio Hodeus Lazio 2021', 28.00, 5),
  ('Vini Rossi', 'Barbera D''alba Massolino Piemonte', 28.00, 6),
  ('Vini Rossi', 'Rosso di Montalcino Ciampoleto San Giorgio Bio', 32.00, 7),
  ('Vini Rossi', 'Rosso di Montepulciano Doc Poliziano 2022', 33.00, 8),
  ('Vini Rossi', 'Valpolicella Classico Superiore Zenato Veneto 2021', 32.00, 9),
  ('Vini Rossi', 'Refosco dal Peduncolo 2018', 32.00, 10),
  ('Vini Rossi', 'Lagrein St. Micheal-Eppan Sudtirol', 32.00, 11),
  ('Vini Rossi', 'Dolcetto d''Alba Vietti Piemonte Vegan 2023', 35.00, 12),
  ('Vini Rossi', 'Ripasso Valpolicella Superiore Zenato Veneto 2020', 36.00, 13),
  ('Vini Rossi', 'Etna Planeta Sicilia', 36.00, 14),
  ('Vini Rossi', 'Pinot Nero St. Michael-Eppan Sudtirol', 39.00, 15),
  ('Vini Rossi', 'Terre Siciliane "Secondo" Castello Solicchiata 2012', 42.00, 16),
  ('Vini Rossi', 'Brunello Di Montalcino Verbena Toscana 2019', 41.00, 17),
  ('Vini Rossi', 'Morellino di Scansano Lohsa Toscana', 42.00, 18),
  ('Vini Rossi', 'Barolo Massolino Piemonte 2020', 46.00, 19),
  ('Vini Rossi', 'Bolgheri Doc Rosso Colle Massari Grattamacco Toscana Bio', 49.00, 20),
  ('Vini Rossi', 'Pinot Nero Barone Spitaleri Sant''Elia Sicilia 2014', 49.00, 21),
  ('Vini Rossi', 'Montepulciano D''Abruzzo Masciarelli', 55.00, 22),
  ('Vini Rossi', 'Brunello di Montalcino Poggio Conte Toscana 2018', 56.00, 23),
  ('Vini Rossi', 'Nebbiolo Perbacco Langhe Vietti Vegan 2022', 57.00, 24),
  ('Vini Rossi', 'Lucente Astucciato Frescobaldi Toscana 2021', 66.00, 25),
  ('Vini Rossi', 'Amarone della Valpolicella Zenato Veneto 2019', 66.00, 26),
  ('Vini Rossi', 'Asseje Capichera Sardegna', 66.00, 27),
  ('Vini Rossi', 'Barolo Vietti Piemonte 2021 Vegan', 122.00, 28),
  ('Vini Rossi', 'Tignanello Toscana 2020', 195.00, 29)
) as v(categoria_nome, nome, prezzo, ordine)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Vini')
where not exists (
  select 1 from public.piatti p where p.categoria_id = c.id and p.nome = v.nome
);

-- ---------------------------------------------------------------
-- 2. Allergene 12 (Anidride solforosa e solfiti) su tutti i vini
--    appena inseriti (Calici, Bollicine, Vini Bianchi, Vini Rossi).
-- ---------------------------------------------------------------
insert into public.piatti_allergeni (piatto_id, allergene_id)
select p.id, 12
from public.piatti p
join public.categorie c on c.id = p.categoria_id
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome = 'Vini'
where c.nome in ('Calici', 'Bollicine', 'Vini Bianchi', 'Vini Rossi')
and not exists (
  select 1 from public.piatti_allergeni pa where pa.piatto_id = p.id and pa.allergene_id = 12
);

-- ---------------------------------------------------------------
-- 3. Experience — allergeni vuoti (menu degustazione variabile),
--    con traduzioni inglesi complete.
-- ---------------------------------------------------------------
insert into public.piatti (categoria_id, nome, nome_en, descrizione, descrizione_en, prezzo, prezzo_variabile, disponibile, foto_url, ordine)
select c.id, v.nome, v.nome_en, v.descrizione, v.descrizione_en, v.prezzo, false, true, null, v.ordine
from (values
  (
    'Experience',
    'Experience',
    'Experience',
    'Menù degustazione di 5 portate (i piatti variano in base alla stagionalità). Il Menu Experience viene servito esclusivamente per l''intero tavolo',
    '5-course tasting menu (dishes vary seasonally). Served for the entire table.',
    60.00,
    0
  ),
  (
    'Experience',
    'Accompagnamento vino',
    'Wine Pairing',
    'Bollicina, due vini da portata, un vino da meditazione',
    'Sparkling wine, two wines, one dessert wine.',
    30.00,
    1
  ),
  (
    'Experience',
    'Accompagnamento vino e cocktail',
    'Wine & Cocktail Pairing',
    'Bollicina, un vino da portata, un cocktail, un vino da meditazione',
    'Sparkling wine, one wine, one cocktail, one dessert wine.',
    35.00,
    2
  )
) as v(categoria_nome, nome, nome_en, descrizione, descrizione_en, prezzo, ordine)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Experience')
where not exists (
  select 1 from public.piatti p where p.categoria_id = c.id and p.nome = v.nome
);

-- ---------------------------------------------------------------
-- 4. Badge "Supplemento" sugli ultimi due piatti Experience.
-- ---------------------------------------------------------------
insert into public.badge (piatto_id, testo, testo_en)
select p.id, v.testo, v.testo_en
from (values
  ('Accompagnamento vino', 'Supplemento', 'Supplement'),
  ('Accompagnamento vino e cocktail', 'Supplemento', 'Supplement')
) as v(piatto_nome, testo, testo_en)
join public.categorie c
  on c.nome = 'Experience'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Experience')
join public.piatti p
  on p.categoria_id = c.id and p.nome = v.piatto_nome
where not exists (
  select 1 from public.badge b where b.piatto_id = p.id and b.testo = v.testo
);

-- ---------------------------------------------------------------
-- 5. Riepilogo — quanti elementi per categoria dopo il seeding
-- ---------------------------------------------------------------
select c.nome as categoria, count(p.id) as elementi
from public.categorie c
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome in ('Vini', 'Experience')
left join public.piatti p on p.categoria_id = c.id
group by c.nome, c.ordine
order by m.ordine, c.ordine;
