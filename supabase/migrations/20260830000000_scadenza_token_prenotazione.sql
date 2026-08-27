-- =============================================================
-- Vizio Bistrot — scadenza del token di auto-gestione (90 giorni)
-- (Audit tecnico #2, punto 1)
-- =============================================================
-- Finora il token di prenotazione_da_token/annulla_prenotazione era
-- valido per sempre: bastava che la riga esistesse in prenotazioni.
-- Un link intercettato (email rigirata, casella condivisa, telefono
-- sbloccato) restava sfruttabile a tempo indefinito.
--
-- Le due funzioni già trattano "nessuna riga trovata" come un unico
-- caso — token mancante, mal formato o inesistente sono tutti
-- indistinguibili per chi chiama (vedi i commenti originali in
-- 20260825000000 e leggiPrenotazioneDaToken/annullaPrenotazioneToken
-- lato applicazione). Un token scaduto entra nello stesso caso: si
-- aggiunge una condizione sulla data di creazione alla WHERE già
-- presente, senza toccare la firma né il contratto delle funzioni —
-- "create or replace" basta, non serve drop.
--
-- 90 giorni è un tetto di comodo (assunzione da confermare col
-- committente, come già accade altrove nel progetto per soglie
-- analoghe): abbondantemente oltre l'orizzonte con cui si prenota un
-- tavolo, ma corto abbastanza da chiudere la finestra di un link
-- vecchio dimenticato in una casella di posta.
--
-- Migration idempotente: "create or replace" sulle funzioni, stessa
-- firma di prima.
-- =============================================================

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
  select p.id, p.nome, p.data, p.fascia, p.coperti, p.note,
         p.stato, p.evento_id, e.titolo, e.titolo_en,
         p.risposte_extra, p.creata_il
  from public.prenotazioni p
  left join public.eventi e on e.id = p.evento_id
  where p.token_gestione = p_token
    and p.creata_il > now() - interval '90 days';
$$;

revoke all on function public.prenotazione_da_token(text) from public;
grant execute on function public.prenotazione_da_token(text) to anon, authenticated;


create or replace function public.annulla_prenotazione(p_token text)
returns table (
  id             uuid,
  nome           text,
  telefono       text,
  email          text,
  data           date,
  fascia         time,
  coperti        smallint,
  note           text,
  evento_titolo  text,
  risposte_extra jsonb,
  locale         text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
    update public.prenotazioni p
       set stato = 'cancellata'
     where p.token_gestione = p_token
       and p.stato = 'confermata'
       and p.creata_il > now() - interval '90 days'
    returning
      p.id, p.nome, p.telefono, p.email, p.data, p.fascia, p.coperti, p.note,
      (select e.titolo from public.eventi e where e.id = p.evento_id),
      p.risposte_extra, p.locale;
end;
$$;

revoke all on function public.annulla_prenotazione(text) from public;
grant execute on function public.annulla_prenotazione(text) to anon, authenticated;
