import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "LA CARNE" — BOZZA, NON TESTO DEFINITIVO
// =============================================================
// Scritto sul posizionamento di progetto ("qualità, gusto e libertà
// senza compromessi") e sulla nicchia dichiarata: a Fiumicino il
// pesce domina, la carne è ciò che distingue Vizio ed è oggi
// sotto-comunicata. Questa pagina esiste per correggere quello.
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
      "Accendere una griglia a Fiumicino è una piccola eresia. Qui il pesce è tradizione, identità, abitudine: la carta di ogni locale comincia dal mare e quasi sempre finisce lì.",
      "Non lo facciamo per contrasto, ma per completare. C'è la sera del crudo e del vino bianco, e c'è la sera in cui vuoi il fuoco, il fumo, un taglio che si tiene con le mani. La prima, qui, la trovi ovunque. La seconda quasi da nessuna parte.",
      "Da Vizio la brace è accesa tutte le sere. Qualità, gusto e libertà senza compromessi: dall'aperitivo al dopocena, senza cambiare locale.",
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
      "Il fuoco è l'unico condimento obbligatorio. Sale, tempo e la mano di chi sta alla griglia: il resto lo fa il taglio.",
      "Quando un taglio passa dalla frollatura lo scriviamo sul menu, accanto al piatto. È un'informazione per chi ordina, non un vezzo da esibire.",
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
      "Lighting a grill in Fiumicino is a small heresy. Here fish is tradition, identity, habit: every menu in town starts with the sea and usually ends there.",
      "We don't do it out of contrast, but to complete the picture. There are evenings for raw fish and white wine, and evenings when you want fire, smoke, a cut you hold in your hands. The first kind you'll find anywhere here. The second, almost nowhere.",
      "At Vizio the embers are lit every night. Quality, flavour and freedom without compromise: from aperitivo to the last drink, without changing venue.",
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
      "Fire is the only compulsory seasoning. Salt, time and the hand at the grill: the cut does the rest.",
      "When a cut has been aged, we say so on the menu, next to the dish. It's information for whoever is ordering, not a badge to show off.",
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
