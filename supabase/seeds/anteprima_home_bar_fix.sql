-- =============================================================
-- Vizio Bistrot — correzione della sola selezione bar
--
-- Il primo lancio di anteprima_home.sql aveva prodotto 3 analcolici
-- su 4 drink: lo stesso difetto che doveva evitare (varianti dello
-- stesso tipo), spostato dagli spritz agli analcolici. Due errori:
--   - "nome ilike '%gin%'", pensato per un Gin Tonic, pescava
--     "VIRgin Paloma"
--   - lo slot signature cercava "%vizio%" senza escludere gli
--     analcolici, e prendeva "Cocktail Vizio"
--
-- Questo file rifà SOLO la parte bar: la selezione del menu, che era
-- corretta (Filetto alla Rossini in testa + mix di categorie), resta
-- intatta.
--
-- Rilanciarlo è sicuro.
-- =============================================================

begin;

-- Rimuove dalla selezione i soli piatti della macro bar
delete from public.piatti_anteprima_home a
using public.piatti p
join public.categorie c        on c.id = p.categoria_id
join public.categorie_macro cm on cm.id = c.categoria_macro_id
where a.piatto_id = p.id and cm.nome = 'Bar & Cocktail';

with bar as (
  select
    p.id, p.nome, p.ordine,
    -- Classificazione per categoria oltre che per nome, e confini di
    -- parola (\y) invece del match a sottostringa.
    (c.nome ilike '%analcolic%' or p.nome ilike '%analcolic%'
     or p.nome ~* '\yvirgin\y')                        as analcolico,
    (c.nome ilike '%birr%' or p.nome ilike '%birra%')  as birra
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
  -- Un classico riconoscibile, mai uno spritz. Ordinato per
  -- preferenza: se il classico ideale non c'è, ripiega invece di
  -- lasciare lo slot vuoto.
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

-- VERIFICA: devono uscire quattro stili diversi, non quattro drink
-- dello stesso tipo.
select a.ordine, c.nome as categoria, p.nome as piatto
from public.piatti_anteprima_home a
join public.piatti p           on p.id = a.piatto_id
join public.categorie c        on c.id = p.categoria_id
join public.categorie_macro cm on cm.id = c.categoria_macro_id
where cm.nome = 'Bar & Cocktail'
order by a.ordine;
