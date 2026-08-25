import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "CONTATTI" — BOZZA, NON TESTO DEFINITIVO
// =============================================================
// Solo testo di raccordo: indirizzo, telefono, WhatsApp, orari e
// social NON stanno qui, arrivano dalla fonte unica
// (src/lib/contatti.ts) e dalla tabella orari. Se un dato di contatto
// dovesse comparire in questo file sarebbe un errore: significherebbe
// averlo duplicato.
//
// Il parcheggio è l'unica informazione richiesta dalla §16 che non
// esiste né nella specifica né nel database: resta un segnaposto
// esplicito, non un'invenzione plausibile.
// =============================================================

const it = {
  hero: {
    occhiello: "Contatti",
    titolo: "Via delle Ombrine 25, Fiumicino.",
    sottotitolo:
      "A pochi minuti dal porto e dall'aeroporto. Per un tavolo basta una telefonata; per una domanda veloce, WhatsApp.",
  },
  dove: {
    titolo: "Come arrivare",
    testo:
      "Siamo nel centro di Fiumicino, in una traversa a pochi passi dal lungomare. Se arrivi in auto, la mappa qui sotto apre le indicazioni direttamente sul telefono.",
  },
  // Segnaposto: nessun dato reale su parcheggio o accessibilità.
  parcheggio:
    "[DA CONFERMARE: informazioni sul parcheggio — posti riservati, parcheggio libero in zona, distanza a piedi. Da compilare con i dati reali del locale prima della pubblicazione]",
  quando: {
    titolo: "Quando siamo aperti",
    testo:
      "Gli orari qui sotto sono gli stessi che trovi in fondo a ogni pagina: si aggiornano da un unico punto, quindi non possono dire cose diverse.",
  },
  parlaci: {
    titolo: "Parlaci",
    testo:
      "Per prenotare, chiedere di un piatto o organizzare una serata: rispondiamo negli orari di apertura.",
  },
};

type CopyContatti = typeof it;

const en: CopyContatti = {
  hero: {
    occhiello: "Contact",
    titolo: "Via delle Ombrine 25, Fiumicino.",
    sottotitolo:
      "A few minutes from the harbour and the airport. A table takes a phone call; a quick question, WhatsApp.",
  },
  dove: {
    titolo: "Getting here",
    testo:
      "We're in the centre of Fiumicino, on a side street a short walk from the seafront. If you're driving, the map below opens directions straight on your phone.",
  },
  parcheggio:
    "[TO BE CONFIRMED: parking information — reserved spaces, free parking nearby, walking distance. To be filled in with the venue's real data before publication]",
  quando: {
    titolo: "When we're open",
    testo:
      "The hours below are the same ones at the foot of every page: they're updated from a single place, so they can't disagree with each other.",
  },
  parlaci: {
    titolo: "Talk to us",
    testo:
      "To book, ask about a dish or plan an evening: we answer during opening hours.",
  },
};

const COPY: Record<Locale, CopyContatti> = { it, en };

export function getCopyContatti(locale: Locale): CopyContatti {
  return COPY[locale];
}
