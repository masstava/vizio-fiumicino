# Font del sito

File ospitati nel repository al posto del download da Google a ogni
build (`next/font/google`): il build non deve dipendere da un servizio
esterno. Configurazione in `src/lib/fonts.ts`.

## Provenienza

Sono **gli stessi byte** che Google Fonts serviva al sito (scaricati da
`next/font/google` il 2026-10-06 con la configurazione di allora:
Fraunces 400/500 normale e corsivo, Inter 400/500/600), quindi
l'aspetto è identico per costruzione.

| Font | Versione | Assi nei file | Licenza |
|---|---|---|---|
| Fraunces | 1.000 `[b76b70a41]` | solo `wght` 100–900 (Google ha fissato `opsz`=14, `SOFT`=0, `WONK`=0) | SIL OFL 1.1, nessun Reserved Font Name — `fraunces/OFL.txt` |
| Inter | 4.001 `git-66647c0bb` | solo `wght` 100–900 (`opsz`=14 fissato) | SIL OFL 1.1, nessun Reserved Font Name — `inter/OFL.txt` |

Sono font **variabili** (un file per sottoinsieme e stile copre tutti i
pesi), in formato woff2, divisi per intervallo Unicode come li serve
Google: `latin` si precarica, gli altri si scaricano solo se una pagina
contiene quei caratteri. Gli intervalli esatti sono in `src/lib/fonts.ts`.

Attenzione: l'istanza predefinita di questi file è il peso 900. Per
questo il font di ripiego non usa `adjustFontFallback` (che misurerebbe
il file) ma metriche fisse in `app/globals.css`.

| File | Stile | Sottoinsieme | Pesi dichiarati | Peso file | SHA-256 |
|---|---|---|---|---|---|
| `fraunces/Fraunces-latin.woff2` | normal | latin | 400, 500 | 35.7 KB | `88e17be075f1be50…` |
| `fraunces/Fraunces-latin-ext.woff2` | normal | latin-ext | 400, 500 | 32.9 KB | `f1451edd6434085c…` |
| `fraunces/Fraunces-vietnamese.woff2` | normal | vietnamese | 400, 500 | 11.3 KB | `250cc2966c658fb6…` |
| `fraunces/Fraunces-Italic-latin.woff2` | italic | latin | 400, 500 | 44.6 KB | `c9745ee907c02cdd…` |
| `fraunces/Fraunces-Italic-latin-ext.woff2` | italic | latin-ext | 400, 500 | 39.6 KB | `7e701dc124492f7d…` |
| `fraunces/Fraunces-Italic-vietnamese.woff2` | italic | vietnamese | 400, 500 | 12.7 KB | `d24c3502a91415f2…` |
| `inter/Inter-cyrillic.woff2` | normal | cyrillic | 400, 500, 600 | 18.3 KB | `aebf2ab4a4ce6810…` |
| `inter/Inter-cyrillic-ext.woff2` | normal | cyrillic-ext | 400, 500, 600 | 25.2 KB | `fccca918fea40089…` |
| `inter/Inter-greek.woff2` | normal | greek | 400, 500, 600 | 18.6 KB | `46dd4cdca58c26ae…` |
| `inter/Inter-greek-ext.woff2` | normal | greek-ext | 400, 500, 600 | 11.0 KB | `a2e2c783ca6f9c20…` |
| `inter/Inter-latin.woff2` | normal | latin | 400, 500, 600 | 47.3 KB | `c940764593d0fe5d…` |
| `inter/Inter-latin-ext.woff2` | normal | latin-ext | 400, 500, 600 | 83.3 KB | `a28eb6d3ccb534ae…` |
| `inter/Inter-vietnamese.woff2` | normal | vietnamese | 400, 500, 600 | 10.0 KB | `8db00ff46c67b22c…` |

## Aggiornare un font

Non a mano: sostituire i file con quelli di una nuova versione cambia
le forme delle lettere e le metriche del ripiego. Se serve, si
riscaricano dallo stesso servizio (stessa richiesta: famiglia, pesi,
stili), si sostituiscono tutti i file del font insieme, si aggiornano
gli intervalli in `src/lib/fonts.ts` se cambiati, si ricalcolano le
metriche di ripiego e si fa un confronto visivo prima/dopo.
