import type { Locale } from "./config";

// Stringhe fisse dell'interfaccia pubblica. Due lingue e poche
// decine di voci: un oggetto tipizzato basta e si legge in chiaro,
// senza portarsi dietro una libreria i18n con provider, namespace e
// caricamento asincrono. Il tipo Dizionario è derivato dall'italiano,
// quindi TypeScript segnala subito una chiave dimenticata in inglese.

const it = {
  nav: {
    menu: "Menu",
    carne: "La carne",
    cocktail: "Cocktail",
    contatti: "Contatti",
    principale: "Principale",
    apriMenu: "Apri il menu",
    chiudiMenu: "Chiudi il menu",
    home: "Vizio Bistrot — home",
  },
  cta: {
    prenota: "Prenota",
    prenotaTavolo: "Prenota un tavolo",
    menuCompleto: "Vedi il menu completo",
    lasciaRecensione: "Lascia una recensione",
    contattaci: "Contattaci",
    prenotaPosto: "Prenota il tuo posto",
    iscriviti: "Iscriviti",
  },
  sezioni: {
    cosaTrovi: "Cosa trovi da Vizio",
    inEvidenza: "In evidenza",
    cosaDicono: "Cosa dicono di noi",
    ilMenu: "Il menu",
    cocktailBar: "Cocktail & Bar",
    experience: "Experience & Eventi",
    newsletter: "Newsletter",
  },
  recensioni: {
    suCinque: "su 5",
    media: (totale: number) => `Media di ${totale} recensioni su Google`,
    mediaInline: (rating: string, totale: number) =>
      `${rating} su 5, media di ${totale} recensioni su Google`,
  },
  footer: {
    orari: "Orari",
    contatti: "Contatti",
    apertoOra: "Aperto ora",
    chiusoOra: "Chiuso ora",
    orariDaDefinire: "Orari da definire",
    chiuso: "chiuso",
  },
  giorni: [
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
    "Domenica",
  ],
  experience: {
    titoloGenerico: "Occasioni su misura",
    testoGenerico:
      "Menu degustazione, cene a tema, eventi privati: raccontaci cosa hai in mente e lo organizziamo insieme.",
  },
  newsletter: {
    titolo: "Resta aggiornato",
    testo:
      "Serate, novità del menu e appuntamenti: una mail ogni tanto, niente di più.",
    emailLabel: "Indirizzo email",
    emailPlaceholder: "La tua email",
  },
  lingua: {
    etichetta: "Lingua",
    it: "Italiano",
    en: "English",
    // Sigle mostrate nel selettore compatto
    itBreve: "IT",
    enBreve: "EN",
  },
  piatto: {
    chiudi: "Chiudi",
    apriDettaglio: (nome: string) => `Vedi i dettagli di ${nome}`,
    allergeni: "Allergeni",
    nessunaDescrizione: "Descrizione in arrivo.",
  },
};

// Niente "as const" sull'italiano: darebbe tipi letterali ("Prenota"
// invece di string) e l'inglese non potrebbe avere valori diversi.
// Così invece TypeScript controlla la FORMA — una chiave mancante o
// di troppo in inglese è un errore di compilazione.
type Dizionario = typeof it;

const en: Dizionario = {
  nav: {
    menu: "Menu",
    carne: "The meat",
    cocktail: "Cocktails",
    contatti: "Contact",
    principale: "Main",
    apriMenu: "Open menu",
    chiudiMenu: "Close menu",
    home: "Vizio Bistrot — home",
  },
  cta: {
    prenota: "Book",
    prenotaTavolo: "Book a table",
    menuCompleto: "See the full menu",
    lasciaRecensione: "Leave a review",
    contattaci: "Get in touch",
    prenotaPosto: "Reserve your seat",
    iscriviti: "Subscribe",
  },
  sezioni: {
    cosaTrovi: "What you'll find at Vizio",
    inEvidenza: "Highlights",
    cosaDicono: "What people say",
    ilMenu: "The menu",
    cocktailBar: "Cocktails & Bar",
    experience: "Experiences & Events",
    newsletter: "Newsletter",
  },
  recensioni: {
    suCinque: "out of 5",
    media: (totale: number) => `Average of ${totale} Google reviews`,
    mediaInline: (rating: string, totale: number) =>
      `${rating} out of 5, average of ${totale} Google reviews`,
  },
  footer: {
    orari: "Opening hours",
    contatti: "Contact",
    apertoOra: "Open now",
    chiusoOra: "Closed now",
    orariDaDefinire: "Opening hours to be confirmed",
    chiuso: "closed",
  },
  giorni: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  experience: {
    titoloGenerico: "Occasions made to measure",
    testoGenerico:
      "Tasting menus, themed dinners, private events: tell us what you have in mind and we'll put it together.",
  },
  newsletter: {
    titolo: "Stay in the loop",
    testo:
      "Evenings, new dishes and upcoming dates: an email now and then, nothing more.",
    emailLabel: "Email address",
    emailPlaceholder: "Your email",
  },
  lingua: {
    etichetta: "Language",
    it: "Italiano",
    en: "English",
    itBreve: "IT",
    enBreve: "EN",
  },
  piatto: {
    chiudi: "Close",
    apriDettaglio: (nome: string) => `See details for ${nome}`,
    allergeni: "Allergens",
    nessunaDescrizione: "Description coming soon.",
  },
};

const DIZIONARI: Record<Locale, Dizionario> = { it, en };

export function getDizionario(locale: Locale): Dizionario {
  return DIZIONARI[locale];
}

export type { Dizionario };
