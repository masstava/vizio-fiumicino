# Dashboard Design System — /gestione

Riferimento per il linguaggio visivo della dashboard (`/gestione/*`):
densità, colori, pattern di interazione. Non è una specifica di
funzionalità — la logica di ogni pagina (form, validazioni, Server
Actions, RPC) vive nel proprio codice, non qui. Questo documento
descrive lo stato attuale e vale come riferimento per qualsiasi lavoro
futuro sulla dashboard: se una nuova pagina o un nuovo controllo deve
somigliare a qualcosa già in uso, la risposta è in una di queste
sezioni, non da riscoprire guardando lo screenshot di un'altra pagina.

Nato da un refactor in 6 passaggi da un prototipo visivo approvato dal
committente (non nel repo). La cronologia dei passaggi non è più
qui — quello che conta è cosa esiste adesso.

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
| `--color-admin-text-2` | `#6b6a64` | Testo secondario — etichette, meta, sottotitoli, testo muto in genere |
| `--color-admin-text-3` | `#6f6d66` | Riservato a casi che richiedono un grigio ancora più tenue di text-2 pur restando conformi (vedi nota contrasto) — di norma si usa text-2 |
| `--color-admin-brick` | alias di `--color-bordeaux` (`#8b1a1a`) | Azione primaria — STESSO rosso del sito pubblico, non un valore nuovo |
| `--color-admin-brick-wash` | `#fbeaea` | Sfondo tenue per stati/selezione legati al brick |
| `--color-admin-green` / `--color-admin-green-wash` | `#2f6b4f` / `#e7f3ec` | Badge di stato — "disponibile"/positivo |
| `--color-admin-amber` / `--color-admin-amber-wash` | `#8a5a12` / `#fbf0dd` | Badge di stato — "in attesa"/da controllare/scaduto |
| `--color-admin-gray` / `--color-admin-gray-wash` | `#6b6a64` / `#eeece8` | Badge di stato — "cancellato"/neutro |

**Testo sulla sidebar scura** (`--color-admin-ink`): non ha un token
proprio — si riusano `text-cream-text` (voce attiva) e
`text-muted-dark` (voce inattiva), gli stessi già in uso per le
sezioni scure del sito pubblico. Non introdurre token nuovi per un
caso già coperto dalla palette esistente.

**Nota contrasto `--color-admin-text-3`**: il grigio del prototipo
(`#9a9890`) misurava 2.75:1 su canvas e 2.89:1 su surface — sotto la
soglia di 4.5:1 per testo normale richiesta da `DEFINITION_OF_DONE.md`.
Corretto a `#6f6d66` (4.92:1 su canvas, 5.18:1 su surface), che risulta
quasi indistinguibile da `--color-admin-text-2` (`#6b6a64`, 5.16:1 su
canvas) — con un pavimento di 4.5:1 su uno sfondo già quasi bianco c'è
poco margine per un terzo livello di grigio davvero più tenue
mantenendo la conformità: è un limite reale della palette, non una
svista. Per questo **in pratica si usa quasi sempre text-2**: usare
text-3 solo se un giorno serve davvero un terzo livello (raro), e
riverificare il contrasto se lo sfondo dietro cambia (es. dentro
`--color-admin-brick-wash`) — non è garantito che il rapporto resti
sopra soglia su ogni possibile sfondo.

## Tipografia

Inter per tutta l'interfaccia della dashboard. Fraunces resta
riservato a un solo punto: il wordmark "Vizio" nell'intestazione della
sidebar (mobile e desktop) — non altrove, per non far sembrare la
dashboard il sito editoriale.

Ogni pagina interna a `/gestione/*` ha già i propri titoli in Inter
(niente `font-serif` sui propri `<h1>`). `AdminShell.tsx` applica
comunque `[&_.font-serif]:font-sans` al contenitore principale come
rete di sicurezza — se una futura pagina introducesse per errore un
`font-serif`, verrebbe comunque riportata a Inter senza bisogno di un
fix separato. La colonna di anteprima nell'editor piatti
(`DishForm.tsx`, "Anteprima menu") è l'unica eccezione voluta: riproduce
l'aspetto REALE del sito pubblico (che usa `font-serif` per i nomi dei
piatti), quindi lì il font resta quello del sito pubblico di proposito.

## Shell: sidebar e topbar

**Sidebar**: 232px da `md` in su, statica; sotto `md` diventa un
pannello a scomparsa. Sfondo `--color-admin-ink`. Intestazione:
wordmark "Vizio" (Fraunces) + "Gestione" (Inter, maiuscolo, piccolo)
sotto. Voci: icona (20×20, tratto, `currentColor`) + testo, mai icona
da sola — il testo resta il nome accessibile del link. Voce attiva:
barra di 3px sul lato sinistro, colore `--admin-brick`
(`border-l-[3px]`), testo e icona in `text-cream-text` — NON un
blocco di sfondo pieno: la voce attiva si riconosce dalla barra e dal
colore del testo, non da un riempimento.

Comportamento responsive sotto `md`: pannello a scomparsa, hamburger
che diventa X, overlay che chiude al tocco, Esc che chiude e
restituisce il focus, focus che entra nel pannello all'apertura,
nessun focus trap di proposito (`AdminShell.tsx`).

Contatore opzionale a destra di ogni voce — pillola tonda con numero,
sfondo `--admin-brick`, calcolato server-side in `layout.tsx` (una
`Promise.all`) e passato a `SidebarNav` via `AdminShell`:

| Voce | Contatore | Cosa conta |
|---|---|---|
| Menu | sì | Piatti con `disponibile = true` |
| Gestione sito | sì | Quanti dei 5 slot foto/video sono ancora vuoti (0-5) — segnala un'azione da fare |
| Orari | no | Pagina singola, un conteggio non avrebbe un referente reale |
| Eventi | sì | Eventi attivi non ancora passati (i ricorrenti, senza data, contano sempre) |
| Prenotazioni | sì | Prenotazioni di oggi, non cancellate |

**"Oggi" è sempre nel fuso di Roma** (`oggiEOraRoma()`, da
`src/lib/prenotazioni/disponibilita.ts`), mai la data UTC del server —
un contatore "di oggi" calcolato in UTC può cambiare giorno alcune ore
prima o dopo la mezzanotte reale. Questo è già stato sbagliato una
volta (contatore Eventi, corretto in un passaggio successivo): se una
futura voce ha bisogno di "oggi", usare questo stesso helper, non
`new Date()`.

**Topbar**: sopra il contenuto di ogni pagina, dentro `<main>`.
Titolo pagina 18px/600 in `--color-admin-text`, sottotitolo 12.5px in
`--color-admin-text-2`. Titolo e sottotitolo sono ricavati dal
percorso (`usePathname`, tabella `VOCI` in
`src/components/admin/AdminTopbar.tsx`), non passati dalla pagina: la
topbar non conosce il contenuto di una pagina in anticipo. Dove due
viste condividono un prefisso ma non il senso (es. lista piatti vs.
modifica/crea un piatto), la voce più specifica va PRIMA nella tabella
`VOCI` — il primo match vince.

Dove una pagina deve portare un proprio controllo nella topbar
(ricerca, azione primaria), lo fa con `TopbarSlot`
(`src/components/admin/TopbarSlot.tsx`): un portale verso un nodo
fisso (`#admin-topbar-slot`, reso da `AdminTopbar`) che lascia lo
stato del controllo esattamente dove la pagina lo possiede già,
spostando solo dove appare nel DOM. `order` sullo slot decide la
posizione orizzontale, indipendente da quale portale monta per primo
(due pagine/portali diversi non devono dipendere da chi monta prima).

| Sezione | Ricerca in topbar | Azione primaria in topbar |
|---|---|---|
| Menu | sì (nome piatto) | sì ("+ Nuovo piatto") |
| Orari | non pertinente (non è una lista) | non pertinente |
| Eventi | non pertinente (lista troppo corta) | sì ("+ Nuovo evento") |
| Prenotazioni | sì (nome/telefono) | non pertinente (una prenotazione la crea il cliente dal sito, non lo staff) |
| Gestione sito | non pertinente (due griglie di slot e un caricamento file, non una lista da cercare) | non pertinente (si salva dentro ogni scheda) |

Ogni pagina mostra titolo/sottotitolo SOLO dalla topbar — nessuna
pagina ha più un'intestazione propria duplicata nel corpo.

## Schede (tab)

Per una sezione con più viste equivalenti sotto lo stesso nome di
sidebar (oggi: "Gestione sito" — Home, Foto delle pagine, Testi).
Rotte vere (`/gestione/contenuti`, `/gestione/contenuti/foto`,
`/gestione/contenuti/testi`), non stato client: ogni scheda ha una
propria voce in `AdminTopbar`, l'URL resta condivisibile e il tasto
indietro del browser funziona come ci si aspetta. Striscia di schede
(`contenuti/_components/SchedeGestioneSito.tsx`) con indicatore a
bordo inferiore di 2px in `--admin-brick` sulla scheda attiva — stesso
principio della barra laterale della sidebar (un indicatore lineare,
non un riempimento). Riusare questo componente per qualunque altra
sezione che avrà bisogno delle stesse schede.

## Tabelle/liste dense

Per ogni lista di record (piatti, eventi, prenotazioni) e per i
pannelli-form a righe che seguono la stessa logica visiva (prospetto
settimanale orari, capienza per fascia, griglie di Gestione sito):

- Righe con bordo hairline (`divide-y divide-admin-line` sul
  contenitore), non card arrotondate con ombra — più adatto a liste
  lunghe scorse velocemente.
- Hover: leggero cambio di sfondo (`hover:bg-admin-canvas` sulla riga).
- Sfondo della tabella/pannello: `--color-admin-surface` (bianco), non
  `--color-admin-canvas` — la superficie della lista si stacca dal
  fondo pagina.
- Riga selezionata: tinta `--admin-brick-wash` — non usato oggi (nessuna
  lista attuale ha selezione multipla); da usare quando una lista
  introduce selezione.
- Il componente condiviso `DishRow` (usato anche dal sito pubblico) NON
  va toccato per esigenze di stile della dashboard: la resa
  hairline/hover vive nel contenitore admin attorno ad esso
  (`AdminDishRow`/`SortableDishRow`), mai nel componente condiviso —
  così il menu pubblico resta indipendente dalla dashboard.
- **Riga che apre un pannello di dettaglio** (usato in
  `/gestione/prenotazioni` e in Gestione sito → Home): la porzione
  cliccabile (nome/dettagli) è un `<button>`, il controllo di stato è
  un elemento FRATELLO fuori da quel bottone, mai annidato dentro — un
  controllo interattivo dentro un `<button>` è HTML non valido e
  produce comportamento indefinito.

## Pannello di dettaglio (slide-over)

Divulgazione non-modale a comparsa laterale, per ispezionare o
scegliere un record senza lasciare la pagina sottostante. Usato oggi
da `DettaglioPrenotazionePanel.tsx` (dettaglio prenotazione) e
`SelezionaPiattoPanel.tsx` (ricerca piatto in Gestione sito → Home).
Comportamento di riferimento, da riprodurre identico in ogni nuovo
pannello dello stesso tipo:

- **Non è un dialog modale**: overlay dietro il pannello che chiude al
  tocco, ma niente `aria-modal="true"` — la lista sottostante resta
  raggiungibile.
- **Esc chiude e restituisce il focus** a chi ha aperto il pannello.
  Il trigger va catturato con `document.activeElement` nel momento in
  cui si apre (non un ref fisso su un unico bottone): più righe/pulsanti
  diversi possono aprire lo stesso pannello.
- **Il focus entra nel pannello all'apertura** (primo elemento
  interattivo, tipicamente il pulsante di chiusura o il campo di
  ricerca).
- **Nessun focus trap di proposito**: Tab può uscire dal pannello.
- **Il contenuto resta visibile durante la chiusura**: se il pannello
  mostra dati di un record specifico, tenerne una copia in uno stato
  locale che si aggiorna solo quando il pannello è aperto (non
  smontare il contenuto nello stesso istante in cui parte l'animazione
  di chiusura — altrimenti si vede il pannello scivolare via vuoto).

Un bug reale è stato causato proprio da questo pattern (in
`SelezionaPiattoPanel.tsx`, dove mancava la cattura di
`document.activeElement` prima dell'apertura — il focus dopo la
chiusura cadeva su `<body>` invece che tornare al pulsante che aveva
aperto il pannello): usare `PrenotazioniListClient.tsx`
(`apriDettaglio`/`chiudiDettaglio`) come riferimento esatto per un
nuovo pannello, non reinventare la cattura del focus da zero.

Menu ed eventi usano ancora una pagina dedicata per modificare un
record (`/gestione/menu/[id]`, `/gestione/eventi/[id]`) invece di
questo pattern — un pattern diverso ma già esistente e funzionante,
non necessariamente da convertire.

## Badge di stato

Tre componenti distinti, stesso linguaggio visivo (pallino colorato +
testo, mai solo un colore di sfondo pieno — chi non distingue i colori
deve poter leggere lo stato dal testo). Tutti e tre condividono la
stessa mappa di colori (`TONI_STATUS`, esportata da
`src/components/admin/StatusBadge.tsx` — un solo posto dove i quattro
toni sono definiti, non una copia per componente):

- `StatusBadge.tsx` — di sola lettura. Quattro toni: `verde`, `ambra`,
  `grigio`, `brick`.
- `StatusToggle.tsx` — la stessa pillola dentro un
  `<button role="switch" aria-checked>`: dove lo stato è un CONTROLLO
  binario (due soli valori) su una riga di lista. In uso per
  "Disponibile"/"Esaurito" in `/gestione/menu` e "Attivo"/"Non attivo"
  in `/gestione/eventi` (entrambi `verde`/`grigio`).
- `StatusSelect.tsx` — stessa pillola, ma per uno stato con PIÙ di due
  valori: sotto, un `<select>` nativo invisibile (`opacity-0`, non
  `display:none` — resta nell'albero di accessibilità, cattura
  tastiera/screen reader) posizionato sopra la pillola decorativa. In
  uso per i 4 stati reali di `/gestione/prenotazioni` (confermata=
  verde, completata=grigio, no-show=ambra, cancellata=brick —
  mappatura in `prenotazioni/_components/stati.ts`).

Gli interruttori dentro un FORM (non una riga di lista) restano
`Switch` (`src/components/ui/Switch.tsx`, condiviso col sito
pubblico): "Chiuso" per giorno in `/gestione/orari`, "Stato" nel form
evento e nel form piatto — sono un campo da compilare insieme al
resto, non lo stato di sola-azione di una riga. Non convertirli a
`StatusToggle`: quel componente è pensato per l'azione isolata di una
riga di lista, non per un campo tra altri in un form.

## Pulsanti

- Secondario (default): bordo, sfondo trasparente.
- Primario: pieno `--admin-brick`, riservato a UNA sola azione per
  vista — mai due pulsanti pieni rossi visibili insieme.
- Il componente condiviso `src/components/ui/Button.tsx` (usato sia
  dal sito pubblico che dalla dashboard) rende già `variant="primary"`
  in bordeaux, che è esattamente `--admin-brick` (stesso valore
  riusato, non un colore nuovo): nessuna modifica necessaria a
  `Button.tsx` per una nuova pagina che segue questa regola.

## Cosa manca di proposito (non dimenticato)

Voci che una lettura superficiale potrebbe scambiare per lavoro
incompleto — non lo sono, sono scelte per l'assenza di un referente
reale nei dati o nell'interazione:

- **Selezione multipla / riga selezionata** (`--admin-brick-wash`):
  nessuna lista attuale la usa. Il token esiste ed è pronto per quando
  una lista introdurrà selezione multipla.
- **Badge di stato al posto del `<select>` colorato in
  `/gestione/prenotazioni`**: già fatto — vedi `StatusSelect.tsx`. Se
  in futuro un'altra sezione avesse uno stato a N valori interattivo
  su una riga di lista, `StatusSelect` è il componente da riusare, non
  da reinventare.
- **Pannello di dettaglio per menu/eventi**: non esiste, e non è un
  errore — quelle due sezioni usano pagine dedicate
  (`/gestione/menu/[id]`, `/gestione/eventi/[id]`), un pattern diverso
  ma pienamente funzionante. Convertirle al pattern slide-over
  richiederebbe una decisione esplicita (le pagine dedicate hanno più
  spazio per form lunghi — allergeni, badge, campi extra — di quanto
  ne abbia comodamente uno slide-over stretto), non va fatto per sola
  uniformità.

Se in futuro emerge un bisogno reale in una di queste aree, il
pattern/token è già pronto — non serve inventarlo, solo collegarlo.
