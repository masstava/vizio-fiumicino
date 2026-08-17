-- =============================================================
-- Vizio Bistrot — schema iniziale
-- =============================================================

-- ---------------------------------------------------------------
-- categorie_macro
-- ---------------------------------------------------------------
create table if not exists public.categorie_macro (
  id     uuid primary key default gen_random_uuid(),
  nome   text not null,
  ordine smallint not null default 0
);

-- ---------------------------------------------------------------
-- categorie
-- ---------------------------------------------------------------
create table if not exists public.categorie (
  id                  uuid primary key default gen_random_uuid(),
  categoria_macro_id  uuid not null references public.categorie_macro (id) on delete cascade,
  nome                text not null,
  ordine              smallint not null default 0
);

-- ---------------------------------------------------------------
-- piatti
-- ---------------------------------------------------------------
create table if not exists public.piatti (
  id               uuid primary key default gen_random_uuid(),
  categoria_id     uuid not null references public.categorie (id) on delete cascade,
  nome             text not null,
  descrizione      text,
  prezzo           numeric(8, 2),
  prezzo_variabile boolean not null default false,
  disponibile      boolean not null default true,
  foto_url         text,
  ordine           smallint not null default 0,
  nome_en          text,
  descrizione_en   text
);

-- ---------------------------------------------------------------
-- allergeni  (tabella statica — 14 allergeni UE)
-- ---------------------------------------------------------------
create table if not exists public.allergeni (
  id       smallint primary key,
  nome_it  text not null,
  nome_en  text not null
);

insert into public.allergeni (id, nome_it, nome_en) values
  (1,  'Cereali contenenti glutine',              'Gluten-containing cereals'),
  (2,  'Crostacei',                               'Crustaceans'),
  (3,  'Uova',                                    'Eggs'),
  (4,  'Pesce',                                   'Fish'),
  (5,  'Arachidi',                                'Peanuts'),
  (6,  'Soia',                                    'Soybeans'),
  (7,  'Latte',                                   'Milk'),
  (8,  'Frutta a guscio',                         'Tree nuts'),
  (9,  'Sedano',                                  'Celery'),
  (10, 'Senape',                                  'Mustard'),
  (11, 'Semi di sesamo',                          'Sesame seeds'),
  (12, 'Anidride solforosa e solfiti',            'Sulphur dioxide and sulphites'),
  (13, 'Lupini',                                  'Lupin'),
  (14, 'Molluschi',                               'Molluscs')
on conflict (id) do nothing;

-- ---------------------------------------------------------------
-- piatti_allergeni  (tabella ponte)
-- ---------------------------------------------------------------
create table if not exists public.piatti_allergeni (
  piatto_id    uuid     not null references public.piatti (id) on delete cascade,
  allergene_id smallint not null references public.allergeni (id) on delete cascade,
  primary key (piatto_id, allergene_id)
);

-- ---------------------------------------------------------------
-- badge
-- ---------------------------------------------------------------
create table if not exists public.badge (
  id        uuid primary key default gen_random_uuid(),
  piatto_id uuid not null references public.piatti (id) on delete cascade,
  testo     text not null,
  testo_en  text
);

-- ---------------------------------------------------------------
-- piatti_in_evidenza  (max 3, per lo slider home)
-- ---------------------------------------------------------------
create table if not exists public.piatti_in_evidenza (
  piatto_id uuid    not null references public.piatti (id) on delete cascade,
  ordine    smallint not null default 0,
  primary key (piatto_id)
);

-- ---------------------------------------------------------------
-- orari
-- ---------------------------------------------------------------
create table if not exists public.orari (
  giorno_settimana smallint primary key check (giorno_settimana between 0 and 6),
  apertura         time,
  chiusura         time
);

-- ---------------------------------------------------------------
-- eventi
-- ---------------------------------------------------------------
create table if not exists public.eventi (
  id          uuid primary key default gen_random_uuid(),
  titolo      text not null,
  descrizione text,
  data_evento date,
  attivo      boolean not null default true
);

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.categorie_macro     enable row level security;
alter table public.categorie           enable row level security;
alter table public.piatti              enable row level security;
alter table public.allergeni           enable row level security;
alter table public.piatti_allergeni    enable row level security;
alter table public.badge               enable row level security;
alter table public.piatti_in_evidenza  enable row level security;
alter table public.orari               enable row level security;
alter table public.eventi              enable row level security;

-- ---------------------------------------------------------------
-- Helper macro: lettura pubblica + scrittura autenticata
-- ---------------------------------------------------------------

-- categorie_macro
create policy "lettura pubblica"  on public.categorie_macro for select using (true);
create policy "scrittura auth"    on public.categorie_macro for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.categorie_macro for update using (auth.uid() is not null);
create policy "elimina auth"      on public.categorie_macro for delete using (auth.uid() is not null);

-- categorie
create policy "lettura pubblica"  on public.categorie for select using (true);
create policy "scrittura auth"    on public.categorie for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.categorie for update using (auth.uid() is not null);
create policy "elimina auth"      on public.categorie for delete using (auth.uid() is not null);

-- piatti
create policy "lettura pubblica"  on public.piatti for select using (true);
create policy "scrittura auth"    on public.piatti for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.piatti for update using (auth.uid() is not null);
create policy "elimina auth"      on public.piatti for delete using (auth.uid() is not null);

-- allergeni (tabella statica — solo lettura pubblica, no scrittura via RLS)
create policy "lettura pubblica"  on public.allergeni for select using (true);
create policy "scrittura auth"    on public.allergeni for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.allergeni for update using (auth.uid() is not null);
create policy "elimina auth"      on public.allergeni for delete using (auth.uid() is not null);

-- piatti_allergeni
create policy "lettura pubblica"  on public.piatti_allergeni for select using (true);
create policy "scrittura auth"    on public.piatti_allergeni for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.piatti_allergeni for update using (auth.uid() is not null);
create policy "elimina auth"      on public.piatti_allergeni for delete using (auth.uid() is not null);

-- badge
create policy "lettura pubblica"  on public.badge for select using (true);
create policy "scrittura auth"    on public.badge for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.badge for update using (auth.uid() is not null);
create policy "elimina auth"      on public.badge for delete using (auth.uid() is not null);

-- piatti_in_evidenza
create policy "lettura pubblica"  on public.piatti_in_evidenza for select using (true);
create policy "scrittura auth"    on public.piatti_in_evidenza for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.piatti_in_evidenza for update using (auth.uid() is not null);
create policy "elimina auth"      on public.piatti_in_evidenza for delete using (auth.uid() is not null);

-- orari
create policy "lettura pubblica"  on public.orari for select using (true);
create policy "scrittura auth"    on public.orari for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.orari for update using (auth.uid() is not null);
create policy "elimina auth"      on public.orari for delete using (auth.uid() is not null);

-- eventi
create policy "lettura pubblica"  on public.eventi for select using (true);
create policy "scrittura auth"    on public.eventi for insert with check (auth.uid() is not null);
create policy "modifica auth"     on public.eventi for update using (auth.uid() is not null);
create policy "elimina auth"      on public.eventi for delete using (auth.uid() is not null);
