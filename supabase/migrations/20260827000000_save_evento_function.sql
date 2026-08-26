-- =============================================================
-- Vizio Bistrot — funzione di salvataggio atomico di un evento
-- (§21 passo 4)
-- =============================================================
-- Stesso schema di save_piatto (20260817030000): scrive eventi +
-- campi_extra_evento in un'unica transazione implicita, sostituzione
-- completa dei campi extra a ogni salvataggio. "create or replace"
-- rende la migration idempotente.
--
-- Il massimo di 3 campi extra NON è imposto qui: è un vincolo
-- d'interfaccia (vedi la migration del passo 1, stessa scelta già
-- fatta per "max 3 piatti in evidenza"). Questa funzione accetterebbe
-- anche un array più lungo — la dashboard non lo manda mai.
--
-- security invoker: gira con i permessi di chi chiama (staff già
-- autenticato), le policy RLS restano in vigore normalmente.
-- =============================================================

create or replace function public.save_evento(
  p_id             uuid,
  p_titolo         text,
  p_titolo_en      text,
  p_descrizione    text,
  p_descrizione_en text,
  p_data_evento    date,
  p_attivo         boolean,
  p_campi_extra    jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_evento_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  if p_id is null then
    insert into public.eventi (
      titolo, titolo_en, descrizione, descrizione_en, data_evento, attivo
    ) values (
      p_titolo, p_titolo_en, p_descrizione, p_descrizione_en, p_data_evento, p_attivo
    )
    returning id into v_evento_id;
  else
    update public.eventi set
      titolo         = p_titolo,
      titolo_en      = p_titolo_en,
      descrizione    = p_descrizione,
      descrizione_en = p_descrizione_en,
      data_evento    = p_data_evento,
      attivo         = p_attivo
    where id = p_id
    returning id into v_evento_id;

    if v_evento_id is null then
      raise exception 'Evento non trovato: %', p_id;
    end if;
  end if;

  -- Campi extra: sostituzione completa, stesso trattamento di
  -- piatti_allergeni/badge in save_piatto.
  delete from public.campi_extra_evento where evento_id = v_evento_id;
  if p_campi_extra is not null and jsonb_array_length(p_campi_extra) > 0 then
    insert into public.campi_extra_evento (evento_id, etichetta, ordine)
    select v_evento_id, c ->> 'etichetta', coalesce((c ->> 'ordine')::smallint, 0)
    from jsonb_array_elements(p_campi_extra) as c
    where trim(coalesce(c ->> 'etichetta', '')) <> '';
  end if;

  return v_evento_id;
end;
$$;

grant execute on function public.save_evento(
  uuid, text, text, text, text, date, boolean, jsonb
) to authenticated;
