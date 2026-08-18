-- =============================================================
-- Vizio Bistrot — backfill nome_en / descrizione_en sui piatti
-- esistenti della macro-categoria "Da mangiare"
--
-- Da incollare nell'SQL Editor di Supabase (nessun accesso di rete
-- da questo ambiente). Ogni piatto è individuato per nome italiano,
-- con join su categorie (e categorie_macro) per evitare ambiguità
-- se lo stesso nome esistesse in un'altra categoria. Un UPDATE è
-- naturalmente sicuro da rilanciare più volte: nessuna clausola di
-- protezione contro i duplicati necessaria (a differenza degli
-- INSERT usati per il seeding iniziale).
-- =============================================================

-- ---------------------------------------------------------------
-- Aperitivo
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'AperiSpritz',
    descrizione_en = 'Choice of cocktail served with homemade chips and a choice of fried snack.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Aperitivo'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'AperiSpritz';

update public.piatti p
set nome_en = 'AperiVizio',
    descrizione_en = 'Choice of cocktail, glass of wine, or beverage, accompanied by a board with various specialties selected by the chef (high-quality cold cuts, refined cheeses, crispy fried snacks).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Aperitivo'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'AperiVizio';

update public.piatti p
set nome_en = 'All You Can Drink (Thursdays only)',
    descrizione_en = 'Choice of cocktail, glass of wine, or beverage, accompanied by a board with various specialties selected by the chef (high-quality cold cuts, refined cheeses, crispy fried snacks).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Aperitivo'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'All You Can Drink (solo il Giovedì)';

update public.piatti p
set nome_en = 'Vegetarian',
    descrizione_en = 'Choice of cocktail, glass of wine, or beverage, accompanied by a board with various specialties from the chef (vegetables, refined cheeses, crispy fried snacks).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Aperitivo'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Vegetariano';

update public.piatti p
set nome_en = 'Norcineria',
    descrizione_en = 'Delicious high-quality cold cuts and cheeses and fried snacks selected by the chef, accompanied by a cocktail, glass of wine, or beverage of choice.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Aperitivo'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Norcineria';

-- ---------------------------------------------------------------
-- Fritti
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Zucchini Suppli',
    descrizione_en = 'Two suppli (approx. 50g each) with zucchini, zucchini flowers, and smoked provola.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Supplì di zucchine';

update public.piatti p
set nome_en = 'Chicken "Cacciatora" Suppli',
    descrizione_en = 'Two suppli (approx. 50g each) with hunter-style chicken.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Supplì di pollo alla cacciatora';

update public.piatti p
set nome_en = 'Genovese Suppli',
    descrizione_en = 'Two suppli (approx. 50g each).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Supplì Genovese';

update public.piatti p
set nome_en = 'Roman Style Chips',
    descrizione_en = 'Chips seasoned with cacio e pepe (cheese and pepper).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Chips alla romana';

update public.piatti p
set nome_en = 'Steak House Fries',
    descrizione_en = 'Steak house cut fries.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Patatine Steak House';

update public.piatti p
set nome_en = 'Chicken Sticks',
    descrizione_en = 'Crispy breaded and fried chicken sticks.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Stick di Pollo';

update public.piatti p
set nome_en = 'Boiled Meat Meatballs',
    descrizione_en = 'Soft and crispy fried boiled meat balls.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Fritti'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Polpette di Bollito';

-- ---------------------------------------------------------------
-- Pinse
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Focaccia',
    descrizione_en = null
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Pinse'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Focaccia';

update public.piatti p
set nome_en = 'Pinsa with Prosciutto e Bufala',
    descrizione_en = null
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Pinse'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Pinsa con Prosciutto e Bufala';

update public.piatti p
set nome_en = 'Pinsa with Sicilian Caponata, bufala e basilico',
    descrizione_en = null
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Pinse'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Pinsa con Caponata Siciliana, bufala e basilico';

-- ---------------------------------------------------------------
-- Special
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Chef''s Pasta',
    descrizione_en = null
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Special'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Pasta dello Chef';

-- ---------------------------------------------------------------
-- Vizi Caldi
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Crostini with Chèvre Chaud',
    descrizione_en = 'Two bread croutons with raw goat cheese, served with honey and grape must.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Vizi Caldi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Crostini con Chevre Chaud';

update public.piatti p
set nome_en = 'Sheep Ricotta Soufflé',
    descrizione_en = 'Soufflé with sheep ricotta, pea cream, and asparagus.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Vizi Caldi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Soufflè con ricotta di pecora';

update public.piatti p
set nome_en = 'Bufala Mousse',
    descrizione_en = 'Buffalo mozzarella mousse with sun-dried tomato crumble, cherry tomato, tomato confit, oil, and basil.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Vizi Caldi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Spuma di Bufala';

update public.piatti p
set nome_en = 'Meat Terrine',
    descrizione_en = 'Warm meat terrine with pistachios and ancient mustard.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Vizi Caldi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Terrina di carne';

-- ---------------------------------------------------------------
-- Burger
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Classic Burger',
    descrizione_en = 'Beef, original cheddar, mustard, tomato, lettuce.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Burger'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Classic Burger';

update public.piatti p
set nome_en = 'Chicken Burger',
    descrizione_en = 'Burger with CBT (low temperature) cooked and fried chicken thigh, with mayo and caramelized onion.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Burger'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Chicken Burger';

update public.piatti p
set nome_en = 'Il Vizioso',
    descrizione_en = 'Sandwich with 200g beef cheek stew (cooked for 7 hours), garnished with coleslaw.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Burger'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Il Vizioso';

update public.piatti p
set nome_en = 'Pulled Pork',
    descrizione_en = 'Sandwich with pulled pork and marinated red cabbage.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Burger'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Pulled Pork';

-- ---------------------------------------------------------------
-- Taglieri — nomi identici in italiano anche in inglese (come nel
-- menu originale del locale): nome_en = nome italiano invariato,
-- solo descrizione_en aggiornata.
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Selezione Salumi',
    descrizione_en = '5 high-quality cold cuts selected by the chef.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Taglieri'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Selezione Salumi';

update public.piatti p
set nome_en = 'Tagliere di prosciutto al coltello',
    descrizione_en = '100g of selected hand-cut ham.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Taglieri'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tagliere di prosciutto al coltello';

update public.piatti p
set nome_en = 'Selezione Formaggi',
    descrizione_en = '5 high-quality cheeses selected by the chef.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Taglieri'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Selezione Formaggi';

update public.piatti p
set nome_en = 'Tagliere misto',
    descrizione_en = 'Two cold cuts, two cheeses, one fried snack, and a preserve.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Taglieri'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tagliere misto';

update public.piatti p
set nome_en = 'Tagliere Patanegra',
    descrizione_en = '70g of hand-cut Patanegra ham.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Taglieri'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tagliere Patanegra';

update public.piatti p
set nome_en = 'Gran Selezione',
    descrizione_en = 'Delicious cold cuts, cheeses, and fried snacks selected by the chef.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Taglieri'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Gran Selezione';

-- ---------------------------------------------------------------
-- Crudi
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Chianina Tartare',
    descrizione_en = 'Chianina beef tartare with marrow bone, rocket mayo, and crispy shallot.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tartare di Chianina';

update public.piatti p
set nome_en = 'Fassona Tartare',
    descrizione_en = 'Approx. 80g Fassona tartare with truffle sphere, marinated egg yolk, and fresh sprouts.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tartare di Fassona';

update public.piatti p
set nome_en = 'Black Angus Tartare',
    descrizione_en = 'Approx. 80g Black Angus tartare with stracciatella and tomato confit.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tartare di Black Angus';

update public.piatti p
set nome_en = 'Bison Tartare',
    descrizione_en = 'Delicate bison tartare (approx. 50g) with extra virgin olive oil and salt flakes.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tartare di bisonte';

update public.piatti p
set nome_en = 'Beef Carpaccio',
    descrizione_en = 'Tender 100g beef carpaccio with tuna sauce and caper berries.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Carpaccio di manzo';

update public.piatti p
set nome_en = 'Truffle Carpaccio',
    descrizione_en = 'Tender beef with truffle shavings and mixed greens.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Carpaccio al tartufo';

update public.piatti p
set nome_en = 'Tartare Experience',
    descrizione_en = 'Three delicious tartares (Chianina, Fassona, Black Angus - 240g total) with a cocktail of choice (Flower, Gin Sea, Negroni).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Crudi'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tartare Experience';

-- ---------------------------------------------------------------
-- Carne
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Sliced Chianina',
    descrizione_en = 'Sliced Chianina beef with extra virgin olive oil and salt flakes, with a side dish.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tagliata di Chianina';

update public.piatti p
set nome_en = 'Sliced Black Angus',
    descrizione_en = '300g sliced Black Angus with bold flavor, oil, and salt flakes. Side dish of choice included.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tagliata di Black Angus';

-- NOTA: voce assente nel PDF inglese originale del locale, traduzione
-- aggiunta ora per completezza — segnalare per revisione futura.
update public.piatti p
set nome_en = 'Chicken Tagliata',
    descrizione_en = 'Tender chicken tagliata, approx. 300g, cooked sous-vide (CBT). Served with a side dish of choice.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tagliata di Pollo';

update public.piatti p
set nome_en = 'Picanha',
    descrizione_en = 'Approx. 300g beef rump cap with extra virgin olive oil and salt flakes, with a side dish.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Picanha';

update public.piatti p
set nome_en = 'Costata di manzo',
    descrizione_en = 'Variable weight (price per 100g).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Costata di manzo';

update public.piatti p
set nome_en = 'Fiorentina',
    descrizione_en = 'Variable weight (price per 100g).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Fiorentina';

update public.piatti p
set nome_en = 'Classic Fillet',
    descrizione_en = 'Black Angus fillet with extra virgin olive oil and salt flakes, with a side dish.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Filetto Classic';

update public.piatti p
set nome_en = 'BBQ Pork Ribs',
    descrizione_en = 'ST LOUIS cut pork ribs, cooked CBT (low temperature) with BBQ sauce and spices.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Ribs di maiale aromatizzate BBQ e spezie';

update public.piatti p
set nome_en = 'Suckling Pig with Carrot BBQ',
    descrizione_en = 'Tender suckling pig in carrot BBQ sauce, caramelized pineapple, and salted Swiss chard.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Maialino con BBQ di carote';

update public.piatti p
set nome_en = 'Duck Breast',
    descrizione_en = 'Duck breast with plum and "agretti" (monk''s beard).'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Petto di anatra';

update public.piatti p
set nome_en = 'Beef Cheek',
    descrizione_en = 'CBT beef cheek with celeriac mousse and saffron.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Guancia di manzo';

update public.piatti p
set nome_en = 'Fillet Rossini',
    descrizione_en = 'Approx. 300g Black Angus fillet with foie gras and fresh truffle on homemade brioche.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Carne'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Filetto alla Rossini';

-- ---------------------------------------------------------------
-- Contorni
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Baked Potatoes',
    descrizione_en = 'Rosemary-flavored baked potato.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Contorni'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Patata al forno';

update public.piatti p
set nome_en = 'Seasonal Vegetables',
    descrizione_en = 'Seasonal vegetables sautéed or sour.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Contorni'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Verdure di stagione';

update public.piatti p
set nome_en = 'Grilled Vegetables',
    descrizione_en = 'Grilled vegetables.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Contorni'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Verdura griglia';

-- ---------------------------------------------------------------
-- Dolci
-- ---------------------------------------------------------------
update public.piatti p
set nome_en = 'Fruit Tart',
    descrizione_en = 'Ask for available flavors.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Dolci'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Crostata';

update public.piatti p
set nome_en = 'Cheesecake',
    descrizione_en = 'Ask for available flavors.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Dolci'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Cheesecake';

update public.piatti p
set nome_en = 'Tiramisù',
    descrizione_en = 'Classic recipe.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Dolci'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Tiramisù';

update public.piatti p
set nome_en = 'Chef''s Dessert',
    descrizione_en = 'Crème Brûlée, Tonka Bean, Fior di Latte Gelato.'
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Dolci'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Dolce dello chef';

update public.piatti p
set nome_en = 'Artisanal Dessert',
    descrizione_en = null
from public.categorie c
where p.categoria_id = c.id
  and c.nome = 'Dolci'
  and c.categoria_macro_id = (select id from public.categorie_macro where nome = 'Da mangiare')
  and p.nome = 'Dolce Artigianale';

-- ---------------------------------------------------------------
-- Verifica — piatti di "Da mangiare" ancora senza nome_en (0 = ok)
-- ---------------------------------------------------------------
select count(*) as piatti_senza_traduzione
from public.piatti p
join public.categorie c on c.id = p.categoria_id
join public.categorie_macro m on m.id = c.categoria_macro_id and m.nome = 'Da mangiare'
where p.nome_en is null;
