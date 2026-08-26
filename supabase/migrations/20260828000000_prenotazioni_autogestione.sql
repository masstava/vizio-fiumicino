-- =============================================================
-- Vizio Bistrot — auto-gestione self-service (§21, passo 5/6)
-- =============================================================
-- Tre cambi, tutti necessari per la pagina /gestisci-prenotazione:
--
-- 1) prenotazioni guadagna "locale": la lingua in cui è stata fatta la
--    prenotazione. Non esisteva finora — l'email di conferma (passo 3)
--    riceveva la lingua come parametro della action ma non la
--    scriveva a database. Serve ORA perché quando lo staff cancella
--    dal pannello (passo 4) è il sistema, non una richiesta HTTP col
--    proprio Accept-Language, a dover decidere in che lingua avvisare
--    il cliente — e senza salvarla da nessuna parte non c'è modo di
--    saperlo.
--
-- 2) crea_prenotazione accetta e scrive p_locale. Cambia la firma
--    della funzione (nuovo parametro): "create or replace" non basta,
--    va droppata e ricreata — altrimenti Postgres creerebbe un
--    secondo overload invece di sostituire il primo.
--
-- 3) prenotazione_da_token restituisce anche risposte_extra e il
--    titolo dell'evento collegato (se presente). Il passo 1 li aveva
--    esclusi di proposito ("non servono a mostrare la prenotazione a
--    chi l'ha fatta") ma il passo 5 chiede esplicitamente di mostrare
--    "risposte ai campi extra" ed "evento se presente" nella pagina di
--    auto-gestione: la decisione va rivista, non è un errore di
--    sicurezza da correggere — il token stesso è già la prova di
--    possesso che autorizza a vedere questi campi, esattamente come
--    già autorizza a vedere note e coperti. Stessa ragione per cui
--    cambia firma (le colonne restituite sono cambiate): drop e
--    ricrea, non "or replace".
-- =============================================================


-- ---------------------------------------------------------------
-- 1) colonna locale
-- ---------------------------------------------------------------
alter table public.prenotazioni
  add column if not exists locale text not null default 'it';

alter table public.prenotazioni drop constraint if exists prenotazioni_locale_valida;
alter table public.prenotazioni
  add constraint prenotazioni_locale_valida check (locale in ('it', 'en'));


-- ---------------------------------------------------------------
-- 2) crea_prenotazione — aggiunge p_locale
-- ---------------------------------------------------------------
drop function if exists public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb
);

create or replace function public.crea_prenotazione(
  p_nome            text,
  p_telefono        text,
  p_email           text,
  p_data            date,
  p_fascia          time,
  p_coperti         smallint,
  p_note            text,
  p_evento_id       uuid,
  p_risposte_extra  jsonb,
  p_locale          text
)
returns table (id uuid, token_gestione text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limite   smallint;
  v_occupati numeric;
begin
  if p_coperti is null or p_coperti <= 0 then
    raise exception 'Numero di coperti non valido';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_data::text || ' ' || p_fascia::text, 0)
  );

  select cc.limite_coperti into v_limite
    from public.capienza_config cc
   where cc.data = p_data and cc.fascia = p_fascia;

  if v_limite is not null then
    select coalesce(sum(pr.coperti), 0) into v_occupati
      from public.prenotazioni pr
     where pr.data = p_data and pr.fascia = p_fascia
       and pr.stato in ('confermata', 'completata');

    if v_occupati + p_coperti > v_limite then
      raise exception 'CAPIENZA_ESAURITA'
        using detail = format('%s posti liberi', v_limite - v_occupati);
    end if;
  end if;

  return query
    insert into public.prenotazioni
      (nome, telefono, email, data, fascia, coperti, note,
       evento_id, risposte_extra, locale)
    values
      (p_nome, p_telefono, p_email, p_data, p_fascia, p_coperti,
       p_note, p_evento_id, p_risposte_extra, coalesce(p_locale, 'it'))
    returning prenotazioni.id, prenotazioni.token_gestione;
end;
$$;

revoke all on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb, text
) from public;

grant execute on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb, text
) to anon, authenticated;


-- ---------------------------------------------------------------
-- 3) prenotazione_da_token — aggiunge risposte_extra ed evento_titolo
-- ---------------------------------------------------------------
drop function if exists public.prenotazione_da_token(text);

create or replace function public.prenotazione_da_token(p_token text)
returns table (
  id              uuid,
  nome            text,
  data            date,
  fascia          time,
  coperti         smallint,
  note            text,
  stato           text,
  evento_id       uuid,
  evento_titolo   text,
  evento_titolo_en text,
  risposte_extra  jsonb,
  creata_il       timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
  -- Ancora un sottoinsieme delle colonne: telefono, email e token
  -- restano fuori (vedi commento in cima al file). risposte_extra e
  -- il titolo dell'evento entrano invece da questo passo.
  select p.id, p.nome, p.data, p.fascia, p.coperti, p.note,
         p.stato, p.evento_id, e.titolo, e.titolo_en,
         p.risposte_extra, p.creata_il
  from public.prenotazioni p
  left join public.eventi e on e.id = p.evento_id
  where p.token_gestione = p_token;
$$;

revoke all on function public.prenotazione_da_token(text) from public;
grant execute on function public.prenotazione_da_token(text) to anon, authenticated;
