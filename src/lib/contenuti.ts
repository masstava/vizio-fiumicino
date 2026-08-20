// =============================================================
// Chiavi dei testi editabili della home (tabella contenuti_sito).
//
// Non è un CMS a blocchi: la struttura della home resta nel codice.
// Qui si dichiarano soltanto le singole stringhe modificabili, con:
//   - etichetta e aiuto in italiano leggibile per la dashboard
//     (la chiave tecnica non viene mai mostrata al ristoratore)
//   - il testo di fallback, che è esattamente quello oggi scritto
//     nei componenti: se il campo è vuoto la home usa questo, così
//     non resta mai uno spazio bianco.
//
// Aggiungere un testo editabile = aggiungere una voce qui. La pagina
// di gestione si aggiorna da sola, non va toccata.
// =============================================================

import { campoLocalizzato } from "./i18n/campi";
import type { Locale } from "./i18n/config";

export interface CampoContenuto {
  chiave: string;
  etichetta: string;
  aiuto?: string;
  /** Campo lungo → textarea invece di input. */
  lungo?: boolean;
  /** Usato quando il valore salvato è assente o vuoto. */
  fallback: string;
  /** Ricaduta inglese. Se manca si usa quella italiana. */
  fallbackEn?: string;
}

export interface GruppoContenuti {
  titolo: string;
  descrizione?: string;
  campi: CampoContenuto[];
}

export const GRUPPI_CONTENUTI: GruppoContenuti[] = [
  {
    titolo: "Apertura della home",
    descrizione:
      "La prima frase che si legge entrando sul sito, sopra il pulsante di prenotazione.",
    campi: [
      {
        chiave: "hero.headline",
        etichetta: "Titolo principale della home",
        aiuto: "Poche parole, è il testo più grande della pagina.",
        lungo: true,
        fallback:
          "Carne alla brace, cocktail d'autore, aperitivo fino a notte fonda.",
        fallbackEn:
          "Grilled meat, signature cocktails, aperitivo until late.",
      },
    ],
  },
  {
    titolo: "I tre punti di forza",
    descrizione:
      "I tre blocchi subito sotto l'apertura, che riassumono cosa si trova da Vizio.",
    campi: [
      {
        chiave: "pilastro1.titolo",
        etichetta: "Primo punto — titolo",
        fallback: "Carne alla brace",
        fallbackEn: "Grilled over embers",
      },
      {
        chiave: "pilastro1.testo",
        etichetta: "Primo punto — descrizione",
        lungo: true,
        fallback:
          "Tagli selezionati, cotture lente sulla brace, contorni all'altezza. La sostanza al centro del piatto.",
        fallbackEn:
          "Selected cuts, slow cooking over embers, sides that keep up. Substance at the centre of the plate.",
      },
      {
        chiave: "pilastro2.titolo",
        etichetta: "Secondo punto — titolo",
        fallback: "Cocktail d'autore",
        fallbackEn: "Signature cocktails",
      },
      {
        chiave: "pilastro2.testo",
        etichetta: "Secondo punto — descrizione",
        lungo: true,
        fallback:
          "Spritz classici, twist di casa, drink pensati per accompagnare ogni portata — o bastare da soli.",
        fallbackEn:
          "Classic spritzes, house twists, drinks made to go with any course — or to stand on their own.",
      },
      {
        chiave: "pilastro3.titolo",
        etichetta: "Terzo punto — titolo",
        fallback: "Da mezzogiorno a notte",
        fallbackEn: "From noon until late",
      },
      {
        chiave: "pilastro3.testo",
        etichetta: "Terzo punto — descrizione",
        lungo: true,
        fallback:
          "Aperitivo, cena, dopocena: lo stesso indirizzo cambia ritmo con l'orario, senza mai chiudere il servizio.",
        fallbackEn:
          "Aperitivo, dinner, after dinner: one address that changes pace with the hour, never closing the kitchen.",
      },
    ],
  },
  {
    titolo: "Recensione in vetrina",
    descrizione:
      "Una frase presa da una recensione vera, mostrata accanto al voto Google. Se lasci vuoto il testo, in home restano solo voto e numero di recensioni — mai una citazione inventata.",
    campi: [
      {
        chiave: "recensione.testo",
        etichetta: "Frase della recensione",
        aiuto:
          "Copiala da una recensione reale. Senza virgolette: le aggiunge il sito.",
        lungo: true,
        fallback: "",
      },
      {
        chiave: "recensione.autore",
        etichetta: "Chi l'ha scritta",
        aiuto: "Es. «Marco R.» — come compare su Google.",
        fallback: "",
      },
    ],
  },
];

export const CHIAVI_CONTENUTI = GRUPPI_CONTENUTI.flatMap((g) =>
  g.campi.map((c) => c.chiave),
);

const FALLBACK_BY_CHIAVE = new Map(
  GRUPPI_CONTENUTI.flatMap((g) => g.campi).map((c) => [
    c.chiave,
    { it: c.fallback, en: c.fallbackEn || c.fallback },
  ]),
);

export type ContenutiMap = Record<string, string>;

// Costruisce la mappa chiave → testo da usare in pagina: valore
// salvato se c'è ed è non vuoto, altrimenti il fallback dichiarato
// sopra. Le chiavi salvate che non esistono più nel codice vengono
// ignorate (nessun testo orfano finisce in pagina).
export function risolviContenuti(
  righe:
    | { chiave: string; valore: string | null; valore_en?: string | null }[]
    | null,
  locale: Locale = "it",
): ContenutiMap {
  // In inglese si usa valore_en; se è vuoto si ricade sull'italiano
  // salvato, e solo dopo sul testo scritto nel codice. Così una
  // traduzione mancante non lascia mai un buco in pagina.
  const salvati = new Map(
    (righe ?? []).map((r) => [
      r.chiave,
      campoLocalizzato(r.valore, r.valore_en, locale),
    ]),
  );

  const out: ContenutiMap = {};
  FALLBACK_BY_CHIAVE.forEach((fallback, chiave) => {
    out[chiave] = salvati.get(chiave) || fallback[locale];
  });
  return out;
}
