-- =============================================================
-- Vizio Bistrot — fix save_orari: DELETE richiede una clausola WHERE
--
-- Il progetto Supabase ha una protezione attiva che blocca qualsiasi
-- DELETE privo di WHERE (anche dentro una funzione), per evitare
-- cancellazioni di massa accidentali. La versione precedente della
-- funzione faceva "delete from public.orari;" senza WHERE, bloccata
-- con l'errore "DELETE requires a WHERE clause".
--
-- "where true" cancella comunque tutte le righe (nessun cambio di
-- comportamento), ma soddisfa il requisito sintattico. "create or
-- replace" rende la migration idempotente.
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

  delete from public.orari where true;

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
