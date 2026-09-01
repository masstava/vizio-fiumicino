# Dashboard Design System — /gestione

Riferimento per il refactor UI/UX della dashboard in 6 passaggi. Non è
una specifica di funzionalità: è linguaggio visivo (densità, colori,
pattern di interazione), approvato dal committente su un prototipo
esterno al repo. La logica di ogni pagina — form, validazioni, Server
Actions, RPC — non cambia in nessun passaggio a meno che non sia detto
esplicitamente.

## Stato di avanzamento

- **Passaggio 1/6 — completato**: sistema di design di base + nuova
  shell (sidebar + topbar), applicata a tutto `/gestione/*`. Nessuna
  pagina toccata nel suo contenuto.
- **Passaggio 2/6 — completato**: editor piatti (`/gestione/menu`).
  Lista a righe hairline invece di card, badge di stato cliccabile al
  posto dell'interruttore, ricerca e "+ Nuovo piatto" spostati nella
  topbar via portale (`TopbarSlot`), intestazione di pagina rimossa
  (topbar ora distingue lista/nuovo/modifica), contatore sidebar
  "Menu" popolato con il conteggio reale dei piatti disponibili.
  Corretto anche un mismatch di hydration di dnd-kit emerso nel
  passaggio 1 (causa: id generato da un contatore di modulo che non
  sopravvive identico tra server e client — fix: id deterministico
  passato a ogni `DndContext`). Nessuna modifica alla logica di
  salvataggio/validazione/allergeni/badge/foto/prezzo.
- **Passaggi 3-6**: applicano le stesse regole alle sezioni restanti
  (orari, eventi, prenotazioni, contenuti).

Vedi "Cosa NON è ancora stato fatto" in fondo per l'elenco preciso di
ciò che i passaggi successivi devono ancora collegare.

## Colori

Token dichiarati in `app/globals.css`, dentro `@theme`, prefisso
`admin-` per restare distinti dai colori del sito pubblico dove il
ruolo è diverso (es. `--color-ink` pubblico è un colore di TESTO,
`--color-admin-ink` qui è uno sfondo — stesso nome di famiglia,
significato diverso, da cui la necessità di token separati).

| Token | Valore | Uso |
|---|---|---|
| `--color-admin-ink` | `#17181c` | Sfondo sidebar |
| `--color-admin-canvas` | `#faf9f7` | Sfondo pagina (`<main>`) |
| `--color-admin-surface` | `#ffffff` | Sfondo tabelle/pannelli/topbar |
| `--color-admin-line` | `#e7e5e0` | Bordo hairline di default |
| `--color-admin-line-strong` | `#d6d4cd` | Bordo più marcato (separatori importanti) |
| `--color-admin-text` | `#1a1a18` | Testo primario su canvas/surface |
| `--color-admin-text-2` | `#6b6a64` | Testo secondario |
| `--color-admin-text-3` | `#6f6d66` | Testo muted/meta (vedi nota contrasto sotto — il grigio del prototipo non passava la soglia, corretto) |
| `--color-admin-brick` | alias di `--color-bordeaux` (`#8b1a1a`) | Azione primaria — STESSO rosso del sito pubblico, non un valore nuovo |
| `--color-admin-brick-wash` | `#fbeaea` | Sfondo tenue per stati/selezione legati al brick |
| `--color-admin-green` / `--color-admin-green-wash` | `#2f6b4f` / `#e7f3ec` | Badge di stato — "disponibile"/positivo |
| `--color-admin-amber` / `--color-admin-amber-wash` | `#8a5a12` / `#fbf0dd` | Badge di stato — "in attesa"/da controllare |
| `--color-admin-gray` / `--color-admin-gray-wash` | `#6b6a64` / `#eeece8` | Badge di stato — "cancellato"/neutro |

**Testo sulla sidebar scura** (`--color-admin-ink`): non è stato
introdotto un token nuovo — si riusano `text-cream-text` (voce attiva)
e `text-muted-dark` (voce inattiva), gli stessi già in uso per le
sezioni scure del sito pubblico. Non era specificato nel prototipo, e
introdurre due token in più per un caso già coperto dalla palette
esistente avrebbe violato il principio "riusa dove non serve essere
distinti".

**Nota contrasto `--color-admin-text-3`**: il grigio inizialmente scelto
(`#9a9890`, dal prototipo) misurava 2.75:1 su `--color-admin-canvas` e
2.89:1 su `--color-admin-surface` — sotto la soglia di 4.5:1 richiesta
per testo normale da `DEFINITION_OF_DONE.md`, e insufficiente anche per
testo grande (soglia 3:1). Il sottotitolo della topbar (12.5px, quindi
testo normale, non grande) lo avrebbe usato: corretto a `#6f6d66`,
misurato 4.92:1 su canvas e 5.18:1 su surface (formula WCAG a luminanza
relativa, stesso metodo usato nelle verifiche precedenti di questo
progetto). Di conseguenza è vicino a `--color-admin-text-2`
(`#6b6a64`, 5.16:1 su canvas): con un pavimento di 4.5:1 su uno sfondo
già quasi bianco c'è poco margine per un terzo livello di grigio
davvero più tenue mantenendo la conformità — è un limite reale della
palette, non una svista. Se un passaggio successivo usa questo token
su uno sfondo diverso (es. dentro una riga selezionata in
`--color-admin-brick-wash`), va riverificato: non è garantito che il
rapporto resti sopra soglia su ogni possibile sfondo.

## Tipografia

Inter per tutta l'interfaccia della dashboard. Fraunces resta
riservato a un solo punto: il wordmark "Vizio" nell'intestazione della
sidebar (mobile e desktop) — non altrove, per non far sembrare la
dashboard il sito editoriale.

Le pagine esistenti (non toccate in questo passaggio) hanno titoli
`<h1>` in `font-serif`: `AdminShell.tsx` applica
`[&_.font-serif]:font-sans` al contenitore principale, che riporta
quei titoli a Inter senza modificare un solo file di pagina — un
override di stile scoped al contenitore, non un cambio di contenuto.
Quando un passaggio successivo tocca una pagina, è più pulito
rimuovere `font-serif` direttamente da quel file piuttosto che
continuare ad affidarsi all'override.

## Sidebar

- Larghezza 232px da `md` in su, statica; sotto `md` diventa un
  pannello a scomparsa (invariato dalla Fase precedente — vedi sotto).
- Sfondo `--color-admin-ink`.
- Intestazione: wordmark "Vizio" (Fraunces) + "Gestione" (Inter,
  maiuscolo, piccolo) sotto.
- Voci: icona (20×20, tratto, `currentColor`) + testo, mai icona da
  sola — il testo resta il nome accessibile del link.
- Voce attiva: barra di 3px sul lato sinistro, colore `--admin-brick`
  (`border-l-[3px]`), testo e icona passano a `text-cream-text`. NON
  un blocco di sfondo pieno: la voce attiva si riconosce dalla barra e
  dal colore del testo, non da un riempimento.
- Contatore opzionale a destra della voce — pillola tonda con numero,
  sfondo `--admin-brick`. **"Menu" popolato** dal passaggio 2/6 (numero
  reale di piatti con `disponibile = true`, calcolato nel layout
  server-side e passato a `SidebarNav` via `AdminShell`). Le altre voci
  restano senza contatore: vedi "Cosa NON è ancora stato fatto".
- Comportamento responsive: **invariato** rispetto a prima del
  refactor — pannello a scomparsa sotto `md` (hamburger che diventa
  X, overlay che chiude al tocco, Esc che chiude e restituisce il
  focus, foco che entra nel pannello all'apertura, nessun focus trap
  di proposito). Cambiata solo la veste (colori, icone, indicatore di
  voce attiva), non la logica né i breakpoint.

## Topbar

Sopra il contenuto di ogni pagina, dentro `<main>`:

- Titolo pagina: 18px, peso 600, `--color-admin-text`.
- Sottotitolo: 12.5px, `--color-admin-text-3`.
- Ricerca: prevista dove la pagina ha una lista. **Collegata per
  `/gestione/menu`** dal passaggio 2/6 (ricerca libera per nome piatto).
  Le altre sezioni restano da collegare.
- Pulsanti azione: bordo/trasparente di default (secondario); pieno
  `--admin-brick` riservato a **una sola azione primaria per vista**
  — mai due pulsanti pieni rossi visibili insieme. **"+ Nuovo piatto"
  collegato** dal passaggio 2/6. Le altre sezioni restano da collegare.

Titolo e sottotitolo sono ricavati dal percorso (`usePathname`), non
passati dalla pagina — la topbar non conosce il contenuto di una
pagina in anticipo. Dove la pagina deve invece portare un proprio
controllo nella topbar (ricerca, azione primaria), lo fa con
`TopbarSlot` (`src/components/admin/TopbarSlot.tsx`): un portale verso
un nodo fisso (`#admin-topbar-slot`, reso da `AdminTopbar`) che lascia
lo stato del controllo esattamente dove la pagina lo possiede già,
spostando solo dove appare nel DOM. `order` sullo slot decide la
posizione orizzontale, indipendente da quale portale monta per primo.
Le pagine ancora non toccate mostrano ancora la propria intestazione
in linea: la duplicazione visiva temporanea (topbar + intestazione
della pagina) resta nota e attesa per quelle sezioni, elencata sotto in
"Cosa NON è ancora stato fatto".

## Tabelle/liste dense

Applicato per la prima volta in `/gestione/menu` (passaggio 2/6), da
ripetere per le liste restanti (eventi, prenotazioni):

- Righe con bordo hairline (`divide-y divide-admin-line` sul
  contenitore), non card arrotondate con ombra — più adatto a liste
  lunghe scorse velocemente.
- Hover: leggero cambio di sfondo (`hover:bg-admin-canvas` sulla riga).
- Riga selezionata: tinta `--admin-brick-wash` — non applicabile in
  `/gestione/menu` (nessuna selezione multipla in quella lista); da
  usare quando una lista futura introduce selezione.
- Sfondo della tabella/pannello: `--color-admin-surface` (bianco), non
  `--color-admin-canvas` — la superficie della lista si stacca dal
  fondo pagina.
- Il componente condiviso `DishRow` (usato anche dal sito pubblico) NON
  è stato toccato: la resa hairline/hover vive nel contenitore admin
  attorno ad esso (`AdminDishRow`/`SortableDishRow`), non nel
  componente condiviso — così il menu pubblico resta invariato.

## Badge di stato

Due componenti distinti, stesso aspetto visivo:

- `src/components/admin/StatusBadge.tsx` — di sola lettura (pillola
  con pallino colorato + testo, mai solo un colore di sfondo pieno).
  Quattro toni: `verde`, `ambra`, `grigio`, `brick`.
- `src/components/admin/StatusToggle.tsx` — la stessa pillola dentro un
  `<button role="switch" aria-checked>`: dove lo stato è anche un
  CONTROLLO (si può cambiare cliccando), non solo una lettura. **Usato
  dal passaggio 2/6** per "Disponibile"/"Esaurito" in `/gestione/menu`
  (`verde`/`grigio`), al posto del vecchio interruttore a levetta —
  stessa azione (`toggleDisponibile`), stesso aggiornamento ottimistico
  con rollback, solo la resa è cambiata.
- `/gestione/prenotazioni` **non ancora toccato**: oggi segnala lo
  stato con un colore di testo su un `<select>` — il passaggio dedicato
  a quella pagina deciderà se e come sostituirlo con `StatusToggle`.

## Pulsanti

- Secondario (default): bordo, sfondo trasparente.
- Primario: pieno `--admin-brick`, riservato a UNA sola azione per
  vista.
- Il componente condiviso `src/components/ui/Button.tsx` (usato sia
  dal sito pubblico che dalla dashboard) già rende `variant="primary"`
  in bordeaux — che è esattamente `--admin-brick` (stesso valore
  riusato, non un colore nuovo): **nessuna modifica necessaria a
  Button.tsx** per allinearsi a questa regola. Il lavoro dei prossimi
  passaggi è verificare, pagina per pagina, che non compaiano MAI due
  `variant="primary"` visibili nella stessa vista.

## Cosa NON è ancora stato fatto (voci aperte per i passaggi 3-6)

- **Ricerca in topbar**: collegata solo per `/gestione/menu`. Eventi e
  prenotazioni restano da collegare — stesso meccanismo (`TopbarSlot`),
  richiede solo che quella pagina esponga lo stato di ricerca già
  proprio tramite il portale.
- **Azione primaria in topbar**: idem — "+ Aggiungi evento" e
  l'eventuale azione primaria di prenotazioni/orari/contenuti restano
  nel corpo della pagina, da spostare nel passaggio dedicato a ciascuna.
- **Contatore sidebar**: solo "Menu" è popolato (numero reale di piatti
  disponibili). Le altre voci restano senza contatore: lo stato
  "prenotazioni da confermare" non esiste nell'attuale modello dati
  (`stato` è `confermata | cancellata | completata | no-show`, nessuno
  stato "in attesa" da contare) — non è stato inventato uno stato
  fittizio solo per riempire un numero.
- **Restyling tabelle/liste dense**: fatto per `/gestione/menu`. Da
  applicare ancora a eventi e prenotazioni.
- **Badge di stato al posto del `<select>` colorato** in
  `/gestione/prenotazioni`: da decidere nel passaggio dedicato (schema
  già pronto: `StatusToggle`, usato per la prima volta in
  `/gestione/menu`).
- **Duplicazione temporanea del titolo di pagina**: risolta per
  `/gestione/menu` (lista, nuovo, modifica). Orari, eventi,
  prenotazioni e contenuti mostrano ANCORA la propria intestazione in
  linea (eyebrow "Gestione" + `<h1>`), invariata — verrà rimossa quando
  quella pagina sarà toccata nel suo passaggio dedicato.
