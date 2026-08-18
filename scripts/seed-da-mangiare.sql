-- =============================================================
-- Vizio Bistrot — seeding una tantum dei piatti reali di "Da mangiare"
--
-- Alternativa SQL allo script TypeScript (bloccato dalla policy di
-- rete della sandbox — host Supabase non in allowlist). Stesso dato,
-- stesso risultato. Idempotente: ogni insert è guardato da
-- "where not exists", rilanciarlo non produce duplicati.
--
-- Esegui i tre blocchi in ordine (piatti, poi allergeni, poi badge)
-- nell'SQL Editor di Supabase.
-- =============================================================

-- ---------------------------------------------------------------
-- 1. Piatti
-- ---------------------------------------------------------------
insert into public.piatti (categoria_id, nome, descrizione, prezzo, prezzo_variabile, disponibile, foto_url, ordine)
select c.id, v.nome, v.descrizione, v.prezzo, v.prezzo_variabile, true, null, v.ordine
from (values
  -- Aperitivo
  ('Aperitivo', 'AperiSpritz', 'Cocktail a scelta accompagnato da chips homemade e fritto a scelta', 13.00, false, 0),
  ('Aperitivo', 'AperiVizio', 'Cocktail, calice o bevanda a scelta, accompagnato da un tagliere con varie specialità selezionate dallo chef (salumi di alta qualità, formaggi ricercati, fritti croccanti)', 14.90, false, 1),
  ('Aperitivo', 'All You Can Drink (solo il Giovedì)', 'Cocktail, calice o bevanda a scelta, accompagnato da un tagliere con varie specialità selezionate dallo chef (salumi di alta qualità, formaggi ricercati, fritti croccanti)', 19.90, false, 2),
  ('Aperitivo', 'Vegetariano', 'Cocktail, calice o bevanda a scelta, accompagnato da un tagliere con varie specialità dallo chef (verdure, formaggi ricercati, fritti croccanti)', 19.90, false, 3),
  ('Aperitivo', 'Norcineria', 'Deliziosi salumi e formaggi di alta qualità e fritti selezionati dallo chef accompagnati da cocktail, calice o bevanda a scelta', 22.90, false, 4),

  -- Fritti
  ('Fritti', 'Supplì di zucchine', 'Due supplì da circa 50gr l''uno con zucchine, fiori di zucca e provola affumicata', 6.00, false, 0),
  ('Fritti', 'Supplì di pollo alla cacciatora', 'Due supplì da circa 50gr l''uno con pollo alla cacciatora', 6.00, false, 1),
  ('Fritti', 'Supplì Genovese', 'Due supplì da circa 50gr l''uno', 6.00, false, 2),
  ('Fritti', 'Chips alla romana', 'Chips insaporite cacio e pepe', 6.00, false, 3),
  ('Fritti', 'Patatine Steak House', 'Patatine taglio Steak House', 6.00, false, 4),
  ('Fritti', 'Stick di Pollo', 'Croccanti stick di pollo panati e fritti', 6.00, false, 5),
  ('Fritti', 'Polpette di Bollito', 'Morbide e croccanti polpette fritte di bollito', 8.00, false, 6),

  -- Pinse
  ('Pinse', 'Focaccia', null, 5.00, false, 0),
  ('Pinse', 'Pinsa con Prosciutto e Bufala', null, 14.00, false, 1),
  ('Pinse', 'Pinsa con Caponata Siciliana, bufala e basilico', null, 10.00, false, 2),

  -- Special
  ('Special', 'Pasta dello Chef', null, 15.00, false, 0),

  -- Vizi Caldi
  ('Vizi Caldi', 'Crostini con Chevre Chaud', 'Due crostini di pane con formaggio crudo di capra accompagnato da miele e mosto d''uva', 5.00, false, 0),
  ('Vizi Caldi', 'Soufflè con ricotta di pecora', 'Souffle con ricotta di pecora, crema di piselli e asparagi', 10.00, false, 1),
  ('Vizi Caldi', 'Spuma di Bufala', 'Spuma di bufala con crumble di pomodori secchi, datterino, pomodoro confit, olio e basilico', 10.00, false, 2),
  ('Vizi Caldi', 'Terrina di carne', 'Terrina di carne tiepida con pistacchi e senape antica', 13.00, false, 3),

  -- Burger
  ('Burger', 'Classic Burger', 'Manzo, original cheddar, senape, pomodoro, insalata', 12.90, false, 0),
  ('Burger', 'Chicken Burger', 'Burger con sovracoscio di pollo cotto cbt e fritto con mayo e cipolla caramellata', 15.00, false, 1),
  ('Burger', 'Il Vizioso', 'Panino con stracotto di guancia di manzo da 200g, cotta per 7 ore guarnito con insalata coleslaw', 18.00, false, 2),
  ('Burger', 'Pulled Pork', 'Panino con pulled pork e cavolo cappuccio rosso marinato', 17.00, false, 3),

  -- Taglieri
  ('Taglieri', 'Selezione Salumi', '5 salumi di alta qualità selezionati dallo chef', 17.00, false, 0),
  ('Taglieri', 'Tagliere di prosciutto al coltello', '100g di prosciutto selezionato tagliato al coltello', 17.00, false, 1),
  ('Taglieri', 'Selezione Formaggi', '5 formaggi di alta qualità selezionati dallo chef', 17.00, false, 2),
  ('Taglieri', 'Tagliere misto', 'Tagliere con due salumi, due formaggi, un fritto e una composta', 17.00, false, 3),
  ('Taglieri', 'Tagliere Patanegra', '70g di prosciutto patanegra a coltello', 19.00, false, 4),
  ('Taglieri', 'Gran Selezione', 'Deliziosi salumi e formaggi di alta qualità e fritti selezionati dallo chef', 25.00, false, 5),

  -- Crudi
  ('Crudi', 'Tartare di Chianina', 'Tartare di Chianina di osso con midollo, mayo alla rucola e scalogno croccante', 17.00, false, 0),
  ('Crudi', 'Tartare di Fassona', 'Tartare di fassona da 80 gr circa con sfera di tartufo, tuorlo marinato e germogli freschi', 13.00, false, 1),
  ('Crudi', 'Tartare di Black Angus', 'Tartare di Black Angus di circa 80 g con stracciatella e pomodori confit', 14.00, false, 2),
  ('Crudi', 'Tartare di bisonte', 'Delicata tartare di bisonte da 50 g circa condita con olio evo e fiocchi di sale', 18.00, false, 3),
  ('Crudi', 'Carpaccio di manzo', 'Tenero e saporito carpaccio di manzo da 100 con salsa tonnata e fior di capperi', 17.00, false, 4),
  ('Crudi', 'Carpaccio al tartufo', 'Tenero manzo e petali di tartufo, con misticanza', 18.00, false, 5),
  ('Crudi', 'Tartare Experience', 'Tre deliziose tartare di Chianina, Fassona e Black Angus (240 gr in totale), accompagnate da un cocktail a scelta Flower, Gin Sea, Negroni', 49.00, false, 6),

  -- Carne
  ('Carne', 'Tagliata di Chianina', 'Tagliata di chianina condita con olio evo e fiocchi di sale, con contorno', 19.90, false, 0),
  ('Carne', 'Tagliata di Black Angus', 'Deliziosa tagliata di Black Angus da 300g, dal gusto deciso, condita con olio e fiocchi di sale. Con contorno a scelta', 25.00, false, 1),
  ('Carne', 'Tagliata di Pollo', 'Deliziosa tagliata di Pollo da circa 300g, cotto in CBT. Con contorno a scelta', 18.00, false, 2),
  ('Carne', 'Picanha', '300g circa sottofesa di manzo condita con olio evo e fiocchi di sale accompagnato da contorno', 29.00, false, 3),
  ('Carne', 'Costata di manzo', 'Costata di manzo peso variabile', 8.00, true, 4),
  ('Carne', 'Fiorentina', 'Taglio fiorentina peso variabile', 10.00, true, 5),
  ('Carne', 'Filetto Classic', 'Filetto di Black Angus condito con olio evo e fiocchi di sale, accompagnato da contorno', 34.00, false, 6),
  ('Carne', 'Ribs di maiale aromatizzate BBQ e spezie', 'Ribs di maiale taglio ST LOUIS cotto cbt aromatizzate in salsa BBQ', 26.00, false, 7),
  ('Carne', 'Maialino con BBQ di carote', 'Tenero maialino in salsa bbq di carote, ananas caramellata e bietolina salata', 27.00, false, 8),
  ('Carne', 'Petto di anatra', 'Petto di anatra con prugna susina e agretti', 27.00, false, 9),
  ('Carne', 'Guancia di manzo', 'Guancia di manzo CBT condita con spuma di crema di sedano rapa, zafferano', 33.00, false, 10),
  ('Carne', 'Filetto alla Rossini', 'Tenero e gustoso filetto di Black Angus da 300g circa con foie gras e tartufo fresco adagiato su pan brioche fatto in casa', 40.00, false, 11),

  -- Contorni
  ('Contorni', 'Patata al forno', 'Patata al forno aromatizzata al rosmarino', 5.00, false, 0),
  ('Contorni', 'Verdure di stagione', 'Verdura di stagione ripassata o agro', 5.00, false, 1),
  ('Contorni', 'Verdura griglia', 'Verdure cotte in griglia', 5.00, false, 2),

  -- Dolci
  ('Dolci', 'Crostata', 'Chiedere al cameriere il gusto disponibile', 6.00, false, 0),
  ('Dolci', 'Cheesecake', 'Chiedere al cameriere il gusto disponibile', 6.00, false, 1),
  ('Dolci', 'Tiramisù', 'Classico', 6.00, false, 2),
  ('Dolci', 'Dolce dello chef', 'Creme Brulè, Fava Tonka, Gelato Fior di Latte', 6.00, false, 3),
  ('Dolci', 'Dolce Artigianale', null, 6.00, false, 4)
) as v(categoria_nome, nome, descrizione, prezzo, prezzo_variabile, ordine)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
where not exists (
  select 1 from public.piatti p where p.categoria_id = c.id and p.nome = v.nome
);

-- ---------------------------------------------------------------
-- 2. Allergeni (una riga per coppia piatto/allergene)
-- ---------------------------------------------------------------
insert into public.piatti_allergeni (piatto_id, allergene_id)
select p.id, v.allergene_id
from (values
  ('Fritti', 'Supplì di zucchine', 8), ('Fritti', 'Supplì di zucchine', 10), ('Fritti', 'Supplì di zucchine', 14),
  ('Fritti', 'Supplì di pollo alla cacciatora', 8), ('Fritti', 'Supplì di pollo alla cacciatora', 10), ('Fritti', 'Supplì di pollo alla cacciatora', 14),
  ('Fritti', 'Supplì Genovese', 8), ('Fritti', 'Supplì Genovese', 10), ('Fritti', 'Supplì Genovese', 14),
  ('Fritti', 'Chips alla romana', 8), ('Fritti', 'Chips alla romana', 14),
  ('Fritti', 'Patatine Steak House', 8),
  ('Fritti', 'Stick di Pollo', 3), ('Fritti', 'Stick di Pollo', 8), ('Fritti', 'Stick di Pollo', 10),
  ('Fritti', 'Polpette di Bollito', 3), ('Fritti', 'Polpette di Bollito', 8), ('Fritti', 'Polpette di Bollito', 10),

  ('Pinse', 'Pinsa con Prosciutto e Bufala', 8), ('Pinse', 'Pinsa con Prosciutto e Bufala', 14),
  ('Pinse', 'Pinsa con Caponata Siciliana, bufala e basilico', 8), ('Pinse', 'Pinsa con Caponata Siciliana, bufala e basilico', 14),

  ('Special', 'Pasta dello Chef', 8), ('Special', 'Pasta dello Chef', 10), ('Special', 'Pasta dello Chef', 14),

  ('Vizi Caldi', 'Crostini con Chevre Chaud', 8), ('Vizi Caldi', 'Crostini con Chevre Chaud', 14),
  ('Vizi Caldi', 'Soufflè con ricotta di pecora', 14),
  ('Vizi Caldi', 'Spuma di Bufala', 8), ('Vizi Caldi', 'Spuma di Bufala', 10),
  ('Vizi Caldi', 'Terrina di carne', 1),

  ('Burger', 'Classic Burger', 3), ('Burger', 'Classic Burger', 8), ('Burger', 'Classic Burger', 10), ('Burger', 'Classic Burger', 14),
  ('Burger', 'Chicken Burger', 3), ('Burger', 'Chicken Burger', 8), ('Burger', 'Chicken Burger', 10), ('Burger', 'Chicken Burger', 14),
  ('Burger', 'Il Vizioso', 2), ('Burger', 'Il Vizioso', 3), ('Burger', 'Il Vizioso', 8), ('Burger', 'Il Vizioso', 10), ('Burger', 'Il Vizioso', 14),
  ('Burger', 'Pulled Pork', 2), ('Burger', 'Pulled Pork', 3), ('Burger', 'Pulled Pork', 8), ('Burger', 'Pulled Pork', 10),

  ('Taglieri', 'Selezione Salumi', 3), ('Taglieri', 'Selezione Salumi', 5), ('Taglieri', 'Selezione Salumi', 8), ('Taglieri', 'Selezione Salumi', 14),
  ('Taglieri', 'Tagliere misto', 3), ('Taglieri', 'Tagliere misto', 5), ('Taglieri', 'Tagliere misto', 8), ('Taglieri', 'Tagliere misto', 10), ('Taglieri', 'Tagliere misto', 14),

  ('Dolci', 'Crostata', 1), ('Dolci', 'Crostata', 8), ('Dolci', 'Crostata', 10), ('Dolci', 'Crostata', 14),
  ('Dolci', 'Cheesecake', 1), ('Dolci', 'Cheesecake', 8), ('Dolci', 'Cheesecake', 10), ('Dolci', 'Cheesecake', 14),
  ('Dolci', 'Tiramisù', 1), ('Dolci', 'Tiramisù', 8), ('Dolci', 'Tiramisù', 10), ('Dolci', 'Tiramisù', 14),
  ('Dolci', 'Dolce dello chef', 1), ('Dolci', 'Dolce dello chef', 8), ('Dolci', 'Dolce dello chef', 10), ('Dolci', 'Dolce dello chef', 14),
  ('Dolci', 'Dolce Artigianale', 1), ('Dolci', 'Dolce Artigianale', 8), ('Dolci', 'Dolce Artigianale', 10), ('Dolci', 'Dolce Artigianale', 14)
) as v(categoria_nome, piatto_nome, allergene_id)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
join public.piatti p
  on p.categoria_id = c.id and p.nome = v.piatto_nome
where not exists (
  select 1 from public.piatti_allergeni pa where pa.piatto_id = p.id and pa.allergene_id = v.allergene_id
);

-- ---------------------------------------------------------------
-- 3. Badge
-- ---------------------------------------------------------------
insert into public.badge (piatto_id, testo)
select p.id, v.testo
from (values
  ('Carne', 'Filetto alla Rossini', 'Il nostro classico')
) as v(categoria_nome, piatto_nome, testo)
join public.categorie c
  on c.nome = v.categoria_nome
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
join public.piatti p
  on p.categoria_id = c.id and p.nome = v.piatto_nome
where not exists (
  select 1 from public.badge b where b.piatto_id = p.id and b.testo = v.testo
);

-- ---------------------------------------------------------------
-- 4. Riepilogo — quanti piatti per categoria dopo il seeding
-- ---------------------------------------------------------------
select c.nome as categoria, count(p.id) as piatti
from public.categorie c
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome = 'Da mangiare'
left join public.piatti p on p.categoria_id = c.id
group by c.nome, c.ordine
order by c.ordine;
