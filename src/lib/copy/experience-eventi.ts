import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "EXPERIENCE & EVENTI"
// =============================================================
// Stesso registro editoriale delle altre pagine di Strato 1.
//
// Gli eventi NON stanno in questo file: arrivano dalla tabella
// eventi, gli stessi che si gestiscono in dashboard. Scriverne uno
// qui vorrebbe dire avere due posti da aggiornare e uno dei due
// sbagliato.
//
// "degustazione" è testo definitivo: corregge il posizionamento
// precedente, che presentava il menu degustazione come proposta "su
// richiesta" — non lo è. Nasce dalle stagioni e dalle occasioni
// pensate dallo chef (es. San Valentino); una richiesta per
// un'occasione propria resta possibile, ma è secondaria, non il
// messaggio principale. Il segnaposto su portate/prezzo/durata è
// stato rimosso, non solo confermato: la nuova impostazione non
// promette un prodotto fisso con quelle caratteristiche, quindi non
// serve più specificarle. Le altre sezioni di questo file (hero,
// eventi, privati) restano bozza fino a una correzione separata.
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
      "Il menu degustazione nasce dalle stagioni e dalle occasioni speciali: lo chef lo pensa per momenti come San Valentino, non come proposta fissa sempre uguale. Se hai un'occasione tua da festeggiare, scrivici: ne parliamo insieme e troviamo la strada giusta.",
    ],
  },
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
      "Our tasting menu follows the seasons and special occasions: the chef designs it for moments like Valentine's Day, not as a fixed offer that's always the same. If you have your own occasion to celebrate, get in touch: let's talk it through together.",
    ],
  },
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
