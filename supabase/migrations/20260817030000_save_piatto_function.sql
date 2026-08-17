-- =============================================================
-- Vizio Bistrot — funzione di salvataggio atomico di un piatto
--
-- Scrive piatti + piatti_allergeni + badge + piatti_in_evidenza
-- in un'unica transazione implicita: se una qualsiasi parte
-- fallisce, l'intera funzione viene annullata (nessun salvataggio
-- parziale). "create or replace" rende la migration idempotente.
--
-- security invoker: la funzione gira con i permessi di chi la
-- chiama, quindi le policy RLS restano in vigore normalmente.
-- =============================================================

create or replace function public.save_piatto(
  p_id               uuid,
  p_categoria_id     uuid,
  p_nome             text,
  p_nome_en          text,
  p_descrizione      text,
  p_descrizione_en   text,
  p_prezzo           numeric,
  p_prezzo_variabile boolean,
  p_disponibile      boolean,
  p_foto_url         text,
  p_allergeni        smallint[],
  p_badges           jsonb,
  p_in_evidenza      boolean,
  p_in_evidenza_ordine smallint
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_piatto_id uuid;
  v_ordine    smallint;
begin
  if auth.uid() is null then
    raise exception 'Non autenticato';
  end if;

  if p_id is null then
    select coalesce(max(ordine) + 1, 0) into v_ordine
    from public.piatti
    where categoria_id = p_categoria_id;

    insert into public.piatti (
      categoria_id, nome, nome_en, descrizione, descrizione_en,
      prezzo, prezzo_variabile, disponibile, foto_url, ordine
    ) values (
      p_categoria_id, p_nome, p_nome_en, p_descrizione, p_descrizione_en,
      p_prezzo, p_prezzo_variabile, p_disponibile, p_foto_url, v_ordine
    )
    returning id into v_piatto_id;
  else
    update public.piatti set
      categoria_id     = p_categoria_id,
      nome             = p_nome,
      nome_en          = p_nome_en,
      descrizione      = p_descrizione,
      descrizione_en   = p_descrizione_en,
      prezzo           = p_prezzo,
      prezzo_variabile = p_prezzo_variabile,
      disponibile      = p_disponibile,
      foto_url         = p_foto_url
    where id = p_id
    returning id into v_piatto_id;

    if v_piatto_id is null then
      raise exception 'Piatto non trovato: %', p_id;
    end if;
  end if;

  -- Allergeni: sostituzione completa
  delete from public.piatti_allergeni where piatto_id = v_piatto_id;
  if p_allergeni is not null and array_length(p_allergeni, 1) > 0 then
    insert into public.piatti_allergeni (piatto_id, allergene_id)
    select v_piatto_id, a
    from unnest(p_allergeni) as a;
  end if;

  -- Badge: sostituzione completa
  delete from public.badge where piatto_id = v_piatto_id;
  if p_badges is not null and jsonb_array_length(p_badges) > 0 then
    insert into public.badge (piatto_id, testo, testo_en)
    select v_piatto_id, b ->> 'testo', nullif(b ->> 'testo_en', '')
    from jsonb_array_elements(p_badges) as b
    where trim(coalesce(b ->> 'testo', '')) <> '';
  end if;

  -- In evidenza in home
  delete from public.piatti_in_evidenza where piatto_id = v_piatto_id;
  if p_in_evidenza then
    insert into public.piatti_in_evidenza (piatto_id, ordine)
    values (v_piatto_id, coalesce(p_in_evidenza_ordine, 0));
  end if;

  return v_piatto_id;
end;
$$;

grant execute on function public.save_piatto(
  uuid, uuid, text, text, text, text, numeric, boolean, boolean,
  text, smallint[], jsonb, boolean, smallint
) to authenticated;
