-- =============================================================
-- Vizio Bistrot — seeding una tantum delle categorie di distillati
-- (Tequila, Mezcal, Whisky, Vodka, Gin, Rum, Grappe, Amari & Liquori)
-- sotto la macro-categoria "Bar & Cocktail"
--
-- Le categorie esistono già (vedi 20260817010000_seed_categorie.sql),
-- quindi qui si inseriscono solo i prodotti. Stesso pattern
-- idempotente già usato nei blocchi precedenti: ogni riga della
-- VALUES è protetta singolarmente da "where not exists".
--
-- Nessun allergene, nessuna descrizione: sono nomi di prodotto/marca,
-- coerente col menu originale. nome_en = nome italiano per tutti
-- (marchi commerciali, nessuna traduzione necessaria).
--
-- Esegui l'intero blocco in un colpo unico nell'SQL Editor di
-- Supabase.
-- =============================================================

insert into public.piatti (categoria_id, nome, nome_en, prezzo, prezzo_variabile, disponibile, foto_url, ordine)
select c.id, v.nome, v.nome, v.prezzo, false, true, null, v.ordine
from (values
  -- Tequila
  ('Tequila', 'Olmeca Altos', 10.00, 0),
  ('Tequila', 'Espolòn Reposado', 10.00, 1),
  ('Tequila', 'Espolòn Blanco', 10.00, 2),
  ('Tequila', 'Patron Silver', 10.00, 3),
  ('Tequila', 'Casamigos Reposado', 10.00, 4),

  -- Mezcal
  ('Mezcal', 'Montelobos Espadin', 12.00, 0),
  ('Mezcal', 'Burrito Fiestero Black Edition', 12.00, 1),
  ('Mezcal', 'Burrito Fiestero Pink Edition', 12.00, 2),

  -- Whisky
  ('Whisky', 'Bulleit Bourbon', 8.00, 0),
  ('Whisky', 'Bulleit Bourbon Rye', 8.00, 1),
  ('Whisky', 'Tullamore DEW (Irish)', 8.00, 2),
  ('Whisky', 'Bulleit Bourbon 10 years old', 8.00, 3),
  ('Whisky', 'The Double Peat', 12.00, 4),
  ('Whisky', 'Nikka Days', 12.00, 5),
  ('Whisky', 'Talisker Skye', 12.00, 6),
  ('Whisky', 'Lagavulin 8 years aged', 18.00, 7),
  ('Whisky', 'Oban 14 Years', 15.00, 8),
  ('Whisky', 'Lagavulin 16 years aged', 18.00, 9),
  ('Whisky', 'Macallan 12 Years', 18.00, 10),
  ('Whisky', 'Caol Ila 12 Years', 18.00, 11),

  -- Vodka
  ('Vodka', 'Belvedere', 12.00, 0),
  ('Vodka', 'Grey Goose', 12.00, 1),
  ('Vodka', 'Beluga', 12.00, 2),
  ('Vodka', 'Svergognata Puglia', 12.00, 3),

  -- Gin
  ('Gin', 'Tanqueray', 10.00, 0),
  ('Gin', 'Tanqueray N° Ten', 10.00, 1),
  ('Gin', 'Tanqueray Sivilla', 10.00, 2),
  ('Gin', 'Muma', 10.00, 3),
  ('Gin', 'Mare', 10.00, 4),
  ('Gin', 'Bulldog', 10.00, 5),
  ('Gin', 'Gin Gil', 12.00, 6),
  ('Gin', 'Etsu Japanese Gin Original', 12.00, 7),
  ('Gin', 'Etsu Japanese Gin Pacific Ocean Water', 12.00, 8),
  ('Gin', 'Etsu Japanese Gin Double Yuzu', 12.00, 9),
  ('Gin', 'Gin Roku', 15.00, 10),
  ('Gin', 'Roku Sakura Bloom Edition', 15.00, 11),
  ('Gin', 'Portofino', 15.00, 12),
  ('Gin', 'Monkey 47', 15.00, 13),
  ('Gin', 'Etneum Sicilia', 15.00, 14),
  ('Gin', 'Elephant Gin', 15.00, 15),
  ('Gin', 'Gin del Professore – Madame', 15.00, 16),
  ('Gin', 'Gin del Professore – Monsieur', 15.00, 17),
  ('Gin', 'Sabatini Gin', 12.00, 18),
  ('Gin', 'Disonesto Gin', 12.00, 19),
  ('Gin', 'Toulis - Santa Ana', 12.00, 20),

  -- Rum
  ('Rum', 'Siete Villas 1511', 12.00, 0),
  ('Rum', 'Diplomàtico Reserva Exclusiva', 12.00, 1),
  ('Rum', 'Santa Teresa', 12.00, 2),
  ('Rum', 'Santa Teresa Triple Aged Solera', 12.00, 3),
  ('Rum', 'Larimar 5 years aged', 12.00, 4),
  ('Rum', 'Zacapa Solera', 15.00, 5),
  ('Rum', 'El Dorado Demerara 12 anni', 15.00, 6),
  ('Rum', 'Don Papa Baroko', 15.00, 7),
  ('Rum', 'Don Papa Masskara', 15.00, 8),
  ('Rum', 'Brugal 1888', 15.00, 9),

  -- Grappe
  ('Grappe', 'Diciotto Lune', 10.00, 0),
  ('Grappe', '903 barrique', 10.00, 1),
  ('Grappe', '903 tipica', 10.00, 2),
  ('Grappe', 'Grappa di Amarone', 10.00, 3),
  ('Grappe', 'Grappa Special', 10.00, 4),

  -- Amari & Liquori
  ('Amari & Liquori', 'Montenegro', 5.00, 0),
  ('Amari & Liquori', 'Amaretto di Saronno', 5.00, 1),
  ('Amari & Liquori', 'Limoncello', 5.00, 2),
  ('Amari & Liquori', 'Baileys', 5.00, 3),
  ('Amari & Liquori', 'Genziana', 5.00, 4),
  ('Amari & Liquori', 'Amaro del Capo', 5.00, 5),
  ('Amari & Liquori', 'Averna', 5.00, 6),
  ('Amari & Liquori', 'Fernet', 5.00, 7),
  ('Amari & Liquori', 'Formidabile', 5.00, 8),
  ('Amari & Liquori', 'Brancamenta', 5.00, 9),
  ('Amari & Liquori', 'Jagermeister', 5.00, 10),
  ('Amari & Liquori', 'Cynar', 5.00, 11),
  ('Amari & Liquori', 'Amaro Gambrinus', 5.00, 12),
  ('Amari & Liquori', 'Amaro dell''erborista', 6.00, 13),
  ('Amari & Liquori', 'Amaro Sibilla', 6.00, 14),
  ('Amari & Liquori', 'Roger', 7.00, 15),
  ('Amari & Liquori', 'Jefferson', 7.00, 16),
  ('Amari & Liquori', 'Anice Varnelli', 7.00, 17)
) as v(categoria_nome, nome, prezzo, ordine)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Bar & Cocktail')
where not exists (
  select 1 from public.piatti p where p.categoria_id = c.id and p.nome = v.nome
);

-- ---------------------------------------------------------------
-- Verifica — quanti piatti per ciascuna categoria di distillati,
-- più il totale complessivo.
-- ---------------------------------------------------------------
select c.nome as categoria, count(p.id) as piatti
from public.categorie c
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome = 'Bar & Cocktail'
left join public.piatti p on p.categoria_id = c.id
where c.nome in ('Tequila', 'Mezcal', 'Whisky', 'Vodka', 'Gin', 'Rum', 'Grappe', 'Amari & Liquori')
group by c.nome, c.ordine
order by c.ordine;

select count(p.id) as totale_distillati
from public.piatti p
join public.categorie c on c.id = p.categoria_id
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome = 'Bar & Cocktail'
where c.nome in ('Tequila', 'Mezcal', 'Whisky', 'Vodka', 'Gin', 'Rum', 'Grappe', 'Amari & Liquori');
