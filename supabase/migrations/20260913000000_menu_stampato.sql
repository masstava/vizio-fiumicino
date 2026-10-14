-- =============================================================
-- Vizio Bistrot — menu stampato di ogni macro-categoria
-- =============================================================
-- Il PDF del menu si divide in due documenti da stampare: "Menu"
-- (cucina) e "Beverage". In quale dei due finisce una macro-categoria
-- lo decide lo staff dall'editor categorie della dashboard, riga per
-- riga — non il nome della macro, né il ruolo cucina/bar (che è al
-- massimo uno per tipo, mentre al beverage servono sia il bar sia i
-- vini).
--
-- Vale SOLO per i PDF. Sito, menu al tavolo e home non leggono questa
-- colonna.
--
--   'menu'     → nel PDF "Menu"
--   'beverage' → nel PDF "Beverage"
--   null       → in nessuno dei due (per esempio Experience)
--
-- Valori iniziali: tutte le macro esistenti in 'menu' (il PDF di oggi
-- le contiene tutte), tranne quella con ruolo 'bar' in 'beverage'. Le
-- altre (Vini, Experience…) si sistemano dalla dashboard: nessuna
-- assegnazione in base al nome. Le macro create in seguito partono da
-- 'menu' (default).
--
-- Idempotente: colonna e valori iniziali solo se la colonna non
-- esiste ancora, così un secondo giro non sovrascrive le scelte fatte
-- dalla dashboard (compresi i null voluti); vincolo con drop/add.
-- Nessun grant da cambiare: le policy esistenti su categorie_macro
-- (lettura pubblica, modifica per gli utenti autenticati) coprono già
-- la nuova colonna.
-- =============================================================

do $$
begin
  if not exists (
    select 1
      from information_schema.columns
     where table_schema = 'public'
       and table_name = 'categorie_macro'
       and column_name = 'menu_stampato'
  ) then
    alter table public.categorie_macro
      add column menu_stampato text default 'menu';

    update public.categorie_macro
       set menu_stampato = 'beverage'
     where ruolo = 'bar';
  end if;
end;
$$;

alter table public.categorie_macro
  drop constraint if exists categorie_macro_menu_stampato_valido;
alter table public.categorie_macro
  add constraint categorie_macro_menu_stampato_valido
  check (menu_stampato is null or menu_stampato in ('menu', 'beverage'));

comment on column public.categorie_macro.menu_stampato is
  'PDF in cui stampare la macro: menu, beverage, oppure null (nessuno). Solo per i PDF.';
