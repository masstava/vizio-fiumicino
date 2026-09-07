-- =============================================================
-- Vizio Bistrot — audit esterno indipendente (§22): correzioni meccaniche
-- =============================================================
-- Tre correzioni diagnosticate con precisione dall'audit, nessuna
-- decisione da prendere qui — solo applicarle.
--
-- 1) LIMITI STORAGE — file_size_limit e allowed_mime_types sono NULL
--    sui bucket reali nonostante le migration originali li
--    dichiarino (5MB/jpeg-png-webp per piatti-foto, 50MB/+mp4 per
--    sito-media). Causa probabile: quelle migration usano
--    "on conflict (id) do nothing", e i bucket esistevano già
--    (creati a mano dal pannello Supabase prima che le migration
--    venissero applicate) — l'insert è passato come no-op silenzioso,
--    senza mai scrivere i limiti. Un update esplicito, non un nuovo
--    insert: i bucket esistono già, serve correggere le righe, non
--    tentare di ricrearle.
--
-- 2) 5 INDICI FK MANCANTI — segnalati dal Performance Advisor di
--    Supabase. In Postgres una FK non crea automaticamente un indice
--    sulla colonna referenziante (a differenza della PK/unique sul
--    lato referenziato) — le join e i delete a cascata su queste
--    colonne fanno oggi una scansione completa della tabella
--    referenziante. Priorità bassa ai volumi attuali (285 piatti),
--    corretto comunque.
--
-- 3) pulizia_dati_prenotazioni ora pulisce anche
--    limite_richieste_newsletter, aggiunta dopo il cron originale
--    (20260830020000) e mai inclusa: stessa retention breve già
--    applicata a limite_richieste_prenotazione, stesso principio (un
--    rate-limiter da 10 minuti non ha motivo di conservare storico).
--    Nessuna modifica al cron stesso: lo stesso job continua a
--    chiamare questa funzione, che ora fa un terzo delete.
--
-- Migration idempotente: update sempre ripetibile, "create index if
-- not exists", "create or replace function".
-- =============================================================


-- ---------------------------------------------------------------
-- 1) Limiti storage sui bucket esistenti
-- ---------------------------------------------------------------
update storage.buckets
   set file_size_limit = 5242880, -- 5MB
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
 where id = 'piatti-foto';

update storage.buckets
   set file_size_limit = 52428800, -- 50MB
       allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
 where id = 'sito-media';


-- ---------------------------------------------------------------
-- 2) Indici mancanti sulle colonne FK
-- ---------------------------------------------------------------
create index if not exists badge_piatto_id_idx
  on public.badge (piatto_id);

create index if not exists capienza_config_evento_id_idx
  on public.capienza_config (evento_id);

create index if not exists categorie_categoria_macro_id_idx
  on public.categorie (categoria_macro_id);

create index if not exists piatti_categoria_id_idx
  on public.piatti (categoria_id);

-- piatti_allergeni ha già una PK composita (piatto_id, allergene_id):
-- copre le ricerche per piatto_id (colonna in testa), non quelle per
-- allergene_id da solo (colonna in coda) — serve un indice dedicato.
create index if not exists piatti_allergeni_allergene_id_idx
  on public.piatti_allergeni (allergene_id);


-- ---------------------------------------------------------------
-- 3) pulizia_dati_prenotazioni — aggiunge limite_richieste_newsletter
-- ---------------------------------------------------------------
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
end;
$$;

-- Grant invariato rispetto a prima (audit di sicurezza, 20260904000000):
-- nessuno tranne pg_cron/il proprietario deve poterla eseguire.
revoke all on function public.pulizia_dati_prenotazioni()
  from public, anon, authenticated;
