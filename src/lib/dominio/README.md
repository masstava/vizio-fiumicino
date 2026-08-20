# Tipi di dominio

Qui vivono i tipi di business del **sito pubblico**: piatto, evento,
orario. I componenti li importano, non li definiscono.

```ts
import type { PiattoConBadge, GiornoOrario } from "@/src/lib/dominio";
```

Prima stavano dentro i componenti che li disegnavano — `PiattoAnteprima`
era definito in `FeaturedDishSlide.tsx` ed era importato da cinque file.
Il modello dati risultava di proprietà del componente che lo mostrava, e
`FasciaOraria` era già finita duplicata in due punti.

## Cosa NON sta qui, e perché

Non tutto ciò che si chiama "orario" o "piatto" va accorpato: forme
diverse descrivono momenti diversi dello stesso dato, e unificarle
costringerebbe ogni consumatore a gestire campi che nel suo contesto
non esistono.

| Tipo | Dove sta | Perché resta separato |
|---|---|---|
| `OrarioFasciaRow`, `OrarioGiornoRow` | `app/(admin)/.../orari/_components/types.ts` | Stato del form: apertura e chiusura possono essere vuote. Sul sito non lo sono mai. |
| `OrarioFascia`, `OrarioGiorno` | `src/lib/pdf/OrariDocument.tsx` | Forma attesa dal generatore di PDF. |
| `DishData` | `src/components/ui/DishRow.tsx` | Riga di elenco della dashboard: prezzo, allergeni come codici numerici, badge multipli. Da rivalutare quando la pagina menu completo dirà se riusa `DishRow`. |

## Prossimo passo: tipi generati dal database

Restano due punti in cui il codice afferma una forma che il compilatore
non può verificare:

- `src/lib/anteprima-home.ts` → `(piatti ?? []) as PiattoRow[]`
- `app/(admin)/.../menu/_actions.ts` → `data as string` (UUID dalla RPC)

Sono veri finché la stringa passata a `select()` e l'interfaccia
restano allineate, ma nulla lo garantisce: togliendo una colonna dal
select il tipo continuerebbe a mentire e l'errore uscirebbe a runtime.

Si chiudono generando i tipi dallo schema:

```bash
supabase login
supabase link --project-ref efqytltwyruxmszxilca
supabase gen types typescript --linked > src/lib/database.types.ts
```

Da rigenerare dopo ogni migration. Una volta presente il file, `select()`
diventa verificato end-to-end e quei due cast si possono togliere.
