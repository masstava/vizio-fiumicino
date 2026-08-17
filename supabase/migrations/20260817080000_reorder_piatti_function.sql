-- =============================================================
-- Vizio Bistrot — riordino batch dei piatti in una categoria
--
-- Il drag-and-drop in /gestione/menu invia il nuovo ordine di TUTTI
-- i piatti della categoria interessata in un'unica chiamata. Un
-- "UPDATE ... FROM jsonb_array_elements(...)" è una singola istruzione
-- SQL: un solo round-trip, atomico di per sé (o si applica per intero
-- o niente). "create or replace" rende la migration idempotente.
--
-- Il filtro "and p.categoria_id = p_categoria_id" è una difesa in
-- profondità: anche se il client inviasse per errore id di un'altra
-- categoria, non verrebbero toccati.
-- =============================================================

create or replace function public.reorder_piatti(p_categoria_id uuid, p_ordini jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  update public.piatti as p
  set ordine = (o ->> 'ordine')::smallint
  from jsonb_array_elements(p_ordini) as o
  where p.id = (o ->> 'id')::uuid
    and p.categoria_id = p_categoria_id;
end;
$$;

grant execute on function public.reorder_piatti(uuid, jsonb) to authenticated;
