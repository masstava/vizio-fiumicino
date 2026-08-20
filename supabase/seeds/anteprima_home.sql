-- =============================================================
-- Vizio Bistrot — selezione iniziale per l'anteprima home
--
-- Da lanciare UNA VOLTA dopo la migration piatti_anteprima_home,
-- per popolare la selezione di partenza. Poi la selezione si
-- gestisce dalla dashboard (interruttore "Mostra nell'anteprima
-- home" su ogni piatto).
--
-- Obiettivo: l'anteprima non deve più mostrare sei varianti di
-- aperitivo. Serve un piatto di carne in prima posizione e un mix
-- che rappresenti le macro-categorie, e per i cocktail una varietà
-- di stile invece di quattro spritz quasi identici.
--
-- Come sceglie: per nome, con ricadute progressive. Non conosco i
-- nomi esatti presenti nel vostro database, quindi ogni blocco
-- prova prima il piatto desiderato e, se non lo trova, ripiega su
-- un criterio più largo. Rilanciarlo è sicuro (on conflict do
-- nothing + selezione idempotente).
--
-- VERIFICA A FINE FILE: l'ultima query mostra cosa è stato
-- selezionato. Controllatela: se un piatto atteso manca, aggiungetelo
-- a mano dalla dashboard — è esattamente il caso d'uso del flag.
-- =============================================================

begin;

-- Riparte da zero: la selezione dev'essere quella decisa qui, non
-- sommarsi a eventuali prove precedenti.
delete from public.piatti_anteprima_home;

-- -------------------------------------------------------------
-- 1) Il piatto icona di carne, in prima posizione (ordine 0)
--    Prova: "Filetto alla Rossini" → altro filetto → qualunque
--    piatto la cui categoria richiami carne/griglia/brace.
-- -------------------------------------------------------------
insert into public.piatti_anteprima_home (piatto_id, ordine)
select p.id, 0
from public.piatti p
join public.categorie c on c.id = p.categoria_id
where p.disponibile
order by
  (p.nome ilike '%rossini%')                                     desc,
  (p.nome ilike '%filetto%')                                     desc,
  (p.nome ilike '%tagliata%' or p.nome ilike '%costata%'
   or p.nome ilike '%fiorentina%' or p.nome ilike '%picanha%')    desc,
  (c.nome ilike '%carne%' or c.nome ilike '%grigli%'
   or c.nome ilike '%brace%' or c.nome ilike '%second%')          desc,
  p.ordine
limit 1
on conflict (piatto_id) do nothing;

-- -------------------------------------------------------------
-- 2) Un piatto per ciascuna delle altre categorie di "Da mangiare",
--    per mostrare l'ampiezza del menu invece di sei aperitivi.
--    Salta le categorie già rappresentate e il piatto icona.
--    distinct on (categoria) = un solo piatto per categoria.
-- -------------------------------------------------------------
with gia_scelti as (
  select piatto_id from public.piatti_anteprima_home
),
uno_per_categoria as (
  select distinct on (p.categoria_id) p.id, p.categoria_id, c.ordine as ord_cat, p.ordine
  from public.piatti p
  join public.categorie c        on c.id = p.categoria_id
  join public.categorie_macro cm on cm.id = c.categoria_macro_id
  where p.disponibile
    and cm.nome = 'Da mangiare'
    and p.id not in (select piatto_id from gia_scelti)
    -- Fuori le categorie di aperitivo/formule: sono già
    -- sovrarappresentate ed è il problema che stiamo correggendo.
    and c.nome not ilike '%aperitiv%'
    and c.nome not ilike '%all you can%'
  order by p.categoria_id, p.ordine
)
insert into public.piatti_anteprima_home (piatto_id, ordine)
select id, (row_number() over (order by ord_cat, ordine))::smallint
from uno_per_categoria
limit 5
on conflict (piatto_id) do nothing;

-- -------------------------------------------------------------
-- 3) Cocktail & Bar: varietà di stile, non quattro drink uguali.
--    Un signature alcolico, un classico, un analcolico, una birra.
--
--    ATTENZIONE al match sui nomi: "ilike '%gin%'" pesca anche
--    "VIRgin Paloma". Qui si usano i confini di parola di Postgres
--    (\y) e si classifica per categoria, non per sottostringa.
--
--    Ogni slot è ordinato per preferenza e non per uguaglianza
--    esatta: se il drink ideale non c'è, ripiega invece di lasciare
--    lo slot vuoto.
-- -------------------------------------------------------------
with bar as (
  select
    p.id, p.nome, p.ordine,
    (c.nome ilike '%analcolic%' or p.nome ilike '%analcolic%'
     or p.nome ~* '\yvirgin\y')            as analcolico,
    (c.nome ilike '%birr%' or p.nome ilike '%birra%') as birra
  from public.piatti p
  join public.categorie c        on c.id = p.categoria_id
  join public.categorie_macro cm on cm.id = c.categoria_macro_id
  where p.disponibile and cm.nome = 'Bar & Cocktail'
),
alcolici as (select * from bar where not analcolico and not birra),
scelte as (
  -- Signature della casa (alcolico)
  (select id, 10 as ord from alcolici
    where nome ilike '%vizio%' order by ordine limit 1)
  union all
  -- Un classico riconoscibile, mai uno spritz
  (select id, 11 from alcolici
    where nome not ilike '%vizio%'
    order by
      (nome ~* '\y(negroni|americano|old fashioned|manhattan|daiquiri|margarita|mojito|moscow mule|martini|gin)\y') desc,
      (nome !~* '\yspritz\y') desc,
      ordine
    limit 1)
  union all
  -- Un analcolico
  (select id, 12 from bar where analcolico order by ordine limit 1)
  union all
  -- Una birra
  (select id, 13 from bar where birra order by ordine limit 1)
)
insert into public.piatti_anteprima_home (piatto_id, ordine)
select distinct on (id) id, ord::smallint
from scelte
order by id, ord
on conflict (piatto_id) do nothing;

commit;

-- -------------------------------------------------------------
-- VERIFICA — cosa è stato selezionato, nell'ordine di comparsa
-- -------------------------------------------------------------
select
  a.ordine,
  cm.nome as macro,
  c.nome  as categoria,
  p.nome  as piatto
from public.piatti_anteprima_home a
join public.piatti p           on p.id = a.piatto_id
join public.categorie c        on c.id = p.categoria_id
join public.categorie_macro cm on cm.id = c.categoria_macro_id
order by a.ordine;
