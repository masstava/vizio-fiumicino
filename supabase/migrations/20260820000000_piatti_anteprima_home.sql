-- =============================================================
-- Vizio Bistrot — selezione curata per l'anteprima home
--
-- Problema risolto: l'anteprima menu in home pescava i primi N
-- piatti per ordine di inserimento, quindi mostrava solo aperitivi
-- e taglieri — nemmeno un piatto di carne, che è invece la nicchia
-- differenziante del locale.
--
-- Flag distinto da piatti_in_evidenza:
--   piatti_in_evidenza    → slider "In evidenza", massimo 3
--   piatti_anteprima_home → griglia anteprima menu e cocktail,
--                           nessun limite rigido (la dashboard
--                           avvisa oltre 8, ma non blocca)
--
-- Stessa forma di piatti_in_evidenza (tabella ponte con ordine)
-- invece di colonne su piatti: mantiene la convenzione già in uso e
-- lascia la tabella piatti pulita dai flag di presentazione.
--
-- Idempotente: "create table if not exists" + drop/create per
-- policy e funzione.
-- =============================================================

create table if not exists public.piatti_anteprima_home (
  piatto_id uuid     not null references public.piatti (id) on delete cascade,
  ordine    smallint not null default 0,
  primary key (piatto_id)
);

alter table public.piatti_anteprima_home enable row level security;

drop policy if exists "lettura pubblica" on public.piatti_anteprima_home;
drop policy if exists "scrittura auth"   on public.piatti_anteprima_home;
drop policy if exists "modifica auth"    on public.piatti_anteprima_home;
drop policy if exists "elimina auth"     on public.piatti_anteprima_home;

create policy "lettura pubblica" on public.piatti_anteprima_home for select using (true);
create policy "scrittura auth"   on public.piatti_anteprima_home for insert with check (auth.uid() is not null);
create policy "modifica auth"    on public.piatti_anteprima_home for update using (auth.uid() is not null);
create policy "elimina auth"     on public.piatti_anteprima_home for delete using (auth.uid() is not null);

-- -------------------------------------------------------------
-- save_piatto: due parametri in più per il nuovo flag.
--
-- La firma cambia, quindi "create or replace" da solo creerebbe un
-- overload invece di sostituire: la vecchia versione va rimossa
-- esplicitamente (il drop porta con sé anche la sua grant).
-- -------------------------------------------------------------
drop function if exists public.save_piatto(
  uuid, uuid, text, text, text, text, numeric, boolean, boolean,
  text, smallint[], jsonb, boolean, smallint
);

create or replace function public.save_piatto(
  p_id                    uuid,
  p_categoria_id          uuid,
  p_nome                  text,
  p_nome_en               text,
  p_descrizione           text,
  p_descrizione_en        text,
  p_prezzo                numeric,
  p_prezzo_variabile      boolean,
  p_disponibile           boolean,
  p_foto_url              text,
  p_allergeni             smallint[],
  p_badges                jsonb,
  p_in_evidenza           boolean,
  p_in_evidenza_ordine    smallint,
  p_anteprima_home        boolean,
  p_anteprima_home_ordine smallint
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

  -- In evidenza in home (slider, max 3)
  delete from public.piatti_in_evidenza where piatto_id = v_piatto_id;
  if p_in_evidenza then
    insert into public.piatti_in_evidenza (piatto_id, ordine)
    values (v_piatto_id, coalesce(p_in_evidenza_ordine, 0));
  end if;

  -- Selezione curata per l'anteprima home (menu e cocktail)
  delete from public.piatti_anteprima_home where piatto_id = v_piatto_id;
  if p_anteprima_home then
    insert into public.piatti_anteprima_home (piatto_id, ordine)
    values (v_piatto_id, coalesce(p_anteprima_home_ordine, 0));
  end if;

  return v_piatto_id;
end;
$$;

grant execute on function public.save_piatto(
  uuid, uuid, text, text, text, text, numeric, boolean, boolean,
  text, smallint[], jsonb, boolean, smallint, boolean, smallint
) to authenticated;
