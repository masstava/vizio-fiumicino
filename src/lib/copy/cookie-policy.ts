import { TITOLARE } from "@/src/lib/legale";
import type { Informativa } from "./legale-tipi";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COOKIE POLICY — 8 sezioni (§14.4)
// =============================================================
// Struttura, titoli e sotto-sezioni sono quelli della specifica.
//
// Gli elenchi di cookie NON vengono da un modello: sono quelli
// misurati navigando cinque pagine e leggendo cookie, localStorage e
// sessionStorage. Senza esprimere una scelta il sito non scrive
// nulla; dopo la scelta scrive le due voci elencate in §3.
//
// Dove la verifica non è possibile adesso — i cookie che GA4 o Brevo
// imposteranno una volta integrati — il testo lo dichiara invece di
// elencare nomi presi altrove: un elenco plausibile ma non verificato
// sembra preciso e non lo è.
//
// AGGIORNAMENTO 2026-08-26: rimossa la voce "TheFork — widget di
// prenotazione" (già dichiarata "non presente sul sito"). Il sistema
// di prenotazione nativo (§21) è ora completo: quel widget non verrà
// integrato, l'ipotesi è superata. Le sottosezioni di §4 successive
// sono state rinumerate.
//
// AGGIUNTA rispetto alla specifica, segnalata: §4.3 (già §4.4) sulla
// mappa di Google nella pagina Contatti. La specifica elenca come
// terze parti solo GA4, TheFork e Brevo, ma la mappa è l'UNICO
// contenuto di terza parte realmente presente sul sito oggi.
// Ometterla da una cookie policy sarebbe una lacuna sostanziale, non
// una differenza di struttura.
//
// I nomi delle categorie sono quelli del pannello del consenso, non
// quelli della specifica: §14.4 diceva "Analitici", il CMP già in
// linea dice "Statistiche". Un utente che prova a far combaciare
// l'informativa con gli interruttori deve trovare le stesse parole,
// quindi vince ciò che l'utente vede. In inglese entrambi dicevano
// già "Analytics".
// =============================================================

const it: Informativa = {
  titolo: "Cookie Policy",
  sottotitolo:
    "Quali cookie e quali strumenti di memorizzazione usa questo sito, a cosa servono, quanto durano e come cambiare idea in qualsiasi momento.",
  aggiornata: (data) => `Ultimo aggiornamento: ${data}`,
  sezioni: [
    {
      titolo: "1. Cosa sono i cookie",
      blocchi: [
        {
          tipo: "p",
          testo:
            "I cookie sono piccoli file di testo che un sito salva nel browser di chi lo visita. Servono a ricordare qualcosa fra una pagina e l'altra o fra una visita e l'altra.",
        },
        {
          tipo: "p",
          testo:
            "Accanto ai cookie esistono tecnologie analoghe — in particolare localStorage e sessionStorage — che memorizzano informazioni nello stesso modo. La normativa le tratta alla pari dei cookie, e alla pari le trattiamo qui.",
        },
        {
          tipo: "p",
          testo:
            "Si chiamano «di prima parte» quelli impostati da questo sito, «di terza parte» quelli impostati da altri soggetti attraverso contenuti incorporati nelle nostre pagine.",
        },
        {
          tipo: "p",
          testo:
            "La materia è regolata dall'articolo 122 del Codice in materia di protezione dei dati personali (D.lgs. 196/2003 e successive modifiche), dalla Direttiva 2002/58/CE (ePrivacy) e dalle Linee guida cookie e altri strumenti di tracciamento del Garante per la protezione dei dati personali del 10 giugno 2021.",
        },
      ],
    },
    {
      titolo: "2. Le quattro categorie",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Solo la prima categoria è sempre attiva, perché senza il sito non funziona. Le altre tre restano spente finché non le attivi tu, e puoi disattivarle in qualsiasi momento.",
        },
        {
          tipo: "tabella",
          intestazioni: ["Categoria", "A cosa serve", "Base giuridica", "Durata"],
          righe: [
            {
              categoria: "Necessari",
              finalita:
                "Consegnare la pagina richiesta, ricordare la lingua e la scelta espressa sui cookie, mantenere il sito sicuro.",
              base: "Non richiedono consenso (art. 122 Codice Privacy)",
              durata: "Fino a 12 mesi",
            },
            {
              categoria: "Funzionali",
              finalita:
                "Abilitare contenuti di terze parti che scegli di caricare, come la mappa nella pagina Contatti.",
              base: "Consenso (art. 6.1.a GDPR)",
              durata: "Definita dal fornitore del contenuto",
            },
            {
              categoria: "Statistiche",
              finalita:
                "Capire, in forma aggregata, quali pagine vengono lette e da dove arrivano le visite.",
              base: "Consenso, salvo strumenti anonimi (vedi §3)",
              durata: "Da indicare quando lo strumento sarà attivo",
            },
            {
              categoria: "Marketing",
              finalita:
                "Misurare le campagne e mostrare annunci più pertinenti su piattaforme esterne.",
              base: "Consenso (art. 6.1.a GDPR)",
              durata: "Da indicare quando lo strumento sarà attivo",
            },
          ],
        },
      ],
    },
    {
      titolo: "3. Cookie tecnici e analytics anonimi di prima parte",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Se navighi senza esprimere una scelta, il sito non salva nulla nel tuo browser: nessun cookie, nessun dato in localStorage. Il banner compare proprio perché nulla è ancora stato scritto.",
        },
        {
          tipo: "p",
          testo:
            "Quando scegli — qualunque cosa scegli, anche «Rifiuta tutti» — vengono salvate due voci, entrambe di prima parte e strettamente necessarie a ricordare la tua decisione:",
        },
        {
          tipo: "tabella-cookie",
          intestazioni: ["Nome", "Tipo", "Finalità", "Durata"],
          righe: [
            {
              nome: "vizio-consent-v1",
              tipo: "localStorage, prima parte",
              finalita:
                "La scelta in forma estesa, con la data in cui è stata espressa e quella di scadenza. Resta nel browser e non viene inviata a nessuno.",
              durata: "12 mesi",
            },
            {
              nome: "vizio-consent",
              tipo: "Cookie, prima parte",
              finalita:
                "Copia compatta della stessa scelta, leggibile dal server. Non contiene dati identificativi: solo quali categorie sono attive.",
              durata: "12 mesi",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Senza queste due voci non potremmo ricordare la tua decisione e dovremmo richiedertela a ogni pagina.",
        },
        {
          tipo: "p",
          testo:
            "È inoltre prevista una misurazione aggregata delle visite tramite Vercel Web Analytics, che non usa cookie e non conserva l'indirizzo IP in chiaro. Non essendoci accesso né archiviazione di informazioni sul tuo dispositivo, non rientra fra gli strumenti soggetti a consenso e non compare nel banner. Questa misurazione non è ancora attiva.",
        },
      ],
    },
    {
      titolo: "4. Cookie di terze parti",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Le terze parti impostano cookie propri, secondo le proprie informative, sulle quali non abbiamo controllo. Dove l'integrazione non è ancora avvenuta non elenchiamo nomi che non abbiamo potuto verificare.",
        },
      ],
      sottosezioni: [
        {
          titolo: "4.1 Google Analytics 4",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Se e quando verrà attivato, richiederà il tuo consenso alla categoria «Statistiche». Non è al momento integrato: il sito è predisposto con il Consent Mode di Google, il cui stato di partenza è «negato» per tutte le finalità che richiedono consenso. Nomi e durate dei relativi cookie saranno elencati qui una volta attivo.",
            },
          ],
        },
        {
          titolo: "4.2 Brevo — modulo newsletter",
          blocchi: [
            {
              tipo: "p",
              testo:
                "L'invio della newsletter sarà affidato a Brevo. Se il modulo di iscrizione imposti cookie tecnici propri è da verificare in fase di implementazione: al momento il modulo presente sul sito non è collegato ad alcun servizio.",
            },
          ],
        },
        {
          titolo: "4.3 Google Maps — mappa della pagina Contatti",
          blocchi: [
            {
              tipo: "p",
              testo:
                "È l'unico contenuto di terza parte effettivamente presente sul sito. La mappa NON viene caricata automaticamente: al suo posto trovi un riquadro con un pulsante, e finché non lo premi nessuna richiesta parte verso Google e nessun cookie di Google viene impostato.",
            },
            {
              tipo: "p",
              testo:
                "Se scegli di caricarla, Google riceve la tua richiesta e può impostare cookie propri secondo la propria informativa. Rientra nella categoria «Funzionali».",
            },
          ],
        },
      ],
    },
    {
      titolo: "5. Come gestire le preferenze",
      blocchi: [
        {
          tipo: "p",
          testo:
            "La tua scelta si riapre in qualsiasi momento dal pulsante «Gestisci cookie», presente in fondo a ogni pagina e qui sotto. Revocare è facile quanto acconsentire: puoi disattivare categorie che avevi attivato, e la modifica ha effetto subito.",
        },
        { tipo: "gestisci-cookie" },
      ],
    },
    {
      titolo: "6. Disabilitare i cookie dal browser",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Puoi bloccare o cancellare i cookie anche dalle impostazioni del browser, indipendentemente da questo sito. Tieni presente che, cancellando le nostre due voci, la scelta va perduta e il banner ricompare.",
        },
        {
          tipo: "collegamenti",
          voci: [
            {
              testo: "Google Chrome",
              href: "https://support.google.com/chrome/answer/95647",
              esterno: true,
            },
            {
              testo: "Mozilla Firefox",
              href: "https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer",
              esterno: true,
            },
            {
              testo: "Apple Safari",
              href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
              esterno: true,
            },
            {
              testo: "Microsoft Edge",
              href: "https://support.microsoft.com/help/4027947",
              esterno: true,
            },
          ],
        },
      ],
    },
    {
      titolo: "7. Titolare del trattamento",
      blocchi: [
        {
          tipo: "p",
          testo: `Il titolare del trattamento è ${TITOLARE.ragioneSociale}, ${TITOLARE.sedeLegale.completo}, partita IVA ${TITOLARE.partitaIva}. Recapiti e informazioni complete sui trattamenti sono nell'informativa sulla privacy.`,
        },
        {
          tipo: "collegamenti",
          voci: [{ testo: "Leggi l'informativa sulla privacy", href: "/privacy" }],
        },
      ],
    },
    {
      titolo: "8. Riferimenti normativi",
      blocchi: [
        {
          tipo: "elenco",
          voci: [
            "Regolamento (UE) 2016/679 (GDPR);",
            "Direttiva 2002/58/CE (ePrivacy), come modificata dalla Direttiva 2009/136/CE;",
            "D.lgs. 196/2003 (Codice in materia di protezione dei dati personali), in particolare l'articolo 122;",
            "Linee guida cookie e altri strumenti di tracciamento, Garante per la protezione dei dati personali, 10 giugno 2021;",
            "Linee guida 03/2022 dell'European Data Protection Board sui modelli ingannevoli (dark pattern) nelle interfacce delle piattaforme social.",
          ],
        },
        {
          tipo: "p",
          testo: `Se cambiano le finalità o gli strumenti, questa informativa viene aggiornata e — quando la modifica riguarda finalità che richiedono consenso — la scelta ti viene richiesta di nuovo invece di essere ereditata. Per domande su questo documento: ${TITOLARE.email}.`,
        },
      ],
    },
  ],
};

const en: Informativa = {
  titolo: "Cookie Policy",
  sottotitolo:
    "Which cookies and browser storage this site uses, what they do, how long they last and how to change your mind at any time.",
  aggiornata: (data) => `Last updated: ${data}`,
  sezioni: [
    {
      titolo: "1. What cookies are",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Cookies are small text files a site saves in the browser of whoever visits it. They remember something between one page and the next, or between visits.",
        },
        {
          tipo: "p",
          testo:
            "Alongside cookies there are similar technologies — localStorage and sessionStorage in particular — that store information the same way. The law treats them on a par with cookies, and so do we here.",
        },
        {
          tipo: "p",
          testo:
            "«First-party» cookies are set by this site; «third-party» ones are set by others through content embedded in our pages.",
        },
        {
          tipo: "p",
          testo:
            "The matter is governed by Article 122 of the Italian Personal Data Protection Code (Legislative Decree 196/2003 as amended), by Directive 2002/58/EC (ePrivacy), and by the Guidelines on cookies and other tracking tools issued by the Italian data protection authority on 10 June 2021.",
        },
      ],
    },
    {
      titolo: "2. The four categories",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Only the first category is always on, because without it the site doesn't work. The other three stay off until you turn them on, and you can turn them off again at any time.",
        },
        {
          tipo: "tabella",
          intestazioni: ["Category", "What it's for", "Legal basis", "Duration"],
          righe: [
            {
              categoria: "Necessary",
              finalita:
                "Delivering the page requested, remembering your language and your cookie choice, keeping the site secure.",
              base: "No consent required (Art. 122, Italian Privacy Code)",
              durata: "Up to 12 months",
            },
            {
              categoria: "Functional",
              finalita:
                "Enabling third-party content you choose to load, such as the map on the Contact page.",
              base: "Consent (Art. 6(1)(a) GDPR)",
              durata: "Set by the content provider",
            },
            {
              categoria: "Analytics",
              finalita:
                "Understanding, in aggregate, which pages get read and where visits come from.",
              base: "Consent, except for anonymous tools (see §3)",
              durata: "To be stated once the tool is active",
            },
            {
              categoria: "Marketing",
              finalita:
                "Measuring campaigns and showing more relevant ads on external platforms.",
              base: "Consent (Art. 6(1)(a) GDPR)",
              durata: "To be stated once the tool is active",
            },
          ],
        },
      ],
    },
    {
      titolo: "3. First-party technical cookies and anonymous analytics",
      blocchi: [
        {
          tipo: "p",
          testo:
            "If you browse without making a choice, the site saves nothing in your browser: no cookies, nothing in localStorage. The banner appears precisely because nothing has been written yet.",
        },
        {
          tipo: "p",
          testo:
            "When you choose — whatever you choose, including «Reject all» — two entries are saved, both first-party and strictly necessary to remember your decision:",
        },
        {
          tipo: "tabella-cookie",
          intestazioni: ["Name", "Type", "Purpose", "Duration"],
          righe: [
            {
              nome: "vizio-consent-v1",
              tipo: "localStorage, first party",
              finalita:
                "The choice in full, with the date it was made and its expiry. It stays in the browser and is not sent to anyone.",
              durata: "12 months",
            },
            {
              nome: "vizio-consent",
              tipo: "Cookie, first party",
              finalita:
                "A compact copy of the same choice, readable by the server. It holds nothing identifying: only which categories are on.",
              durata: "12 months",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Without these two entries we couldn't remember your decision and would have to ask again on every page.",
        },
        {
          tipo: "p",
          testo:
            "Aggregate measurement of visits through Vercel Web Analytics is also planned. It uses no cookies and does not retain IP addresses in clear. As it neither accesses nor stores information on your device, it does not fall among the tools requiring consent and does not appear in the banner. This measurement is not active yet.",
        },
      ],
    },
    {
      titolo: "4. Third-party cookies",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Third parties set their own cookies under their own notices, over which we have no control. Where integration has not yet happened, we don't list names we haven't been able to verify.",
        },
      ],
      sottosezioni: [
        {
          titolo: "4.1 Google Analytics 4",
          blocchi: [
            {
              tipo: "p",
              testo:
                "If and when it is switched on, it will require your consent to the «Analytics» category. It is not integrated at present: the site is set up with Google Consent Mode, whose starting state is «denied» for every purpose requiring consent. The names and durations of the relevant cookies will be listed here once it is active.",
            },
          ],
        },
        {
          titolo: "4.2 Brevo — newsletter form",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Newsletter delivery will be handled by Brevo. Whether the subscription form sets technical cookies of its own is to be verified at implementation time: the form currently on the site is not connected to any service.",
            },
          ],
        },
        {
          titolo: "4.3 Google Maps — the map on the Contact page",
          blocchi: [
            {
              tipo: "p",
              testo:
                "This is the only third-party content actually present on the site. The map is NOT loaded automatically: in its place you'll find a panel with a button, and until you press it no request goes to Google and no Google cookie is set.",
            },
            {
              tipo: "p",
              testo:
                "If you choose to load it, Google receives your request and may set its own cookies under its own notice. It falls under the «Functional» category.",
            },
          ],
        },
      ],
    },
    {
      titolo: "5. Managing your preferences",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Your choice reopens at any time from the «Manage cookies» button, at the foot of every page and below. Withdrawing is as easy as consenting: you can switch off categories you had switched on, and the change takes effect immediately.",
        },
        { tipo: "gestisci-cookie" },
      ],
    },
    {
      titolo: "6. Disabling cookies in your browser",
      blocchi: [
        {
          tipo: "p",
          testo:
            "You can also block or delete cookies from your browser settings, independently of this site. Bear in mind that deleting our two entries loses your choice and brings the banner back.",
        },
        {
          tipo: "collegamenti",
          voci: [
            {
              testo: "Google Chrome",
              href: "https://support.google.com/chrome/answer/95647",
              esterno: true,
            },
            {
              testo: "Mozilla Firefox",
              href: "https://support.mozilla.org/kb/cookies-information-websites-store-on-your-computer",
              esterno: true,
            },
            {
              testo: "Apple Safari",
              href: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac",
              esterno: true,
            },
            {
              testo: "Microsoft Edge",
              href: "https://support.microsoft.com/help/4027947",
              esterno: true,
            },
          ],
        },
      ],
    },
    {
      titolo: "7. Data controller",
      blocchi: [
        {
          tipo: "p",
          testo: `The data controller is ${TITOLARE.ragioneSociale}, ${TITOLARE.sedeLegale.completo}, VAT number ${TITOLARE.partitaIva}. Contact details and full information about processing are in the privacy notice.`,
        },
        {
          tipo: "collegamenti",
          voci: [{ testo: "Read the privacy notice", href: "/privacy" }],
        },
      ],
    },
    {
      titolo: "8. Legal references",
      blocchi: [
        {
          tipo: "elenco",
          voci: [
            "Regulation (EU) 2016/679 (GDPR);",
            "Directive 2002/58/EC (ePrivacy), as amended by Directive 2009/136/EC;",
            "Legislative Decree 196/2003 (Italian Personal Data Protection Code), in particular Article 122;",
            "Guidelines on cookies and other tracking tools, Italian data protection authority, 10 June 2021;",
            "Guidelines 03/2022 of the European Data Protection Board on deceptive design patterns in social media platform interfaces.",
          ],
        },
        {
          tipo: "p",
          testo: `If purposes or tools change, this notice is updated and — where the change concerns purposes requiring consent — you are asked again rather than having your choice carried over. Questions about this document: ${TITOLARE.email}.`,
        },
      ],
    },
  ],
};

const COPY: Record<Locale, Informativa> = { it, en };

export function getCookiePolicy(locale: Locale): Informativa {
  return COPY[locale];
}
