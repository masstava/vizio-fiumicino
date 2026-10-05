-- =============================================================
-- Vizio Bistrot — cancellazione delle iscrizioni newsletter revocate
-- oltre i 12 mesi
-- =============================================================
-- La Privacy Policy (§3.1, §5, aggiornamento 2026-10-01) dichiara:
-- dopo la revoca del consenso, email e coupon newsletter restano
-- registrati per 12 mesi dalla data della revoca — solo per impedire
-- di ottenere più volte il coupon di benvenuto con cicli
-- disiscrizione/re-iscrizione — e vengono poi cancellati. Finora la
-- riga revocata restava per sempre: questa migration rende vero il
-- testo, come 20260830020000 fece per le prenotazioni.
--
-- Nessun job nuovo: si estende la funzione già eseguita ogni notte da
-- pg_cron ('pulizia-dati-prenotazioni', 03:00). Il nome resta quello
-- storico — rinominarla vorrebbe dire rischedulare il job per un solo
-- cambio di etichetta.
--
-- CANCELLAZIONE della riga, non anonimizzazione: il vincolo
-- coupon_email_per_tipo richiede l'email su ogni coupon newsletter, e
-- una riga senza email non servirebbe più comunque alla finalità
-- anti-abuso. coupon_utilizzi ha "on delete cascade": insieme al
-- coupon sparisce lo storico dei suoi riscatti, e con esso il suo
-- contributo ai conteggi di /gestione/coupon/analytics. Il testo della
-- Privacy Policy lo dice ("insieme allo storico dei relativi
-- utilizzi").
--
-- Solo righe con consenso_revocato_il valorizzato: un'iscrizione
-- attiva (null) non scade mai, e una re-iscrizione prima dei 12 mesi
-- rimette la colonna a null (iscriviti_newsletter, 20260905000000),
-- togliendo la riga dalla cancellazione.
--
-- Corpo precedente (20260906000000) invariato, una sola delete in
-- più. Idempotente: "create or replace" + revoke.
-- =============================================================

create or replace function public.pulizia_dati_prenotazioni()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.prenotazioni
   where creata_il < now() - interval '12 months';

  delete from public.limite_richieste_prenotazione
   where creata_il < now() - interval '1 day';

  delete from public.limite_richieste_newsletter
   where creata_il < now() - interval '1 day';

  delete from public.coupon
   where tipo = 'newsletter'
     and consenso_revocato_il is not null
     and consenso_revocato_il < now() - interval '12 months';
end;
$$;

-- Grant invariato: nessuno tranne pg_cron/il proprietario deve poterla
-- eseguire.
revoke all on function public.pulizia_dati_prenotazioni()
  from public, anon, authenticated;
