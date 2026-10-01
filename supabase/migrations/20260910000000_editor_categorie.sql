-- =============================================================
-- Vizio Bistrot — editor categorie in dashboard: schema
-- =============================================================
-- Tre cose, tutte prerequisito dell'editor (nessuna interfaccia qui):
--
-- 1) RUOLO ESPLICITO sulle macro-categorie. Fino a oggi la home
--    (anteprima menu/cocktail e sua ricaduta), la vetrina di
--    /cocktail-bar, la sezione suggerita per ora nel menu al tavolo e
--    il tono dell'anteprima nell'editor piatti riconoscevano le macro
--    per NOME scritto nel codice ("Da mangiare", "Bar & Cocktail").
--    Con un editor, rinominarle romperebbe tutto questo in silenzio.
--    Il ruolo segue la RIGA (id), non il nome: rinomina e riordino non
--    lo toccano.
--
-- 2) ELIMINAZIONE BLOCCATA A LIVELLO DI DATABASE. Le chiavi esterne
--    erano "on delete cascade": eliminare una macro avrebbe cancellato
--    in silenzio tutte le sue sotto-categorie E tutti i loro piatti
--    (con badge, allergeni, selezioni home). L'editor blocca già
--    l'eliminazione di ciò che è in uso, ma la garanzia vera deve
--    stare qui: "restrict" fa rifiutare al database stesso qualunque
--    delete di una categoria ancora usata, anche da una chiamata che
--    salta l'interfaccia.
--
-- 3) RIORDINO E SPOSTAMENTO ATOMICI, stesso schema di reorder_piatti
--    (security invoker + controllo auth, RLS invariata). Entrambe le
--    tabelle hanno GIÀ una colonna "ordine": nessuna colonna nuova.
--
-- Migration idempotente: colonna/vincoli/indice "if not exists" o con
-- drop preventivo, backfill guardato da "ruolo is null", funzioni
-- "create or replace".
-- =============================================================


-- ---------------------------------------------------------------
-- 1) categorie_macro.ruolo
-- ---------------------------------------------------------------
-- null = nessun ruolo speciale (Vini, Experience, qualunque macro
-- nuova): nel menu compare come tutte le altre, in home finisce
-- nell'anteprima "menu" come oggi. Al massimo UNA macro per ruolo:
-- la home ha una sola sezione cucina e una sola sezione bar.
alter table public.categorie_macro add column if not exists ruolo text;

alter table public.categorie_macro drop constraint if exists categorie_macro_ruolo_valido;
alter table public.categorie_macro
  add constraint categorie_macro_ruolo_valido
  check (ruolo is null or ruolo in ('cucina', 'bar'));

create unique index if not exists categorie_macro_ruolo_unico
  on public.categorie_macro (ruolo)
  where ruolo is not null;

-- Backfill una tantum dai nomi seminati (20260817010000): è l'ULTIMA
-- volta che questi nomi compaiono in un confronto. Guardato da
-- "nessuna riga ha già quel ruolo", così rilanciarlo — anche dopo
-- una rinomina — non sposta mai il ruolo su un'altra riga.
update public.categorie_macro
   set ruolo = 'cucina'
 where id = (select id from public.categorie_macro where nome = 'Da mangiare' order by ordine limit 1)
   and not exists (select 1 from public.categorie_macro where ruolo = 'cucina');

update public.categorie_macro
   set ruolo = 'bar'
 where id = (select id from public.categorie_macro where nome = 'Bar & Cocktail' order by ordine limit 1)
   and not exists (select 1 from public.categorie_macro where ruolo = 'bar');


-- ---------------------------------------------------------------
-- 2) Chiavi esterne: cascade -> restrict
-- ---------------------------------------------------------------
-- Si eliminano TUTTE le FK esistenti su quella colonna, qualunque nome
-- abbiano, prima di ricreare quella nuova con un nome fisso: un
-- semplice "drop constraint if exists <nome atteso>" non basterebbe se
-- sul database reale il nome fosse diverso, e lascerebbe la vecchia FK
-- "cascade" affiancata a quella nuova.
do $$
declare
  v record;
begin
  for v in
    select c.conrelid::regclass as tabella, c.conname
      from pg_constraint c
      join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any (c.conkey)
     where c.contype = 'f'
       and (
         (c.conrelid = 'public.categorie'::regclass and a.attname = 'categoria_macro_id')
         or (c.conrelid = 'public.piatti'::regclass and a.attname = 'categoria_id')
       )
  loop
    execute format('alter table %s drop constraint %I', v.tabella, v.conname);
  end loop;
end $$;

alter table public.categorie
  add constraint categorie_categoria_macro_id_fkey
  foreign key (categoria_macro_id) references public.categorie_macro (id)
  on delete restrict;

alter table public.piatti
  add constraint piatti_categoria_id_fkey
  foreign key (categoria_id) references public.categorie (id)
  on delete restrict;

-- piatti.categoria_id non aveva un indice dedicato fino a
-- 20260906000000 (audit): c'è già, nessun indice nuovo qui.


-- ---------------------------------------------------------------
-- 3) Riordino e spostamento
-- ---------------------------------------------------------------
create or replace function public.riordina_categorie_macro(p_ordini jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  update public.categorie_macro as m
     set ordine = (o ->> 'ordine')::smallint
    from jsonb_array_elements(p_ordini) as o
   where m.id = (o ->> 'id')::uuid;
end;
$$;

-- Riordino DENTRO una macro: il filtro su categoria_macro_id impedisce
-- che un payload sbagliato tocchi categorie di un'altra macro.
create or replace function public.riordina_categorie(p_categoria_macro_id uuid, p_ordini jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  update public.categorie as c
     set ordine = (o ->> 'ordine')::smallint
    from jsonb_array_elements(p_ordini) as o
   where c.id = (o ->> 'id')::uuid
     and c.categoria_macro_id = p_categoria_macro_id;
end;
$$;

-- Sposta una sotto-categoria in un'altra macro, in coda: un solo
-- statement, quindi macro e posizione cambiano insieme o per niente.
-- I piatti seguono la categoria (la FK è sulla categoria, non sulla
-- macro): nessun piatto da aggiornare.
create or replace function public.sposta_categoria(p_categoria_id uuid, p_categoria_macro_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  update public.categorie
     set categoria_macro_id = p_categoria_macro_id,
         ordine = coalesce((
           select max(c2.ordine) + 1
             from public.categorie c2
            where c2.categoria_macro_id = p_categoria_macro_id
              and c2.id <> p_categoria_id
         ), 0)
   where id = p_categoria_id
     and categoria_macro_id <> p_categoria_macro_id;
end;
$$;

-- Stesso trattamento di reorder_piatti dopo l'hardening
-- (20260904000000): mai eseguibili da anon.
revoke all on function public.riordina_categorie_macro(jsonb) from public, anon, authenticated;
revoke all on function public.riordina_categorie(uuid, jsonb) from public, anon, authenticated;
revoke all on function public.sposta_categoria(uuid, uuid) from public, anon, authenticated;
grant execute on function public.riordina_categorie_macro(jsonb) to authenticated;
grant execute on function public.riordina_categorie(uuid, jsonb) to authenticated;
grant execute on function public.sposta_categoria(uuid, uuid) to authenticated;
