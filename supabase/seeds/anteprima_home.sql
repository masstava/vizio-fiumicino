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
-- 3) Cocktail & Bar: varietà di stile, non quattro spritz.
--    Un signature di casa, un classico, un analcolico, una birra.
--    Ogni blocco prende al massimo un elemento e salta i doppioni.
-- -------------------------------------------------------------
with bar as (
  select p.id, p.nome, c.nome as cat, p.ordine
  from public.piatti p
  join public.categorie c        on c.id = p.categoria_id
  join public.categorie_macro cm on cm.id = c.categoria_macro_id
  where p.disponibile and cm.nome = 'Bar & Cocktail'
),
scelte as (
  -- Signature della casa (nome che richiama il locale)
  (select id, 10 as ord from bar
    where nome ilike '%vizio%' order by ordine limit 1)
  union all
  -- Un classico riconoscibile, ma NON uno spritz
  (select id, 11 from bar
    where nome not ilike '%spritz%'
      and (nome ilike '%negroni%' or nome ilike '%americano%'
        or nome ilike '%old fashioned%' or nome ilike '%margarita%'
        or nome ilike '%moscow%' or nome ilike '%mojito%'
        or nome ilike '%martini%' or nome ilike '%gin%')
    order by ordine limit 1)
  union all
  -- Un analcolico
  (select id, 12 from bar
    where nome ilike '%analcolic%' or nome ilike '%vergine%'
       or nome ilike '%virgin%' or cat ilike '%analcolic%'
    order by ordine limit 1)
  union all
  -- Una birra artigianale
  (select id, 13 from bar
    where cat ilike '%birr%' or nome ilike '%birra%'
    order by ordine limit 1)
)
insert into public.piatti_anteprima_home (piatto_id, ordine)
select distinct on (id) id, ord::smallint from scelte
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
