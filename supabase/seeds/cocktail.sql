-- =============================================================
-- Vizio Bistrot — seeding una tantum della categoria "Cocktail"
-- (macro-categoria "Bar & Cocktail")
--
-- La categoria esiste già (vedi 20260817010000_seed_categorie.sql),
-- quindi qui si inseriscono solo i cocktail. Stesso pattern
-- idempotente già usato per "Vini" e per il blocco Bar/Birre/
-- Cocktail Analcolici: ogni riga della VALUES è protetta
-- singolarmente da "where not exists".
--
-- Nessun allergene assegnato: il menu originale non riporta codici
-- allergene per questa categoria.
--
-- NOTA — tre voci trascritte fedeli all'originale nonostante
-- incongruenze nel testo di partenza (segnalate a corredo, non
-- corrette qui):
--   • "Ocean Gin Tonic": descrizione non coerente col nome.
--   • "Gin Sea": descrizione identica a "Rosa Spritz" (probabile
--     copia-incolla nell'originale).
--   • "Capiroska Fragola": ingrediente "fragola odk" non
--     identificabile (probabile refuso nell'originale).
--
-- Esegui l'intero blocco in un colpo unico nell'SQL Editor di
-- Supabase.
-- =============================================================

insert into public.piatti (categoria_id, nome, nome_en, descrizione, descrizione_en, prezzo, prezzo_variabile, disponibile, foto_url, ordine)
select c.id, v.nome, v.nome_en, v.descrizione, v.descrizione_en, v.prezzo, false, true, null, v.ordine
from (values
  ('Aperol Spritz', 'Aperol Spritz', 'Aperol, prosecco e soda', 'Aperol, prosecco and soda', 10.00, 0),
  ('Campari Spritz', 'Campari Spritz', 'Campari, prosecco e soda', 'Campari, prosecco and soda', 10.00, 1),
  ('Martini Spritz', 'Martini Spritz', 'Vermout Dry, prosecco, soda', 'Vermout Dry, prosecco, soda', 12.00, 2),
  ('Pimm''s Spritz', 'Pimm''s Spritz', 'Pimm''s, prosecco e soda', 'Pimm''s, prosecco and soda', 12.00, 3),
  ('Ginger Spritz', 'Ginger Spritz', 'Ginger, prosecco e soda', 'Ginger, prosecco and soda', 12.00, 4),
  ('P31 Spritz', 'P31 Spritz', 'P31, prosecco e soda', 'P31, prosecco and soda', 12.00, 5),
  ('Spritz Al Bergamotto', 'Bergamot Spritz', 'Liquore al bergamotto, prosecco e soda', 'Bergamot liqueur, prosecco and soda', 12.00, 6),
  ('Spritz Al Chinotto', 'Chinotto Spritz', 'Liquore al chinotto, prosecco e soda', 'Chinotto liqueur, prosecco and soda', 12.00, 7),
  ('Spritz alla Ciliegia', 'Cherry Spritz', 'Liquore alla ciliegia, prosecco e soda', 'Cherry liqueur, prosecco and soda', 12.00, 8),
  ('Rosa Spritz', 'Rose Spritz', 'Liquore alla rosa, prosecco, soda', 'Rose liqueur, prosecco, soda', 12.00, 9),
  ('Passion Spritz', 'Passion Spritz', 'Passoã, prosecco, soda', 'Passoã, prosecco, soda', 12.00, 10),
  ('Mediterraneo', 'Mediterraneo', 'Venturo, prosecco e soda', 'Venturo, prosecco, soda', 12.00, 11),
  ('Violetta', 'Violetta', 'Liquore alla violetta, prosecco e soda', 'Violet liqueur, prosecco and soda', 12.00, 12),
  ('Ocean', 'Ocean', 'Blu Curaçao, prosecco e soda', 'Blu Curaçao, prosecco, soda', 12.00, 13),
  ('Hugo', 'Hugo', 'Liquore ai fiori di sambuco, prosecco e soda', 'Elderflower liqueur, prosecco and soda', 12.00, 14),
  ('Tropical Spritz', 'Tropical Spritz', 'Arancia rossa, mango, passion fruit, prosecco, soda', 'Blood orange, mango, passion fruit, prosecco, soda', 12.00, 15),
  ('Classic espresso Martini', 'Classic espresso Martini', 'Vodka, espresso, Kaula, zucchero liquido', 'Vodka, espresso, Kahlúa, liquid sugar', 12.00, 16),
  ('Baileys espresso Martini', 'Baileys espresso Martini', 'Vodka, Baileys, espresso, Kaula', 'Vodka, Baileys, espresso, Kaula', 12.00, 17),
  ('Tequila espresso Martini', 'Tequila espresso Martini', 'Tequila, Kaula, espresso, zucchero liquido', 'Tequila, Kahlúa, espresso, liquid sugar', 12.00, 18),
  ('Whiskey espresso Martini', 'Whiskey espresso Martini', 'Whiskey, Kaula, espresso, zucchero liquido', 'Whiskey, Kahlúa, espresso, liquid sugar', 12.00, 19),
  ('Gin Tonic', 'Gin Tonic', 'Gin e tonica', 'Gin and tonic', 12.00, 20),
  ('Gin Lemon', 'Gin Lemon', 'Gin e tonica lemon', 'Gin and lemon tonic', 12.00, 21),
  ('Gin Fizz', 'Gin Fizz', 'Gin, Blu Curaçao e tonica', 'Gin, Blue Curaçao and tonic', 12.00, 22),
  ('Passion Fruit Aperol Sour', 'Passion Fruit Aperol Sour', 'Gin, Aperol, passion fruit, sciroppo di zucchero', 'Gin, Aperol, passion fruit, sugar syrup', 12.00, 23),
  ('Gin Basil Smash', 'Gin Basil Smash', 'Gin, succo di limone, sciroppo di zucchero, basilico', 'Gin, lemon juice, sugar syrup, basil', 12.00, 24),
  ('Gin Cherry', 'Gin Cherry', 'Gin, liquore alla ciliegia, succo di limone, Triple Sec', 'Gin, cherry liqueur, lemon juice, Triple Sec', 12.00, 25),
  ('Ocean Gin Tonic', 'Ocean Gin Tonic', 'Liquore alla ciliegia, prosecco e soda', 'Cherry liqueur, prosecco and soda', 12.00, 26),
  ('Gin Sea', 'Gin Sea', 'Liquore alla rosa, prosecco, soda', 'Rose liqueur, prosecco, soda', 13.00, 27),
  ('Negroni', 'Negroni', 'Gin, Vermouth rosso e Campari', 'Gin, Red Vermouth and Campari', 12.00, 28),
  ('Negroni Sbagliato', 'Negroni Sbagliato', 'Prosecco, Vermouth rosso e Campari', 'Prosecco, Red Vermouth and Campari', 12.00, 29),
  ('Negroni P31', 'Negroni P31', 'Gin, P31, Vermouth bianco dry', 'Gin, P31, Dry White Vermouth', 13.00, 30),
  ('Negroni Venturo', 'Negroni Venturo', 'Gin, Venturo, Vermouth bianco dry', 'Gin, Venturo, Dry White Vermouth', 13.00, 31),
  ('Boulevardier', 'Boulevardier', 'Whisky, Vermouth rosso e Campari', 'Whisky, Red Vermouth and Campari', 15.00, 32),
  ('Americano', 'Americano', 'Vermouth rosso, campari e soda', 'Red Vermouth, Campari and soda', 12.00, 33),
  ('Americano P31', 'Americano P31', 'Vermouth bianco dry, P31, soda', 'Dry White Vermouth, P31, soda', 12.00, 34),
  ('Americano Venturo', 'Americano Venturo', 'Vermouth bianco dry, Venturo, soda', 'Dry White Vermouth, Venturo, soda', 15.00, 35),
  ('Aperol Martini', 'Aperol Martini', 'Gin, Aperol, Vermouth dry, succo di limone e succo di arancia', 'Gin, Aperol, Dry Vermouth, lemon juice and orange juice', 13.00, 36),
  ('Daiquiri', 'Daiquiri', 'Rum bianco, succo di limone e sciroppo di zucchero', 'White rum, lemon juice and sugar syrup', 13.00, 37),
  ('Daiquiri Violetta', 'Daiquiri Violetta', 'Rum bianco, violetta, succo di limone e sciroppo di zucchero', 'White rum, violet, lemon juice and sugar syrup', 15.00, 38),
  ('Passion Daiquiri', 'Passion Daiquiri', 'Rum bianco, passion fruit, succo di limone e sciroppo di zucchero', 'White rum, passion fruit, lemon juice and sugar syrup', 15.00, 39),
  ('Mojito', 'Mojito', 'Rum chiaro e rum scuro, lime, zucchero di canna, menta e Angostura bitter', 'Light and dark rum, lime, cane sugar, mint and Angostura bitters', 13.00, 40),
  ('Mojito Passion', 'Mojito Passion', 'Rum chiaro e rum scuro, lime, zucchero di canna, menta e Angostura bitter, passata di passion fruit', 'Light and dark rum, lime, cane sugar, mint and Angostura bitters, passion fruit purée', 15.00, 41),
  ('Caipirinha', 'Caipirinha', 'Cachaça, lime e zucchero di canna', 'Cachaça, lime and cane sugar', 12.00, 42),
  ('Capiroska', 'Capiroska', 'Vodka, lime e zucchero di canna', 'Vodka, lime and cane sugar', 12.00, 43),
  ('Capiroska Fragola', 'Capiroska Fragola', 'Vodka, succo lime, fragola odk, sciroppo di zucchero di canna', 'Vodka, lime juice, strawberry odk, cane sugar syrup', 12.00, 44),
  ('Vodka Tonic', 'Vodka Tonic', 'Vodka e tonica', 'Vodka and tonic', 10.00, 45),
  ('Vodka Lemon', 'Vodka Lemon', 'Vodka e tonica lemon', 'Vodka and lemon tonic', 12.00, 46),
  ('Vodka Passion', 'Vodka Passion', 'Vodka, Passoã, tonica', 'Vodka, Passoã, tonic', 12.00, 47),
  ('Vodka Sour', 'Vodka Sour', 'Vodka, sciroppo, succo di limone', 'Vodka, syrup, lemon juice', 12.00, 48),
  ('Bloody Mary', 'Bloody Mary', 'Vodka, succo di pomodoro, succo di limone, pepe, sale e salsa Worcestershire', 'Vodka, tomato juice, lemon juice, pepper, salt and Worcestershire sauce', 15.00, 49),
  ('Moscow Mule', 'Moscow Mule', 'Vodka, Ginger beer e succo di lime', 'Vodka, ginger beer and lime juice', 15.00, 50),
  ('Vizio', 'Vizio', 'Vodka, Campari, passion fruit, Triple Sec, succo di lime e ginger ale', 'Vodka, Campari, passion fruit, Triple Sec, lime juice and ginger ale', 15.00, 51),
  ('Manhattan', 'Manhattan', 'Whisky, Vermouth rosso, angostura', 'Whisky, Red Vermouth, Angostura', 15.00, 52),
  ('Whisky sour', 'Whisky sour', 'Whisky, limone e sciroppo di zucchero, albume', 'Whisky, lemon and sugar syrup, egg white', 15.00, 53),
  ('Amaretto sour', 'Amaretto sour', 'Amaretto, limone e sciroppo di zucchero, albume', 'Amaretto, lemon and sugar syrup, egg white', 13.00, 54),
  ('Margarita', 'Margarita', 'Tequila, Triple Sec e succo di lime', 'Tequila, Triple Sec and lime juice', 15.00, 55),
  ('Paloma', 'Paloma', 'Tequila, tonica al pompelmo rosa e succo di lime', 'Tequila, pink grapefruit tonic and lime juice', 13.00, 56),
  ('Piña Colada', 'Piña Colada', 'Rum, succo di ananas, limone e sciroppo di cocco', 'Rum, pineapple juice, lemon and coconut syrup', 13.00, 57),
  ('Blu Velvet Margarita', 'Blu Velvet Margarita', 'Tequila, Blu curaçao, Triple Sec, limone', 'Tequila, Blue Curaçao, Triple Sec, lemon', 15.00, 58),
  ('Blue Mango', 'Blue Mango', 'Tequila, succo di limone, mango e Blue Curaçao', 'Tequila, lemon juice, mango and Blue Curaçao', 15.00, 59),
  ('Flower', 'Flower', 'Tequila, liquore alla rosa, Triple Sec, limone', 'Tequila, rose liqueur, Triple Sec, lemon', 12.00, 60),
  ('Long Island', 'Long Island', 'Tequila, gin, vodka, Triple Sec, succo di limone, sciroppo di zucchero', 'Tequila, gin, vodka, Triple Sec, lemon juice, sugar syrup', 15.00, 61),
  ('Long Island Iced Tea', 'Long Island Iced Tea', 'Tequila, gin, vodka, Triple Sec, succo di limone, sciroppo di zucchero, coca cola', 'Tequila, gin, vodka, Triple Sec, lemon juice, sugar syrup, coca cola', 15.00, 62)
) as v(nome, nome_en, descrizione, descrizione_en, prezzo, ordine)
join public.categorie c
  on c.nome = 'Cocktail'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Bar & Cocktail')
where not exists (
  select 1 from public.piatti p where p.categoria_id = c.id and p.nome = v.nome
);

-- ---------------------------------------------------------------
-- Verifica — quanti piatti inseriti nella categoria "Cocktail"
-- ---------------------------------------------------------------
select count(p.id) as piatti
from public.piatti p
join public.categorie c on c.id = p.categoria_id
where c.nome = 'Cocktail'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Bar & Cocktail');
