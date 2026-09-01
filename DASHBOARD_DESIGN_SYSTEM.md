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
- **Passaggio 3/6 — completato**: editor orari (`/gestione/orari`) ed
  editor eventi (`/gestione/eventi`). Orari: prospetto settimanale in
  un pannello hairline (era già una pagina di sola modifica, senza
  lista/ricerca/azione primaria in topbar — non applicabile qui), nota
  scaduta ora in tono ambra. Eventi: lista a righe hairline, badge di
  stato cliccabile (`StatusToggle`, come in Menu) al posto
  dell'interruttore, "+ Nuovo evento" spostato in topbar via
  `TopbarSlot`, intestazione duplicata rimossa, contatore sidebar
  "Eventi" popolato (eventi attivi non ancora passati, ricorrenti
  compresi). Nessuna modifica a save_orari/save_evento, al guard dei 3
  campi extra o a "applica a tutti i giorni".
- **Passaggio 4/6 — completato**: dashboard prenotazioni
  (`/gestione/prenotazioni`) — il punto di partenza del refactor,
  corrispondenza più stretta al prototipo. Lista a righe hairline con
  ricerca in topbar (invariata: nome/telefono); nuovo `StatusSelect`
  (pillola a N stati, non binaria come `StatusToggle`) per i 4 stati
  reali della prenotazione; pannello di dettaglio a comparsa laterale
  (slide-over) all'apertura di una riga, con lo stesso stato
  sincronizzato fra riga e pannello; pannello capienza restyled, un
  solo salvataggio per l'intero giorno invariato; 3 riquadri di
  statistiche in alto (Prenotazioni, Coperti totali, No-show — "in
  attesa" del prototipo sostituito con un dato reale, non esiste come
  stato) calcolati dalla stessa lettura già in uso per la lista, nessuna
  query aggiuntiva; contatore sidebar "Prenotazioni" popolato
  (prenotazioni di oggi non cancellate). Corretta anche
  un'inconsistenza di fuso orario introdotta nel passaggio 3 (il
  contatore "Eventi" usava la data UTC del server invece del fuso di
  Roma). Nessuna modifica a cambiaStatoPrenotazione (incluso l'avviso
  email alla cancellazione), salvaCapienzaGiorno o al parametro `?data=`.
  Due bug trovati e corretti durante la verifica prima del commit: la
  lista non si aggiornava cambiando giorno (mancava una `key` per
  forzare il remount dello stato locale) e il focus non entrava nel
  pannello di dettaglio all'apertura (due effetti in corsa nello stesso
  commit — corretto aggiungendo la dipendenza mancante).
- **Passaggi 5-6**: applicano le stesse regole alle sezioni restanti
  (contenuti, rifiniture finali).

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
  sfondo `--admin-brick`. Popolati: "Menu" (piatti con `disponibile =
  true`, passaggio 2/6), "Eventi" (eventi attivi non ancora passati,
  passaggio 3/6), "Prenotazioni" (prenotazioni di oggi non cancellate,
  passaggio 4/6) — tutti calcolati nel layout server-side con una
  singola `Promise.all` e passati a `SidebarNav` via `AdminShell`.
  "Oggi" per il contatore prenotazioni/eventi è sempre nel fuso di Roma
  (`oggiEOraRoma()`, § Verifica passaggio 4/6), non la data UTC del
  server. Orari e Testi della home restano senza contatore: sono
  pagine singole, un conteggio non avrebbe senso lì.
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
- Ricerca: prevista dove la pagina ha una lista. Collegata per
  `/gestione/menu` (nome piatto, passaggio 2/6) e
  `/gestione/prenotazioni` (nome/telefono, passaggio 4/6). Non
  pertinente per orari (non è una lista) né per eventi (lista troppo
  corta per giustificarla). Contenuti resta da valutare.
- Pulsanti azione: bordo/trasparente di default (secondario); pieno
  `--admin-brick` riservato a **una sola azione primaria per vista**
  — mai due pulsanti pieni rossi visibili insieme. Collegati:
  "+ Nuovo piatto" (menu, passaggio 2/6), "+ Nuovo evento" (eventi,
  passaggio 3/6). Prenotazioni non ha un'azione di questo tipo (non si
  "crea" una prenotazione da qui); Contenuti resta da valutare.

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

Applicato a `/gestione/menu` (passaggio 2/6), `/gestione/eventi` e
`/gestione/prenotazioni` (passaggio 3/6 e 4/6, stesso schema); anche i
pannelli di `/gestione/orari` (prospetto settimanale) e del pannello
capienza in prenotazioni riusano lo stesso stile pur non essendo liste
di record indipendenti (coerenza visiva, § Orari sopra).

- Righe con bordo hairline (`divide-y divide-admin-line` sul
  contenitore), non card arrotondate con ombra — più adatto a liste
  lunghe scorse velocemente.
- Hover: leggero cambio di sfondo (`hover:bg-admin-canvas` sulla riga).
- Riga selezionata: tinta `--admin-brick-wash` — non applicabile a
  nessuna lista fatta finora (nessuna selezione multipla in nessuna di
  esse); da usare quando una lista futura introduce selezione.
- Sfondo della tabella/pannello: `--color-admin-surface` (bianco), non
  `--color-admin-canvas` — la superficie della lista si stacca dal
  fondo pagina.
- Il componente condiviso `DishRow` (usato anche dal sito pubblico) NON
  è stato toccato: la resa hairline/hover vive nel contenitore admin
  attorno ad esso (`AdminDishRow`/`SortableDishRow`), non nel
  componente condiviso — così il menu pubblico resta invariato.
- **Riga che apre un pannello di dettaglio** (`/gestione/prenotazioni`,
  passaggio 4/6): la porzione cliccabile (nome/dettagli) è un
  `<button>`, il controllo di stato è un elemento FRATELLO fuori da
  quel bottone, mai annidato dentro — un controllo interattivo dentro
  un `<button>` è HTML non valido e produce comportamento indefinito.

## Badge di stato

Tre componenti distinti, stesso linguaggio visivo (pallino colorato +
testo, mai solo un colore di sfondo pieno):

- `src/components/admin/StatusBadge.tsx` — di sola lettura. Quattro
  toni: `verde`, `ambra`, `grigio`, `brick`.
- `src/components/admin/StatusToggle.tsx` — la stessa pillola dentro un
  `<button role="switch" aria-checked>`: dove lo stato è un CONTROLLO
  binario (due soli valori). **Usato dal passaggio 2/6** per
  "Disponibile"/"Esaurito" in `/gestione/menu` e **dal passaggio 3/6**
  per "Attivo"/"Non attivo" in `/gestione/eventi` (entrambi
  `verde`/`grigio`) — stessa azione (`toggleDisponibile`/
  `toggleAttivo`), stesso aggiornamento ottimistico con rollback, solo
  la resa è cambiata. Gli interruttori dentro un FORM (non una riga di
  lista) restano `Switch`: "Chiuso" per giorno in `/gestione/orari`,
  "Stato" nel form evento — sono un campo da compilare insieme al
  resto, non lo stato di sola-azione di una riga.
- `src/components/admin/StatusSelect.tsx` — stessa pillola, ma per uno
  stato con PIÙ di due valori: sotto, un `<select>` nativo invisibile
  (`opacity-0`, non `display:none` — resta nell'albero di
  accessibilità, cattura tastiera/screen reader) posizionato sopra la
  pillola decorativa. **Usato dal passaggio 4/6** per i 4 stati reali
  di `/gestione/prenotazioni` (confermata=verde, completata=grigio,
  no-show=ambra, cancellata=brick — mappatura in
  `prenotazioni/_components/stati.ts`, condivisa fra la riga della
  lista e il pannello di dettaglio), al posto del vecchio `<select>`
  colorato via classe di testo diretta.

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

## Cosa NON è ancora stato fatto (voci aperte per i passaggi 5-6)

- **Ricerca in topbar**: fatta per menu (nome piatto) e prenotazioni
  (nome/telefono). Contenuti resta da valutare nel suo passaggio
  dedicato; orari ed eventi non ne hanno bisogno (non applicabile, non
  dimenticata).
- **Azione primaria in topbar**: fatta per menu ("+ Nuovo piatto") ed
  eventi ("+ Nuovo evento"). Prenotazioni non ha un'azione di questo
  tipo (non applicabile: una prenotazione la crea il cliente dal sito,
  non lo staff da qui). L'eventuale azione primaria di contenuti resta
  da valutare. Orari non ne ha bisogno (non applicabile).
- **Contatore sidebar**: "Menu", "Eventi" e "Prenotazioni" sono
  popolati — tutte le sezioni con un conteggio sensato ora ce l'hanno.
  Orari e Contenuti restano senza: sono pagine singole, un contatore
  lì non avrebbe un referente reale.
- **Restyling tabelle/liste dense**: fatto per menu, eventi e
  prenotazioni (più i pannelli-form di orari e capienza, per coerenza
  visiva). Nessuna lista nota resta da convertire.
- **Pannello di dettaglio (slide-over)**: introdotto in
  `/gestione/prenotazioni` (passaggio 4/6, dal prototipo). Non
  applicato altrove: menu ed eventi usano ancora una pagina dedicata
  per modificare un record (`/gestione/menu/[id]`,
  `/gestione/eventi/[id]`) — un pattern diverso ma già esistente e
  funzionante, non nella specifica di nessun passaggio finora cambiarlo.
- **Duplicazione temporanea del titolo di pagina**: risolta per menu,
  orari, eventi e prenotazioni. Solo Contenuti mostra ANCORA la propria
  intestazione in linea (eyebrow "Gestione" + `<h1>`), invariata —
  verrà rimossa nel suo passaggio dedicato.
