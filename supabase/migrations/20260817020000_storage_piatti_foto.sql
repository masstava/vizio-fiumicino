-- =============================================================
-- Vizio Bistrot — bucket Storage per le foto dei piatti
-- Idempotente: bucket con "on conflict do nothing", policy con
-- "drop policy if exists" prima di ricrearle.
-- =============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'piatti-foto',
  'piatti-foto',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "piatti-foto: lettura pubblica" on storage.objects;
create policy "piatti-foto: lettura pubblica"
  on storage.objects for select
  using (bucket_id = 'piatti-foto');

drop policy if exists "piatti-foto: upload autenticato" on storage.objects;
create policy "piatti-foto: upload autenticato"
  on storage.objects for insert
  with check (bucket_id = 'piatti-foto' and auth.uid() is not null);

drop policy if exists "piatti-foto: modifica autenticata" on storage.objects;
create policy "piatti-foto: modifica autenticata"
  on storage.objects for update
  using (bucket_id = 'piatti-foto' and auth.uid() is not null);

drop policy if exists "piatti-foto: elimina autenticata" on storage.objects;
create policy "piatti-foto: elimina autenticata"
  on storage.objects for delete
  using (bucket_id = 'piatti-foto' and auth.uid() is not null);
