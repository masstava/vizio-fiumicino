-- =============================================================
-- Vizio Bistrot — dashboard prenotazioni: riepilogo per la striscia settimanale
-- =============================================================
-- La striscia mostra, per ciascuno dei 7 giorni (oggi + 6 successivi):
-- coperti prenotati e quante prenotazioni di quel giorno sono ancora
-- "non viste". Una funzione dedicata invece di caricare le righe e
-- sommarle lato client — la stessa scelta già fatta per
-- capienza_del_giorno: l'aggregazione resta nel database, il client
-- riceve solo il risultato finale.
--
-- security invoker (non definer): a differenza di capienza_del_giorno
-- (che deve servire anche il form pubblico, senza lettura su
-- prenotazioni), questa funzione è per la sola dashboard — chi chiama
-- è già staff autenticato, e la RLS esistente su prenotazioni
-- (auth.uid() is not null) basta da sola. Nessun bisogno di
-- privilegi elevati.
--
-- generate_series copre anche i giorni senza nessuna prenotazione:
-- senza, un giorno a zero prenotazioni sparirebbe dal risultato
-- invece di comparire con coperti=0/non_viste=0, e la striscia
-- dovrebbe indovinare quali giorni mancano.
create or replace function public.riepilogo_settimana_prenotazioni(
  p_da date,
  p_a  date
)
returns table (
  data       date,
  coperti    bigint,
  non_viste  bigint
)
language sql
security invoker
set search_path = public
stable
as $$
  select
    gs.giorno::date as data,
    coalesce((
      select sum(pr.coperti)
        from public.prenotazioni pr
       where pr.data = gs.giorno::date
         and pr.stato in ('confermata', 'completata')
    ), 0) as coperti,
    coalesce((
      select count(*)
        from public.prenotazioni pr
       where pr.data = gs.giorno::date
         and pr.stato <> 'cancellata'
         and pr.vista = false
    ), 0) as non_viste
  from generate_series(p_da::timestamp, p_a::timestamp, interval '1 day') as gs(giorno)
  order by data;
$$;

revoke all on function public.riepilogo_settimana_prenotazioni(date, date) from public;
grant execute on function public.riepilogo_settimana_prenotazioni(date, date) to authenticated;
