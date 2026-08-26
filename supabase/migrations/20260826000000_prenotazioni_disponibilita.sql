-- =============================================================
-- Vizio Bistrot — prenotazioni (§21, passo 2: disponibilità e RPC atomica)
-- =============================================================
-- Attiva lo schizzo lasciato in fondo alla migration del passo 1 e
-- aggiunge la lettura di disponibilità che serve al form pubblico.
-- Migration idempotente, stesso standard delle altre.
-- =============================================================


-- ---------------------------------------------------------------
-- crea_prenotazione — creazione atomica
-- ---------------------------------------------------------------
-- Stessa funzione già schizzata e discussa nel passo 1, non
-- ridisegnata: lucchetto di transazione sulla coppia (data, fascia),
-- poi conteggio e inserimento nella stessa transazione implicita.
--
-- Estesa in un solo punto rispetto allo schizzo: restituisce anche
-- l'id oltre al token. Il form di questo passo mostra a schermo un
-- riferimento di prenotazione (punto 4 della specifica) SENZA
-- mostrare il token di auto-gestione, che resta un segreto da
-- consegnare solo per email — l'invio email è il passo 3, quindi qui
-- il token viene comunque calcolato e salvato (serve al passo 5) ma
-- il form pubblico legge dalla risposta solo l'id.
--
-- security definer, come le altre funzioni che devono valere per un
-- utente anonimo: gira con i privilegi di chi possiede la funzione
-- (il ruolo che ha eseguito la migration), che è owner delle tabelle
-- e quindi non soggetto alle policy RLS — è così che l'inserimento
-- riesce anche dopo che la policy pubblica di insert viene revocata
-- più sotto in questo stesso file.
create or replace function public.crea_prenotazione(
  p_nome            text,
  p_telefono        text,
  p_email           text,
  p_data            date,
  p_fascia          time,
  p_coperti         smallint,
  p_note            text,
  p_evento_id       uuid,
  p_risposte_extra  jsonb
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

  -- Serializza SOLO chi prenota per la stessa data e fascia: due
  -- richieste su turni diversi non si aspettano a vicenda.
  perform pg_advisory_xact_lock(
    hashtextextended(p_data::text || ' ' || p_fascia::text, 0)
  );

  select cc.limite_coperti into v_limite
    from public.capienza_config cc
   where cc.data = p_data and cc.fascia = p_fascia;

  -- Nessuna riga in capienza_config, o limite esplicitamente nullo:
  -- stesso significato, nessun tetto.
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
       evento_id, risposte_extra)
    values
      (p_nome, p_telefono, p_email, p_data, p_fascia, p_coperti,
       p_note, p_evento_id, p_risposte_extra)
    returning prenotazioni.id, prenotazioni.token_gestione;
end;
$$;

revoke all on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb
) from public;

grant execute on function public.crea_prenotazione(
  text, text, text, date, time, smallint, text, uuid, jsonb
) to anon, authenticated;


-- ---------------------------------------------------------------
-- capienza_del_giorno — disponibilità per il form pubblico
-- ---------------------------------------------------------------
-- Il form deve sapere, per la data scelta, quali fasce sono al
-- completo. capienza_config è già leggibile pubblicamente (nessun
-- dato personale), ma "occupati" è una somma sui coperti di
-- prenotazioni — e prenotazioni non ha lettura pubblica. Da qui la
-- necessità di una funzione: espone SOLO l'aggregato (fascia, limite,
-- occupati), mai una riga di prenotazioni.
--
-- Restituisce solo le fasce che hanno un limite configurato per quella
-- data: se una fascia non compare nel risultato, per il client
-- significa "nessun tetto", esattamente come se capienza_config non
-- avesse quella riga — non serve dirlo esplicitamente per ciascuna
-- fascia possibile del giorno.
create or replace function public.capienza_del_giorno(p_data date)
returns table (
  fascia          time,
  limite_coperti  smallint,
  occupati        numeric
)
language sql
security definer
set search_path = public
stable
as $$
  select
    cc.fascia,
    cc.limite_coperti,
    coalesce((
      select sum(pr.coperti)
        from public.prenotazioni pr
       where pr.data = cc.data
         and pr.fascia = cc.fascia
         and pr.stato in ('confermata', 'completata')
    ), 0) as occupati
  from public.capienza_config cc
  where cc.data = p_data;
$$;

revoke all on function public.capienza_del_giorno(date) from public;
grant execute on function public.capienza_del_giorno(date) to anon, authenticated;


-- ---------------------------------------------------------------
-- Chiude la porta di servizio del passo 1
-- ---------------------------------------------------------------
-- Da qui in poi l'UNICA via di creazione è crea_prenotazione. Un
-- insert diretto con la chiave anon (bypassando la verifica di
-- capienza) non è più possibile: senza questa policy, e senza
-- un'altra che la sostituisca, l'insert diretto viene negato dalla RLS.
drop policy if exists "inserimento pubblico" on public.prenotazioni;
