# Marchio Vizio Bistrot

Vettoriali ufficiali forniti dal committente. **Preferire sempre l'SVG**:
scala senza perdita e pesa meno del PNG corrispondente. I PNG restano
per i contesti che non accettano SVG (react-pdf, apple-touch-icon,
anteprime social).

## Regola d'uso

Il logo con lettering compare **solo su fondi scuri**.

Il lettering oro (`#dfc98a`) su crema (`#f7f2e9`) dà un contrasto di
**1,46:1**: i due colori sono troppo vicini come luminosità e il
marchio risulta illeggibile. Su fondo scuro (`#0a0705`) sale a
**12,3:1**. Decisione del committente: le sezioni chiare non ospitano
il marchio, e non si ripiega sulla versione a lettering scuro.

| File | Dove si usa |
|---|---|
| `logo-completo.svg` | Header e footer (entrambi su tema scuro) |
| `fiamma-oro.svg` | Accenti decorativi su fondi scuri |
| `fiamma-bianca.svg` | Ricaduta dove l'oro non stacca abbastanza |
| `fiamma-scura.svg` | Solo come filigrana a bassa opacità sulle sezioni chiare, mai il logo con lettering |
| `favicon.svg` / `.png` | Icona browser e apple-touch-icon |

## `non-usati-nel-sito/`

Versione a lettering scuro e fiamma nera. Non impiegate nel sito per
la regola qui sopra: restano disponibili per stampa e usi futuri.

## Cosa non deve stare qui

Il sorgente Illustrator (`loghi_vizio.ai`) **non va messo in `public/`**:
tutto ciò che sta in questa cartella viene servito pubblicamente sul
web. Verificato assente.
