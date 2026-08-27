import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "LA CARNE"
// =============================================================
// Scritto sul posizionamento di progetto ("qualità, gusto e libertà
// senza compromessi") e sulla nicchia dichiarata: a Fiumicino il
// pesce domina, la carne è ciò che distingue Vizio ed è oggi
// sotto-comunicata. Questa pagina esiste per correggere quello.
//
// "nicchia" e "fuoco" sono testo definitivo: correzione editoriale
// che sostituisce la bozza precedente. Le altre sezioni di questo
// file (hero, icona, chiusura) restano bozza fino a una correzione
// separata — non toccate da questo intervento.
//
// Nessun dato tecnico è inventato qui: provenienza, razze e tempi di
// frollatura NON sono nella specifica né nel database, quindi restano
// in un blocco segnaposto esplicito (vedi "daConfermare") invece di
// essere riempiti a fantasia.
//
// I dettagli del piatto-icona non stanno in questo file: si leggono
// dal database (nome, descrizione, foto, badge reali), così la pagina
// non può divergere dal menu.
//
// Il testo lungo vive qui e non in contenuti_sito perché è "Strato 1
// — fisso" (§4): il CMS leggero resta per le stringhe della home.
// =============================================================

const it = {
  hero: {
    occhiello: "La carne",
    titolo: "Qui il mare è fuori dalla porta. Dentro, c'è la brace.",
    sottotitolo:
      "A Fiumicino si mangia pesce, ed è giusto così. Ma se stasera hai voglia d'altro, sei nel posto giusto.",
  },
  nicchia: {
    titolo: "Una scelta controcorrente",
    paragrafi: [
      "Lavoriamo la carne con la stessa cura che a Fiumicino si riserva al pesce. Dalla costata alla fiorentina, dal T-bone al Filetto alla Rossini: tagli importanti e piatti elaborati, la stessa attenzione dall'aperitivo al dopocena.",
    ],
  },
  icona: {
    occhiello: "Il piatto icona",
    titolo: "Filetto alla Rossini",
    testo:
      "Se dovessimo far assaggiare un solo piatto per spiegare chi siamo, sarebbe questo. Un classico che non si incontra quasi più: ricco senza essere pesante, scenografico senza essere finto.",
  },
  fuoco: {
    titolo: "Come la trattiamo",
    paragrafi: [
      "Cuociamo su pietra lavica, non su fiamma diretta. Il calore si distribuisce in modo uniforme: meno bruciature, la stessa qualità dal primo taglio della sera all'ultimo. L'aroma di griglia resta, solo più pulito: lascia parlare la carne invece di coprirla.",
      "Una cottura scelta per esaltare la carne, non per nasconderla.",
    ],
  },
  daConfermare:
    "[DA CONFERMARE: provenienza, razze e tempi di frollatura — da compilare con i dati reali del locale prima della pubblicazione]",
  chiusura: {
    titolo: "La griglia è accesa.",
    testo: "Il resto del menu è a un clic. Il tavolo, a una telefonata.",
  },
};

type CopyLaCarne = typeof it;

const en: CopyLaCarne = {
  hero: {
    occhiello: "The meat",
    titolo: "The sea is right outside. Inside, the embers are lit.",
    sottotitolo:
      "Fiumicino eats fish, and rightly so. But if tonight you want something else, you're in the right place.",
  },
  nicchia: {
    titolo: "Against the current",
    paragrafi: [
      "We work meat with the same care Fiumicino reserves for fish. From ribeye to Florentine, from T-bone to our Filetto alla Rossini: serious cuts and elaborate dishes, the same attention from aperitivo to late night.",
    ],
  },
  icona: {
    occhiello: "The signature dish",
    titolo: "Fillet Rossini",
    testo:
      "If we could serve one dish to explain who we are, this would be it. A classic you rarely meet any more: rich without being heavy, theatrical without being fake.",
  },
  fuoco: {
    titolo: "How we treat it",
    paragrafi: [
      "We cook on volcanic stone, not open flame. Heat spreads evenly: fewer burnt spots, the same quality from the first cut of the night to the last. The char-grilled aroma is still there, just cleaner, letting the meat speak for itself instead of covering it up.",
      "A cooking method chosen to bring out the meat, not to mask it.",
    ],
  },
  daConfermare:
    "[TO BE CONFIRMED: sourcing, breeds and ageing times — to be filled in with the venue's real data before publication]",
  chiusura: {
    titolo: "The grill is on.",
    testo: "The rest of the menu is one click away. A table, one call.",
  },
};

const COPY: Record<Locale, CopyLaCarne> = { it, en };

export function getCopyLaCarne(locale: Locale): CopyLaCarne {
  return COPY[locale];
}
