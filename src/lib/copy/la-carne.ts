import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "LA CARNE"
// =============================================================
// Scritto sul posizionamento di progetto ("qualità, gusto e libertà
// senza compromessi") e sulla nicchia dichiarata: a Fiumicino il
// pesce domina, la carne è ciò che distingue Vizio ed è oggi
// sotto-comunicata. Questa pagina esiste per correggere quello.
//
// L'intera pagina è ora testo definitivo: hero, nicchia, icona, fuoco
// e chiusura. Zero frammenti di bozza residui — l'unico dato ancora
// aperto è il blocco "daConfermare" qui sotto (provenienza/razze/
// frollatura), che è un dato di filiera non ancora fornito, non
// testo da scrivere.
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
    titolo: "La carne, secondo Vizio.",
    sottotitolo:
      "Tagli importanti, cotture su pietra lavica e piatti elaborati. Modi diversi di lavorarla, la stessa attenzione alla materia prima.",
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
      "Se dovessimo scegliere un solo piatto per raccontare il nostro modo di intendere la carne, sarebbe questo. Un grande classico che unisce materia prima, tecnica e cucina.",
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
    titolo: "Meat, the Vizio way.",
    sottotitolo:
      "Serious cuts, volcanic-stone grilling, elaborate dishes. Different ways of working it, the same attention to the raw ingredient.",
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
      "If we had to choose one dish to tell you how we think about meat, this would be it. A classic that brings together raw ingredient, technique and kitchen craft.",
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
    titolo: "The grill is lit.",
    testo: "The rest of the menu is a click away. The table, a phone call away.",
  },
};

const COPY: Record<Locale, CopyLaCarne> = { it, en };

export function getCopyLaCarne(locale: Locale): CopyLaCarne {
  return COPY[locale];
}
