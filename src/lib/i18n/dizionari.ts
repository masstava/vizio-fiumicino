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
    scriviciWhatsapp: "Scrivici su WhatsApp",
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
  menu: {
    titoloPagina: "Il menu",
    descrizionePagina:
      "Carne alla brace, cucina di stagione, cocktail e cantina. I prezzi sono per porzione; alcune voci variano secondo il pescato e il taglio del giorno.",
    legendaTitolo: "Legenda allergeni",
    legendaNota:
      "I numeri accanto ai piatti corrispondono agli allergeni indicati qui sotto. Per intolleranze o allergie parlane con il personale di sala.",
  },
  whatsapp: {
    etichetta: "Domande sul menu?",
    etichettaAccessibile: "Scrivici su WhatsApp per domande sul menu",
    messaggio:
      "Ciao! Avrei una domanda sul menu di Vizio Bistrot.",
  },
  nonTrovata: {
    codice: "404",
    titolo: "Questa pagina non è nel menu.",
    testo:
      "Il collegamento che hai seguito non porta da nessuna parte, o la pagina è stata spostata. Il resto del locale è ancora tutto qui.",
    tornaHome: "Torna alla home",
    vaiAlMenu: "Vai al menu",
  },
  piatto: {
    chiudi: "Chiudi",
    apriDettaglio: (nome: string) => `Vedi i dettagli di ${nome}`,
    allergeni: "Allergeni",
    nessunaDescrizione: "Descrizione in arrivo.",
  },
  pagine: {
    laCarne: {
      titolo: "La carne",
      descrizione:
        "Brace accesa tutte le sere a Fiumicino: tagli alla griglia e il Filetto alla Rossini, in un territorio di pesce.",
    },
    cocktailBar: {
      titolo: "Cocktail & Bar",
      descrizione:
        "Bancone aperto dall'aperitivo al dopocena: signature della casa, classici eseguiti bene, analcolici veri.",
    },
    contatti: {
      titolo: "Contatti",
      descrizione:
        "Vizio Bistrot, Via delle Ombrine 25, Fiumicino (RM). Telefono, WhatsApp, orari e indicazioni stradali.",
    },
    experience: {
      titolo: "Experience & Eventi",
      descrizione:
        "Menu degustazione, serate a tema e cene private da Vizio Bistrot, a Fiumicino. Si organizza per telefono o WhatsApp.",
    },
  },
  paginaContatti: {
    mappaTitolo: "Mappa: Vizio Bistrot, Via delle Ombrine 25, Fiumicino",
    caricaMappa: "Carica la mappa",
    notaMappa:
      "La mappa è fornita da Google. Caricandola, Google riceve la tua richiesta e può impostare cookie sul tuo dispositivo.",
    indicazioni: "Ottieni indicazioni",
    parcheggio: "Parcheggio",
    telefono: "Telefono",
    whatsapp: "WhatsApp",
    seguici: "Seguici",
    apriSu: (rete: string) => `Apri il profilo ${rete} in una nuova scheda`,
  },
  // Etichetta del riquadro che segnala un testo ancora da approvare.
  // Deve restare visibile: serve proprio a non farlo pubblicare per
  // distrazione.
  bozza: {
    etichetta: "Nota di redazione — da confermare prima della pubblicazione",
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
    scriviciWhatsapp: "Message us on WhatsApp",
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
  menu: {
    titoloPagina: "The menu",
    descrizionePagina:
      "Meat over embers, seasonal cooking, cocktails and cellar. Prices are per portion; some items vary with the day's catch and cut.",
    legendaTitolo: "Allergen key",
    legendaNota:
      "The numbers next to each dish match the allergens listed below. For intolerances or allergies, please speak to a member of staff.",
  },
  whatsapp: {
    etichetta: "Questions about the menu?",
    etichettaAccessibile: "Message us on WhatsApp with questions about the menu",
    messaggio: "Hi! I have a question about the Vizio Bistrot menu.",
  },
  nonTrovata: {
    codice: "404",
    titolo: "This page isn't on the menu.",
    testo:
      "The link you followed doesn't lead anywhere, or the page has moved. The rest of the place is still right here.",
    tornaHome: "Back to the home page",
    vaiAlMenu: "Go to the menu",
  },
  piatto: {
    chiudi: "Close",
    apriDettaglio: (nome: string) => `See details for ${nome}`,
    allergeni: "Allergens",
    nessunaDescrizione: "Description coming soon.",
  },
  pagine: {
    laCarne: {
      titolo: "The meat",
      descrizione:
        "Embers lit every night in Fiumicino: cuts over the grill and the Fillet Rossini, in a town built on fish.",
    },
    cocktailBar: {
      titolo: "Cocktails & Bar",
      descrizione:
        "The bar is open from aperitivo to the last drink: house signatures, classics done properly, real alcohol-free drinks.",
    },
    contatti: {
      titolo: "Contact",
      descrizione:
        "Vizio Bistrot, Via delle Ombrine 25, Fiumicino (RM). Phone, WhatsApp, opening hours and directions.",
    },
    experience: {
      titolo: "Experiences & Events",
      descrizione:
        "Tasting menus, themed nights and private dinners at Vizio Bistrot, Fiumicino. Arranged by phone or WhatsApp.",
    },
  },
  paginaContatti: {
    mappaTitolo: "Map: Vizio Bistrot, Via delle Ombrine 25, Fiumicino",
    caricaMappa: "Load the map",
    notaMappa:
      "The map is provided by Google. Loading it means Google receives your request and may set cookies on your device.",
    indicazioni: "Get directions",
    parcheggio: "Parking",
    telefono: "Phone",
    whatsapp: "WhatsApp",
    seguici: "Follow us",
    apriSu: (rete: string) => `Open the ${rete} profile in a new tab`,
  },
  bozza: {
    etichetta: "Editorial note — to be confirmed before publication",
  },
};

const DIZIONARI: Record<Locale, Dizionario> = { it, en };

export function getDizionario(locale: Locale): Dizionario {
  return DIZIONARI[locale];
}

export type { Dizionario };
