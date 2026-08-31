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
    // Etichetta accorciata rispetto al titolo della pagina
    // ("Experience & Eventi"): in una barra a cinque voci il titolo
    // intero occupava quanto due voci normali.
    experience: "Experience",
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
      "Iscriviti alla newsletter: -10% sulla tua prima visita, senza spesa minima, più l'accesso in anteprima alle nostre serate a tema.",
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
      "Carne alla griglia, cucina di stagione, cocktail e cantina. I prezzi sono per porzione; alcune voci variano secondo il pescato e il taglio del giorno.",
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
        "Pietra lavica accesa tutte le sere a Fiumicino: tagli alla griglia e il Filetto alla Rossini, in un territorio di pesce.",
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
    privacy: {
      titolo: "Informativa sulla privacy",
      descrizione:
        "Come Nuova Ristorazione S.r.l. tratta i dati personali di chi visita vizio-fiumicino.it, ai sensi del Regolamento (UE) 2016/679.",
    },
    cookiePolicy: {
      titolo: "Cookie Policy",
      descrizione:
        "Quali cookie usa vizio-fiumicino.it, a cosa servono, quanto durano e come cambiare idea in qualsiasi momento.",
    },
  },
  consenso: {
    // Banner
    titolo: "Cookie e privacy",
    testo:
      "Usiamo cookie tecnici, necessari al funzionamento del sito. Con il tuo consenso ne usiamo anche altri per capire come viene usato il sito e per finalità di marketing. Puoi accettare, rifiutare o scegliere categoria per categoria.",
    accettaTutti: "Accetta tutti",
    rifiutaTutti: "Rifiuta tutti",
    personalizza: "Personalizza",
    etichettaBanner: "Informativa sui cookie",

    // Modale preferenze
    modaleTitolo: "Preferenze cookie",
    modaleTesto:
      "Scegli quali categorie attivare. I cookie necessari non si possono disattivare: senza, il sito non funziona. Le altre restano spente finché non le attivi tu.",
    salva: "Salva preferenze",
    chiudi: "Chiudi",
    chiudiSenzaSalvare:
      "Chiudendo questa finestra senza salvare non viene registrata alcuna scelta.",
    sempreAttivo: "Sempre attivo",

    // Riapertura dal footer
    gestisci: "Gestisci cookie",
    linkPrivacy: "Privacy",
    linkCookie: "Cookie Policy",

    categorie: {
      necessary: {
        nome: "Necessari",
        descrizione:
          "Fanno funzionare il sito: pagina richiesta, lingua scelta, sicurezza. Non ti identificano e non si possono disattivare.",
      },
      functional: {
        nome: "Funzionali",
        descrizione:
          "Ricordano preferenze e abilitano contenuti di terze parti, come la mappa nella pagina Contatti.",
      },
      analytics: {
        nome: "Statistiche",
        descrizione:
          "Ci dicono quali pagine vengono lette e da dove arrivano le visite, in forma aggregata. Servono a capire cosa migliorare.",
      },
      marketing: {
        nome: "Marketing",
        descrizione:
          "Permettono di misurare le campagne e di mostrare annunci più pertinenti sulle piattaforme esterne.",
      },
    },
  },
  paginaPrenota: {
    titolo: "Prenota un tavolo",
    descrizione:
      "Prenota un tavolo da Vizio Bistrot, a Fiumicino: scegli data e orario, ti confermiamo subito la disponibilità.",
    heroOcchiello: "Prenotazioni",
    heroTitolo: "Prenota un tavolo",
    heroSottotitolo:
      "Scegli data e orario: ti diciamo subito se c'è posto.",

    perEvento: (titolo: string) => `Stai prenotando per: ${titolo}`,

    campoNome: "Nome",
    campoTelefono: "Telefono",
    campoEmail: "Email",
    campoEmailNota: "Facoltativa: se la lasci, ti confermiamo anche per email.",
    campoData: "Data",
    campoFascia: "Orario",
    campoCoperti: "Numero di persone",
    campoNote: "Note o allergie",
    campoNotePlaceholder: "Intolleranze, allergie, richieste particolari…",

    fasciaScegliData: "Scegli prima una data",
    fasciaChiuso: "Chiuso questo giorno — scegli un'altra data",
    fasciaCaricamento: "Verifico la disponibilità…",
    fasciaNessunOrario: "Nessun orario disponibile per questa data",
    fasciaTuttoPieno: "Al completo per tutti gli orari di questa data — provane un'altra",
    fasciaPiena: "al completo",
    fasciaPostiResidui: (n: number) => `${n} ${n === 1 ? "posto" : "posti"} rimasti`,

    invia: "Invia la richiesta",
    inviando: "Invio in corso…",

    erroreCapienza: "Questo orario si è appena riempito. Scegline un altro.",
    erroreGenerico: "Qualcosa non ha funzionato. Riprova, o chiamaci.",
    erroreLimiteRichieste: "Troppi tentativi in poco tempo. Aspetta qualche minuto e riprova, o chiamaci.",

    confermaTitolo: "Prenotazione registrata",
    confermaTesto: "Ti aspettiamo. A breve arriva anche la conferma via email, se ci hai lasciato un indirizzo.",
    confermaRiferimento: "Riferimento",
    confermaRiepilogoTitolo: "Riepilogo",
    nuovaPrenotazione: "Fai un'altra prenotazione",
  },
  emailPrenotazione: {
    oggetto: (riferimento: string) => `Prenotazione confermata — rif. ${riferimento}`,
    saluto: (nome: string) => `Ciao ${nome},`,
    corpoIntro: "la tua prenotazione da Vizio Bistrot è confermata. Ecco il riepilogo:",
    labelData: "Data",
    labelFascia: "Orario",
    labelCoperti: "Persone",
    labelEvento: "Evento",
    labelRiferimento: "Riferimento",
    gestisciTesto: "Per modificare o cancellare la prenotazione:",
    gestisciLink: "Gestisci la prenotazione",
    firma: "A presto,",
  },
  emailCancellazione: {
    oggetto: (riferimento: string) => `Prenotazione cancellata — rif. ${riferimento}`,
    saluto: (nome: string) => `Ciao ${nome},`,
    corpo: "la tua prenotazione da Vizio Bistrot è stata cancellata dal nostro staff.",
    contattaci: "Se pensi sia un errore o hai domande, contattaci.",
    prenotaTesto: "Vuoi prenotare di nuovo?",
    prenotaLink: "Prenota un tavolo",
    firma: "A presto,",
  },
  paginaGestisci: {
    titolo: "Gestisci la tua prenotazione",
    descrizione: "Visualizza o cancella la tua prenotazione da Vizio Bistrot.",
    heroOcchiello: "Auto-gestione",
    heroTitolo: "La tua prenotazione",
    heroSottotitolo: "Qui puoi vedere i dettagli o cancellarla.",

    linkNonValidoTitolo: "Prenotazione non trovata",
    linkNonValidoTesto:
      "Questo link non è valido, o la prenotazione a cui si riferisce non esiste più.",

    labelAltreInformazioni: "Altre informazioni",

    chiudiDialogo: "Chiudi",
    cancellaBottone: "Cancella prenotazione",
    cancellaConfermaTitolo: "Cancellare la prenotazione?",
    cancellaConfermaTesto:
      "L'operazione non si può annullare. Se vuoi solo cambiare data, orario o numero di persone, cancella e prenota di nuovo da qui sotto.",
    cancellaConfermaBottone: "Sì, cancella",
    cancellaAnnullaBottone: "No, torna indietro",
    cancellandoInCorso: "Cancellazione in corso…",
    erroreCancellazione:
      "Non è stato possibile cancellare la prenotazione. Riprova, o contattaci.",

    stati: {
      cancellata: {
        titolo: "Prenotazione cancellata",
        testo: "La tua prenotazione è stata cancellata. Ti aspettiamo un'altra volta.",
      },
      completata: {
        titolo: "Prenotazione completata",
        testo: "Questa prenotazione risulta già conclusa. Grazie della visita!",
      },
      "no-show": {
        titolo: "Prenotazione non presentata",
        testo: "Questa prenotazione è stata segnata come non presentata.",
      },
    },

    riprenotaTesto: "Vuoi prenotare di nuovo o hai bisogno di cambiare qualcosa?",
    riprenotaLink: "Prenota un tavolo",
  },
  menuOperativo: {
    titoloPagina: "Menu",
    descrizionePagina:
      "Il menu di Vizio Bistrot da consultare al tavolo: piatti, prezzi e allergeni.",
    vaiA: "Vai alla sezione",
    consigliatoOra: "Ora",
    allergeni: "Allergeni",
    tornaSu: "Torna su",
    vuoto: "Il menu non è disponibile in questo momento. Chiedi al personale di sala.",
  },
  paginaContatti: {
    mappaTitolo: "Mappa: Vizio Bistrot, Via delle Ombrine 25, Fiumicino",
    caricaMappa: "Carica la mappa",
    mappaSempre:
      "Per caricarla senza doverlo chiedere ogni volta, attiva i cookie funzionali:",
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
    experience: "Experiences",
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
      "Sign up for our newsletter: -10% on your first visit, no minimum spend, plus early access to our themed evenings.",
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
      "Grilled meat, seasonal cooking, cocktails and cellar. Prices are per portion; some items vary with the day's catch and cut.",
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
        "Volcanic stone lit every night in Fiumicino: cuts over the grill and the Fillet Rossini, in a town built on fish.",
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
    privacy: {
      titolo: "Privacy notice",
      descrizione:
        "How Nuova Ristorazione S.r.l. handles the personal data of people visiting vizio-fiumicino.it, under Regulation (EU) 2016/679.",
    },
    cookiePolicy: {
      titolo: "Cookie Policy",
      descrizione:
        "Which cookies vizio-fiumicino.it uses, what they do, how long they last and how to change your mind at any time.",
    },
  },
  consenso: {
    titolo: "Cookies and privacy",
    testo:
      "We use technical cookies, needed for the site to work. With your consent we also use others to understand how the site is used and for marketing. You can accept, reject, or choose category by category.",
    accettaTutti: "Accept all",
    rifiutaTutti: "Reject all",
    personalizza: "Customise",
    etichettaBanner: "Cookie notice",

    modaleTitolo: "Cookie preferences",
    modaleTesto:
      "Choose which categories to turn on. Necessary cookies can't be switched off: without them the site doesn't work. The others stay off until you turn them on.",
    salva: "Save preferences",
    chiudi: "Close",
    chiudiSenzaSalvare:
      "Closing this window without saving records no choice at all.",
    sempreAttivo: "Always on",

    gestisci: "Manage cookies",
    linkPrivacy: "Privacy",
    linkCookie: "Cookie Policy",

    categorie: {
      necessary: {
        nome: "Necessary",
        descrizione:
          "They make the site work: the page you asked for, the language you chose, security. They don't identify you and can't be switched off.",
      },
      functional: {
        nome: "Functional",
        descrizione:
          "They remember preferences and enable third-party content, such as the map on the Contact page.",
      },
      analytics: {
        nome: "Analytics",
        descrizione:
          "They tell us which pages get read and where visits come from, in aggregate. They help us see what to improve.",
      },
      marketing: {
        nome: "Marketing",
        descrizione:
          "They let us measure campaigns and show more relevant ads on external platforms.",
      },
    },
  },
  paginaPrenota: {
    titolo: "Book a table",
    descrizione:
      "Book a table at Vizio Bistrot, Fiumicino: choose a date and time, we confirm availability straight away.",
    heroOcchiello: "Bookings",
    heroTitolo: "Book a table",
    heroSottotitolo: "Choose a date and time: we'll tell you right away if there's room.",

    perEvento: (titolo: string) => `You're booking for: ${titolo}`,

    campoNome: "Name",
    campoTelefono: "Phone",
    campoEmail: "Email",
    campoEmailNota: "Optional: if you leave it, we'll confirm by email too.",
    campoData: "Date",
    campoFascia: "Time",
    campoCoperti: "Number of people",
    campoNote: "Notes or allergies",
    campoNotePlaceholder: "Intolerances, allergies, special requests…",

    fasciaScegliData: "Choose a date first",
    fasciaChiuso: "Closed that day — choose another date",
    fasciaCaricamento: "Checking availability…",
    fasciaNessunOrario: "No time available for this date",
    fasciaTuttoPieno: "Fully booked for every time on this date — try another one",
    fasciaPiena: "full",
    fasciaPostiResidui: (n: number) => `${n} ${n === 1 ? "seat" : "seats"} left`,

    invia: "Send the request",
    inviando: "Sending…",

    erroreCapienza: "That time just filled up. Please choose another.",
    erroreGenerico: "Something didn't work. Please try again, or call us.",
    erroreLimiteRichieste: "Too many attempts in a short time. Wait a few minutes and try again, or call us.",

    confermaTitolo: "Booking confirmed",
    confermaTesto: "We'll be expecting you. A confirmation email is on its way too, if you left an address.",
    confermaRiferimento: "Reference",
    confermaRiepilogoTitolo: "Summary",
    nuovaPrenotazione: "Make another booking",
  },
  emailPrenotazione: {
    oggetto: (riferimento: string) => `Booking confirmed — ref. ${riferimento}`,
    saluto: (nome: string) => `Hi ${nome},`,
    corpoIntro: "your booking at Vizio Bistrot is confirmed. Here's the summary:",
    labelData: "Date",
    labelFascia: "Time",
    labelCoperti: "Guests",
    labelEvento: "Event",
    labelRiferimento: "Reference",
    gestisciTesto: "To change or cancel your booking:",
    gestisciLink: "Manage your booking",
    firma: "See you soon,",
  },
  emailCancellazione: {
    oggetto: (riferimento: string) => `Booking cancelled — ref. ${riferimento}`,
    saluto: (nome: string) => `Hi ${nome},`,
    corpo: "your booking at Vizio Bistrot has been cancelled by our staff.",
    contattaci: "If you think this is a mistake or have questions, get in touch.",
    prenotaTesto: "Want to book again?",
    prenotaLink: "Book a table",
    firma: "See you soon,",
  },
  paginaGestisci: {
    titolo: "Manage your booking",
    descrizione: "View or cancel your booking at Vizio Bistrot.",
    heroOcchiello: "Self-service",
    heroTitolo: "Your booking",
    heroSottotitolo: "See the details here, or cancel it.",

    linkNonValidoTitolo: "Booking not found",
    linkNonValidoTesto:
      "This link isn't valid, or the booking it points to no longer exists.",

    labelAltreInformazioni: "Other information",

    chiudiDialogo: "Close",
    cancellaBottone: "Cancel booking",
    cancellaConfermaTitolo: "Cancel this booking?",
    cancellaConfermaTesto:
      "This can't be undone. If you just want to change the date, time or party size, cancel and book again below.",
    cancellaConfermaBottone: "Yes, cancel it",
    cancellaAnnullaBottone: "No, go back",
    cancellandoInCorso: "Cancelling…",
    erroreCancellazione:
      "We couldn't cancel the booking. Try again, or get in touch.",

    stati: {
      cancellata: {
        titolo: "Booking cancelled",
        testo: "Your booking has been cancelled. We hope to see you another time.",
      },
      completata: {
        titolo: "Booking completed",
        testo: "This booking is already marked as completed. Thanks for visiting!",
      },
      "no-show": {
        titolo: "Booking marked as no-show",
        testo: "This booking has been marked as a no-show.",
      },
    },

    riprenotaTesto: "Want to book again, or need to change something?",
    riprenotaLink: "Book a table",
  },
  menuOperativo: {
    titoloPagina: "Menu",
    descrizionePagina:
      "The Vizio Bistrot menu to read at your table: dishes, prices and allergens.",
    vaiA: "Go to section",
    consigliatoOra: "Now",
    allergeni: "Allergens",
    tornaSu: "Back to top",
    vuoto: "The menu isn't available right now. Please ask a member of staff.",
  },
  paginaContatti: {
    mappaTitolo: "Map: Vizio Bistrot, Via delle Ombrine 25, Fiumicino",
    caricaMappa: "Load the map",
    mappaSempre:
      "To have it load without asking each time, turn on functional cookies:",
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
