# Vizio Bistrot

Sito web di Vizio Bistrot — Fiumicino.

## Stack

- [Next.js 15](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/) — strict mode
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — database PostgreSQL + Auth
- [ESLint](https://eslint.org/) — eslint-config-next

## Variabili d'ambiente

Copia `.env.local.example` in `.env.local` e compila i valori dal pannello Supabase:

```bash
cp .env.local.example .env.local
```

| Variabile | Dove trovarla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → Publishable key |

## Database

Le migration SQL si trovano in `supabase/migrations/`. Per applicarle al progetto Supabase:

1. Installa la [Supabase CLI](https://supabase.com/docs/guides/cli)
2. `supabase link --project-ref <project-ref>`
3. `supabase db push`

Oppure copia il contenuto di `supabase/migrations/20260817000000_initial_schema.sql`
nell'editor SQL del pannello Supabase.

## Avvio in locale

```bash
npm install
npm run dev
```

L'app sarà disponibile su [http://localhost:3000](http://localhost:3000).

Per verificare la connessione al database: [http://localhost:3000/test-db](http://localhost:3000/test-db)

## Altri comandi

```bash
npm run build   # build di produzione
npm run start   # avvia il server di produzione (dopo il build)
npm run lint    # analisi del codice con ESLint
```
