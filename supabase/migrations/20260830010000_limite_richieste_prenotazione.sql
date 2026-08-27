-- =============================================================
-- Vizio Bistrot — rate-limit per IP su crea_prenotazione
-- (Audit tecnico #2, punto 2 — anti-spam, parte "rate-limit")
-- =============================================================
-- /prenota è un endpoint pubblico di scrittura senza autenticazione:
-- niente impediva finora a un client automatizzato di chiamarlo senza
-- limiti. Nessun servizio esterno (niente CAPTCHA): un limite per IP
-- appoggiato a una tabella, nello stesso database che già serve tutto
-- il resto — non introduce un'infrastruttura nuova.
--
-- Perché una tabella e non un contatore in-memory nell'applicazione:
-- il sito gira su funzioni serverless (Vercel). Una variabile in
-- memoria non sopravvive fra un'invocazione e la successiva — spesso
-- nemmeno fra due richieste consecutive dello stesso client, se
-- capitano su istanze diverse. Un limite che "a volte" limita non è
-- un limite: serve uno stato condiviso e durevole, che qui è già
-- Postgres.
--
-- Perché una funzione SECURITY DEFINER e non una lettura+scrittura
-- fatta dall'applicazione in due passi: stesso problema di
-- concorrenza già risolto per crea_prenotazione (due richieste
-- simultanee dallo stesso IP non devono poter contare zero a vicenda)
-- — qui non serve un lucchetto esplicito perché "conta poi inserisci"
-- dentro un'unica funzione è già una sola transazione implicita, e il
-- margine di errore di un doppio conteggio raro non è la superficie
-- che questa difesa deve chiudere (non è un contatore preciso al
-- centesimo, è un freno per bot, non per un singolo utente sfortunato
-- al millisecondo giusto).
--
-- La tabella contiene SOLO indirizzi IP e timestamp — nessun dato
-- identificativo della persona che prenota (nome, telefono, email
-- restano nella riga di prenotazioni, non qui). Attenzione comunque:
-- un indirizzo IP è dato personale ai sensi del GDPR. Le righe non
-- servono oltre la finestra di 10 minuti del controllo: la pulizia
-- periodica (vedi la prossima migration, che aggiunge anche questa
-- tabella al job di pulizia già previsto per le prenotazioni) evita
-- che si accumulino a tempo indefinito.
--
-- Migration idempotente: "create table if not exists", funzione con
-- "create or replace".
-- =============================================================

create table if not exists public.limite_richieste_prenotazione (
  id        bigint generated always as identity primary key,
  ip        text not null,
  creata_il timestamptz not null default now()
);

-- Il controllo filtra per ip e per finestra temporale: un indice
-- composito su entrambi serve esattamente quella query, non una scan
-- completa della tabella a ogni prenotazione.
create index if not exists limite_richieste_prenotazione_ip_idx
  on public.limite_richieste_prenotazione (ip, creata_il);

-- RLS attiva, NESSUNA policy: né lettura né scrittura per nessun
-- ruolo, nemmeno "authenticated". L'unico modo di leggere o scrivere
-- questa tabella è la funzione sotto, che gira con i privilegi del
-- proprietario e quindi non è soggetta a RLS — esattamente come le
-- funzioni di auto-gestione su "prenotazioni" (vedi 20260825000000).
-- Non c'è alcun caso legittimo in cui il pannello staff o il sito
-- pubblico debbano leggere queste righe direttamente.
alter table public.limite_richieste_prenotazione enable row level security;


-- ---------------------------------------------------------------
-- verifica_limite_richieste — controlla e registra in un solo passo
-- ---------------------------------------------------------------
-- Ritorna true se la richiesta può proseguire, false se il limite
-- (5 richieste ogni 10 minuti per lo stesso IP) è già raggiunto. Se
-- consente la richiesta, registra anche questo tentativo: le
-- richieste bloccate NON vengono registrate di nuovo, altrimenti un
-- bot che continua a martellare terrebbe la finestra sempre piena
-- all'infinito invece di lasciarla scorrere naturalmente oltre i 10
-- minuti dalle prime 5.
--
-- p_ip nullo o vuoto (indirizzo non determinabile lato applicazione,
-- es. in sviluppo locale senza header X-Forwarded-For): si lascia
-- passare piuttosto che bloccare per un dato mancante — questo
-- controllo è un freno per bot, non deve poter negare una
-- prenotazione legittima per un dettaglio infrastrutturale.
create or replace function public.verifica_limite_richieste(p_ip text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_conteggio integer;
begin
  if p_ip is null or btrim(p_ip) = '' then
    return true;
  end if;

  select count(*) into v_conteggio
    from public.limite_richieste_prenotazione
   where ip = p_ip
     and creata_il > now() - interval '10 minutes';

  if v_conteggio >= 5 then
    return false;
  end if;

  insert into public.limite_richieste_prenotazione (ip) values (p_ip);
  return true;
end;
$$;

revoke all on function public.verifica_limite_richieste(text) from public;
grant execute on function public.verifica_limite_richieste(text) to anon, authenticated;
