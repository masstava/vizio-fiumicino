import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "EXPERIENCE & EVENTI" — BOZZA, NON DEFINITIVO
// =============================================================
// Stesso registro editoriale delle altre pagine di Strato 1.
//
// Gli eventi NON stanno in questo file: arrivano dalla tabella
// eventi, gli stessi che si gestiscono in dashboard. Scriverne uno
// qui vorrebbe dire avere due posti da aggiornare e uno dei due
// sbagliato.
//
// Del menu degustazione non si dice quante portate abbia, quanto
// costi o quanto duri: nulla di tutto ciò è nella specifica o nel
// database. Resta un segnaposto esplicito.
//
// §8, blocco 7: eventi privati = solo un contatto. Nessun modulo,
// nessun flusso di prenotazione sala — e nessuna frase che lo lasci
// intendere ("compila il form", "verifica disponibilità").
// =============================================================

const it = {
  hero: {
    occhiello: "Experience & Eventi",
    titolo: "Certe sere meritano più di un tavolo.",
    sottotitolo:
      "Menu degustazione, serate a tema, cene private: stessa cucina, formato diverso.",
  },
  degustazione: {
    titolo: "Il menu degustazione",
    paragrafi: [
      "È il modo più diretto per capire come lavoriamo: scegliamo noi, tu ti siedi. Si passa dal bancone alla brace senza dover decidere niente.",
      "Si prenota per telefono, perché quasi sempre c'è qualcosa da concordare prima — allergie, intolleranze, una portata da togliere o da raddoppiare.",
    ],
  },
  degustazioneDaConfermare:
    "[DA CONFERMARE: numero di portate, prezzo a persona, durata indicativa, eventuale abbinamento bevande, preavviso richiesto. Da compilare con i dati reali del locale prima della pubblicazione]",
  eventi: {
    occhiello: "In programma",
    titolo: "Le prossime serate",
    testo:
      "Gli appuntamenti già in calendario. Quando la lista è vuota vuol dire che stiamo preparando i prossimi.",
    nessuno:
      "Al momento non ci sono serate in calendario. Chiamaci: capita spesso che qualcosa sia in preparazione prima di finire qui.",
  },
  privati: {
    titolo: "Eventi privati",
    paragrafi: [
      "Compleanni, cene di lavoro, gruppi: si organizzano parlandone, non compilando un modulo. Raccontaci quante persone siete, quando, e cosa hai in mente.",
      "Ti diciamo subito se quella sera è possibile e cosa possiamo fare.",
    ],
  },
};

type CopyExperience = typeof it;

const en: CopyExperience = {
  hero: {
    occhiello: "Experiences & Events",
    titolo: "Some evenings deserve more than a table.",
    sottotitolo:
      "Tasting menus, themed nights, private dinners: same kitchen, different format.",
  },
  degustazione: {
    titolo: "The tasting menu",
    paragrafi: [
      "It's the most direct way to see how we work: we choose, you sit down. It runs from the bar to the embers without you having to decide anything.",
      "It's booked by phone, because there's almost always something to agree on first — allergies, intolerances, a course to drop or to double.",
    ],
  },
  degustazioneDaConfermare:
    "[TO BE CONFIRMED: number of courses, price per person, approximate length, optional drinks pairing, notice required. To be filled in with the venue's real data before publication]",
  eventi: {
    occhiello: "Coming up",
    titolo: "The next evenings",
    testo:
      "What's already in the calendar. An empty list means we're putting the next ones together.",
    nessuno:
      "Nothing in the calendar right now. Give us a call: something is often in the works before it lands here.",
  },
  privati: {
    titolo: "Private events",
    paragrafi: [
      "Birthdays, work dinners, groups: these get arranged by talking, not by filling in a form. Tell us how many of you there are, when, and what you have in mind.",
      "We'll tell you straight away whether that evening works and what we can do.",
    ],
  },
};

const COPY: Record<Locale, CopyExperience> = { it, en };

export function getCopyExperience(locale: Locale): CopyExperience {
  return COPY[locale];
}
