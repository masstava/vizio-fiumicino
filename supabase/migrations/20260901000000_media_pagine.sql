-- =============================================================
-- Vizio Bistrot — media_pagine (Gestione sito, passo 1: solo schema)
--
-- Le immagini/video di sfondo delle pagine non legate a un piatto
-- (hero home, sfondi di La carne, Cocktail & Bar, Contatti,
-- Experience & Eventi) non hanno oggi un posto dove vivere nel
-- database: sono file statici o URL costruiti nel codice. Questa
-- migration crea solo lo spazio dove l'interfaccia del prossimo
-- passaggio potrà leggerli/scriverli — nessuna UI, nessun dato
-- esistente migrato qui (vedi la nota "Stato attuale" in fondo).
--
-- Struttura scelta: pagina + slot (chiave composta), non una riga per
-- pagina con un solo url. Motivo: una pagina con UNA sola immagine
-- oggi si comporta esattamente come "una riga per pagina" (lo slot
-- resta sempre 'hero', suo valore di default), ma il giorno in cui una
-- pagina avrà bisogno di una seconda immagine (es. una galleria su
-- Contatti) non serve una migration che cambi la chiave primaria — si
-- aggiunge solo una riga con un altro slot. Stessa idea già in uso in
-- questo progetto per capienza_config (chiave composta data+fascia)
-- invece di una tabella per fascia.
--
-- "pagina" resta testo libero, non un enum/check con l'elenco delle
-- pagine valide: stessa scelta già fatta per contenuti_sito.chiave
-- (chiave tecnica, il significato vive nel codice che la legge, non
-- nel database) — coerenza con un pattern già consolidato nel
-- progetto, non un'invenzione nuova per questa tabella.
--
-- "tipo" (immagine | video) esiste perché l'hero della home è già oggi
-- un VIDEO, non una foto (vedi nota "Stato attuale" in fondo): una
-- colonna che si chiamasse solo "url_immagine" sarebbe fuorviante per
-- quella riga. Un domani ogni slot potrà scegliere il proprio tipo
-- indipendentemente dagli altri.
--
-- "url" è nullable e senza vincolo not null, di proposito: una riga
-- assente O con url nullo significano entrambe "nessuna immagine
-- impostata, il sito ricade sul suo comportamento attuale" (per la
-- home, il video già in uso; per le altre quattro pagine, lo sfondo
-- scuro con accenti CSS già in uso, senza immagine). Stessa filosofia
-- di contenuti_sito.valore.
--
-- Idempotente: "create table if not exists" + drop/create per policy
-- e trigger.
-- =============================================================

create table if not exists public.media_pagine (
  pagina         text not null,
  slot           text not null default 'hero',
  tipo           text not null default 'immagine',
  url            text,
  aggiornata_il  timestamptz not null default now(),

  primary key (pagina, slot),

  constraint media_pagine_tipo_valido
    check (tipo in ('immagine', 'video'))
);

-- aggiornata_il automatico — riusa la funzione già creata da
-- 20260825000000_prenotazioni.sql (non ridefinita qui: questa
-- migration la applica dopo, nell'ordine dei file).
drop trigger if exists media_pagine_aggiornata_il on public.media_pagine;
create trigger media_pagine_aggiornata_il
  before update on public.media_pagine
  for each row execute function public.tocca_aggiornata_il();

alter table public.media_pagine enable row level security;

drop policy if exists "lettura pubblica" on public.media_pagine;
drop policy if exists "scrittura auth"   on public.media_pagine;
drop policy if exists "modifica auth"    on public.media_pagine;
drop policy if exists "elimina auth"     on public.media_pagine;

create policy "lettura pubblica" on public.media_pagine for select using (true);
create policy "scrittura auth"   on public.media_pagine for insert with check (auth.uid() is not null);
create policy "modifica auth"    on public.media_pagine for update using (auth.uid() is not null);
create policy "elimina auth"     on public.media_pagine for delete using (auth.uid() is not null);


-- =============================================================
-- Storage — bucket "sito-media" (non "sito-foto")
--
-- Il codice pubblico (src/components/home/Hero.tsx) costruisce GIÀ
-- oggi l'URL del video hero della home puntando a un bucket chiamato
-- "sito-media" — nessuna migration l'ha mai creato, ma il nome è già
-- quello che il sito si aspetta di leggere. Creare invece un bucket
-- "sito-foto" (come suggerito, ragionevolmente, per tenere distinte
-- concettualmente foto di sito e foto di piatti) introdurrebbe una
-- seconda incongruenza: il codice guarderebbe "sito-media", la
-- dashboard scriverebbe su "sito-foto", e nulla funzionerebbe finché
-- qualcuno non se ne accorge. Riuso quindi il nome già in uso, e lo
-- rendo "media" (non "foto") perché deve contenere anche il video
-- hero, non solo immagini: un bucket chiamato "sito-foto" sarebbe
-- fuorviante per un file .mp4 quanto lo sarebbe stata la colonna
-- "url_immagine" di cui sopra.
--
-- Limite dimensione file: 50MB, non i 5MB di piatti-foto — quel
-- limite è pensato per foto di piatti (JPEG/PNG/WebP compressi), qui
-- deve passare anche un video hero. Tipi MIME ammessi: le tre immagini
-- già ammesse da piatti-foto, più mp4 per il video.
-- =============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sito-media',
  'sito-media',
  true,
  52428800, -- 50MB
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
)
on conflict (id) do nothing;

drop policy if exists "sito-media: lettura pubblica" on storage.objects;
create policy "sito-media: lettura pubblica"
  on storage.objects for select
  using (bucket_id = 'sito-media');

drop policy if exists "sito-media: upload autenticato" on storage.objects;
create policy "sito-media: upload autenticato"
  on storage.objects for insert
  with check (bucket_id = 'sito-media' and auth.uid() is not null);

drop policy if exists "sito-media: modifica autenticata" on storage.objects;
create policy "sito-media: modifica autenticata"
  on storage.objects for update
  using (bucket_id = 'sito-media' and auth.uid() is not null);

drop policy if exists "sito-media: elimina autenticata" on storage.objects;
create policy "sito-media: elimina autenticata"
  on storage.objects for delete
  using (bucket_id = 'sito-media' and auth.uid() is not null);


-- =============================================================
-- Stato attuale (diagnosi per il prossimo passaggio — nessuna riga
-- seminata qui, solo dove trovare le cose):
--
-- • Home hero: src/components/home/Hero.tsx, costante
--   HERO_VIDEO_URL = `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/
--   public/sito-media/video-home.mp4`. È GIÀ un URL di Supabase
--   Storage (bucket sito-media, oggetto video-home.mp4), non un file
--   nel repo — non c'è nulla da "caricare" per la home, solo da
--   collegare: il prossimo passaggio leggerà
--   media_pagine dove pagina='home-hero' e, se assente/nulla, ricadrà
--   sulla stessa costante di oggi (stesso identico comportamento
--   attuale, nessuna rottura). Nessun poster/fallback-immagine oggi:
--   il riempitivo è ImagePlaceholder (gradiente CSS puro, nessun
--   file).
-- • La carne, Cocktail & Bar, Contatti, Experience & Eventi: le
--   quattro pagine condividono un solo componente,
--   src/components/pagine/PaginaHero.tsx, che OGGI non accetta alcuna
--   prop immagine/video — lo sfondo è bg-dark (colore) più
--   DarkSectionAccent (gradienti CSS, "nessuna immagine" per commento
--   esplicito nel suo stesso file). Non c'è NESSUN file da migrare per
--   queste quattro: introdurre uno sfondo per loro è una funzionalità
--   nuova, non lo spostamento di qualcosa che già esiste. Un solo
--   componente condiviso e quattro call site da toccare quando arriva
--   l'interfaccia (app/(public)/[locale]/la-carne/page.tsx,
--   .../cocktail-bar/page.tsx, .../contatti/page.tsx,
--   .../experience-eventi/page.tsx).
-- =============================================================
