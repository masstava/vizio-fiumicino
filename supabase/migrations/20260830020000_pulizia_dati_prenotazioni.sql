-- =============================================================
-- Vizio Bistrot — cancellazione automatica oltre i 12 mesi
-- (Audit tecnico #2, punto 3)
-- =============================================================
-- La Privacy Policy dichiara: "Dati di prenotazione: 12 mesi dalla
-- data della prenotazione" (§5). Fino a questa migration nessun
-- meccanismo lo faceva davvero — il testo pubblicato descriveva un
-- comportamento che il sistema non implementava.
--
-- CANCELLAZIONE, non anonimizzazione — scelta motivata, non assunta
-- in silenzio:
--   Anonimizzare (svuotare nome/telefono/email mantenendo data/
--   coperti) avrebbe senso SE esistesse già, o fosse prevista a
--   breve, una finalità statistica che li consuma — non è questo il
--   caso: il progetto non ha oggi alcuna funzione di reportistica
--   storica (la dashboard prenotazioni legge un solo giorno alla
--   volta, vedi /gestione/prenotazioni). Costruire l'anonimizzazione
--   ora vorrebbe dire mantenere una tabella "statistiche" a cui
--   nessuna funzionalità guarda, e per attivarla davvero servirebbe
--   comunque un'altra correzione della Privacy Policy (nuova finalità,
--   nuova base giuridica) — lo stesso tipo di scostamento fra testo e
--   realtà appena corretto altrove in questo audit. Cancellare è la
--   scelta che corrisponde esattamente a quanto già dichiarato, senza
--   introdurre una finalità nuova non richiesta da nessuno. Se in
--   futuro servirà una statistica aggregata, è una decisione a parte,
--   con una sua base giuridica e una sua riga in Privacy Policy — non
--   un sottoprodotto implicito di questa pulizia.
--
-- pg_cron è già abilitato sul progetto Supabase (confermato dal
-- committente, disponibile di default su tutti i piani): "create
-- extension if not exists" qui sotto non richiede quindi alcuna
-- attivazione manuale, resta solo per idempotenza/portabilità.
--
-- La stessa esecuzione quotidiana pulisce anche
-- limite_richieste_prenotazione (creata nella migration precedente):
-- a quella tabella non serve mai più di 10 minuti di storia, ma senza
-- una pulizia periodica crescerebbe per sempre. Un'unica funzione,
-- un unico job: non serve un secondo cron per un lavoro da due righe.
--
-- cron.schedule con un jobname già esistente non è garantito
-- aggiornare il job su tutte le versioni di pg_cron: si disattiva
-- esplicitamente l'eventuale job omonimo prima di riprogrammarlo, così
-- la migration resta rilanciabile senza duplicare il job né lasciarne
-- una versione vecchia accanto alla nuova.
-- =============================================================

create extension if not exists pg_cron;

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
end;
$$;

-- Nessun grant a anon/authenticated: questa funzione la esegue solo
-- il job pg_cron, mai il sito o la dashboard. Il ruolo che possiede la
-- funzione (quello con cui è stata applicata la migration) ha già
-- implicitamente il permesso di eseguirla.
revoke all on function public.pulizia_dati_prenotazioni() from public;

select cron.unschedule(jobid)
  from cron.job
 where jobname = 'pulizia-dati-prenotazioni';

select cron.schedule(
  'pulizia-dati-prenotazioni',
  '0 3 * * *',
  $$select public.pulizia_dati_prenotazioni();$$
);
