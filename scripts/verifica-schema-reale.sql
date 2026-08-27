-- =============================================================
-- Vizio Bistrot — istantanea completa dello schema reale
-- =============================================================
-- Uso: incolla nell'SQL Editor di Supabase ed esegui. Restituisce
-- UNA riga, UNA colonna (schema_snapshot) con dentro tutto in JSON
-- annidato — clicca sulla cella per espanderla/copiarla.
--
-- Non modifica nulla: solo lettura dai catalog di sistema
-- (information_schema, pg_catalog). Sicura da eseguire quante volte
-- serve.
-- =============================================================

select jsonb_build_object(
  'colonne', (
    select jsonb_agg(jsonb_build_object(
      'tabella', c.table_name,
      'colonna', c.column_name,
      'tipo', c.data_type,
      'nullable', c.is_nullable,
      'default', c.column_default
    ) order by c.table_name, c.ordinal_position)
    from information_schema.columns c
    where c.table_schema = 'public'
  ),
  'funzioni', (
    select jsonb_agg(jsonb_build_object(
      'funzione', p.proname,
      'argomenti', pg_get_function_identity_arguments(p.oid),
      'ritorna', pg_get_function_result(p.oid),
      'security', case when p.prosecdef then 'definer' else 'invoker' end,
      'anon_can_execute', has_function_privilege('anon', p.oid, 'EXECUTE'),
      'authenticated_can_execute', has_function_privilege('authenticated', p.oid, 'EXECUTE')
    ) order by p.proname)
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  ),
  'rls_abilitata', (
    select jsonb_agg(jsonb_build_object(
      'tabella', t.tablename,
      'rls_attiva', t.rowsecurity
    ) order by t.tablename)
    from pg_tables t
    where t.schemaname = 'public'
  ),
  'policy_rls', (
    select jsonb_agg(jsonb_build_object(
      'schema', pol.schemaname,
      'tabella', pol.tablename,
      'policy', pol.policyname,
      'comando', pol.cmd,
      'ruoli', pol.roles,
      'using', pol.qual,
      'with_check', pol.with_check
    ) order by pol.schemaname, pol.tablename, pol.policyname)
    from pg_policies pol
    where pol.schemaname in ('public', 'storage')
  ),
  'indici', (
    select jsonb_agg(jsonb_build_object(
      'tabella', tab.relname,
      'indice', idx.relname,
      'definizione', pg_get_indexdef(idx.oid)
    ) order by tab.relname, idx.relname)
    from pg_index i
    join pg_class idx on idx.oid = i.indexrelid
    join pg_class tab on tab.oid = i.indrelid
    join pg_namespace n on n.oid = tab.relnamespace
    where n.nspname = 'public'
  )
) as schema_snapshot;
