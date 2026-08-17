-- =============================================================
-- Vizio Bistrot — salvataggio atomico degli orari (fasce multiple)
--
-- Con un numero variabile di fasce per giorno, un upsert singolo non
-- basta più: bisogna sostituire l'intero set di righe. delete+insert
-- dentro una funzione è un'unica transazione implicita — se l'insert
-- fallisce, anche la delete viene annullata (mai una tabella orari
-- svuotata a metà). "create or replace" rende la migration idempotente.
-- =============================================================

create or replace function public.save_orari(p_rows jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  delete from public.orari;

  insert into public.orari (giorno_settimana, ordine, apertura, chiusura)
  select
    (r ->> 'giorno_settimana')::smallint,
    (r ->> 'ordine')::smallint,
    nullif(r ->> 'apertura', '')::time,
    nullif(r ->> 'chiusura', '')::time
  from jsonb_array_elements(p_rows) as r;
end;
$$;

grant execute on function public.save_orari(jsonb) to authenticated;
