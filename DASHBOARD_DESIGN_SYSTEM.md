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
- **Passaggi 2-6**: applicano queste regole al contenuto di ciascuna
  sezione (menu, orari, eventi, prenotazioni, contenuti) — tabelle,
  badge, pulsanti, ricerca e azione primaria nella topbar, rimozione
  dell'intestazione ora ridondante nel corpo di ogni pagina.

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
- Contatore opzionale a destra della voce, per sezioni con elementi in
  sospeso — pillola tonda con numero, sfondo `--admin-brick`. **Non
  popolato in questo passaggio**: vedi "Cosa NON è ancora stato
  fatto".
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
- Ricerca: prevista dove la pagina ha una lista. **Non ancora
  collegata a nessuna pagina** in questo passaggio.
- Pulsanti azione: bordo/trasparente di default (secondario); pieno
  `--admin-brick` riservato a **una sola azione primaria per vista**
  — mai due pulsanti pieni rossi visibili insieme. **Non ancora
  collegati a nessuna pagina** in questo passaggio.

Titolo e sottotitolo sono ricavati dal percorso (`usePathname`), non
passati dalla pagina — coerente col fatto che questo passaggio non
tocca il contenuto di nessuna pagina. Ogni pagina mostra ancora la
propria intestazione in linea (invariata): la duplicazione visiva
temporanea (topbar + intestazione della pagina) è nota e attesa,
elencata sotto in "Cosa NON è ancora stato fatto".

## Tabelle/liste dense

Per i passaggi successivi, quando toccano le liste di ogni sezione
(piatti, eventi, prenotazioni):

- Righe con bordo hairline (`border-admin-line`), non card arrotondate
  con ombra — più adatto a liste lunghe scorse velocemente.
- Hover: leggero cambio di sfondo.
- Riga selezionata: tinta `--admin-brick-wash`.
- Sfondo della tabella/pannello: `--color-admin-surface` (bianco), non
  `--color-admin-canvas` — la superficie della lista si stacca dal
  fondo pagina.

## Badge di stato

Componente pronto: `src/components/admin/StatusBadge.tsx` — pillola
con pallino colorato + testo (mai solo un colore di sfondo pieno, per
chi non distingue i colori). Quattro toni: `verde`, `ambra`, `grigio`,
`brick`. **Non ancora usato da nessuna pagina**: `/gestione/prenotazioni`
oggi segnala lo stato con un colore di testo sul `<select>` di
cambio-stato, non con questa pillola — il passaggio dedicato a quella
pagina deciderà come e se sostituirlo, visto che lì lo stato è anche
un CONTROLLO (si cambia da un menu a tendina), non solo una lettura.

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

## Cosa NON è ancora stato fatto (voci aperte per i passaggi 2-6)

- **Ricerca in topbar**: prevista dalla specifica, nessuno slot
  collegato a una pagina — richiede filtrare i dati di quella pagina,
  che è logica di quella pagina.
- **Azione primaria in topbar**: idem — spostare qui il pulsante
  "+ Nuovo piatto"/"+ Aggiungi evento" che oggi vive nel corpo di
  ciascuna pagina è lavoro del passaggio dedicato a quella pagina.
- **Contatore sidebar**: capacità pronta in `SidebarNav.tsx`
  (`contatore?: number` per voce), nessun dato reale calcolato. Lo
  stato "prenotazioni da confermare" non esiste nell'attuale modello
  dati (`stato` è `confermata | cancellata | completata | no-show`,
  nessuno stato "in attesa" da contare) — non è stato inventato uno
  stato fittizio solo per riempire un numero.
- **Restyling tabelle/liste dense**: da applicare pagina per pagina
  (menu, eventi, prenotazioni).
- **Badge di stato al posto del `<select>` colorato** in
  `/gestione/prenotazioni`: da decidere nel passaggio dedicato.
- **Duplicazione temporanea del titolo di pagina**: la topbar mostra
  titolo/sottotitolo per percorso; ogni pagina mostra ANCORA la
  propria intestazione in linea (eyebrow "Gestione" + `<h1>`),
  invariata. Verrà rimossa quando quella pagina sarà toccata nel suo
  passaggio dedicato — fino ad allora le due convivono, visivamente
  ridondanti ma non rotte.
