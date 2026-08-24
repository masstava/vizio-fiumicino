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

## Tipi generati dal database

`src/lib/database.types.ts` è nel repo, generato dallo schema. I client
sono parametrizzati con `Database` (`src/lib/supabase/client.ts` e
`server.ts`), quindi `select()` è verificato end-to-end: se una colonna
sparisce dallo schema, o se la si chiede senza che esista, l'errore esce
in compilazione e non a runtime.

I due cast che stavano qui elencati sono chiusi:

- `src/lib/anteprima-home.ts` → il client è `SupabaseClient<Database>` e
  la forma della riga la deduce la `select()`. L'interfaccia `PiattoRow`
  scritta a mano non esiste più.
- `app/(admin)/.../menu/_actions.ts` → `save_piatto` dichiara
  `Returns: string`, quindi l'uuid torna già tipizzato.

Da rigenerare dopo ogni migration.

### L'unico cast che resta, e perché

`app/(admin)/.../menu/_actions.ts` passa gli argomenti di `save_piatto`
attraverso `ArgomentiRpc` (`src/lib/supabase/rpc.ts`) e poi li castra
alla firma stretta. Il generatore di Supabase emette gli argomenti delle
funzioni **sempre non-nullable**: non modella la nullabilità dei
parametri PL/pgSQL. Nelle nostre funzioni il NULL è invece parte del
contratto — `save_piatto` si dirama su `p_id is null` per distinguere
inserimento da aggiornamento, e descrizione, prezzo o foto possono
mancare.

Il cast è quindi una limitazione dello strumento, non del codice, e non
si chiude rigenerando i tipi. Resta comunque stretto: l'oggetto è
tipizzato con `ArgomentiRpc<"save_piatto">`, quindi nomi delle chiavi e
tipi dei valori restano controllati dai tipi generati; l'unica cosa
asserita al passaggio è che il NULL è ammesso.

### Nota: interface vs type per i parametri jsonb

`BadgeInput`, `FasciaInput` e `OrdinePiatto` sono alias di tipo e non
`interface`. Le interface in TypeScript non ricevono un index signature
implicito e quindi non risultano assegnabili a `Json`, il tipo dei
parametri `jsonb` delle RPC. Gli alias sì. Stessa forma, nessuna
differenza a runtime.
