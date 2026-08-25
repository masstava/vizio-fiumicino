import { TITOLARE } from "@/src/lib/legale";
import type { Informativa } from "./legale-tipi";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COOKIE POLICY — 8 sezioni (§14.4)
// =============================================================
// Gli elenchi di cookie NON sono presi da un modello: sono quelli
// che il sito imposta davvero, verificati navigando cinque pagine e
// leggendo cookie, localStorage e sessionStorage. Oggi il sito
// imposta UN cookie, e solo dopo che l'utente ha scelto.
//
// Dove una verifica non è possibile adesso — i cookie che GA4,
// TheFork o Brevo imposteranno una volta integrati — il testo lo
// dice invece di elencare nomi presi altrove. Un elenco plausibile
// ma non verificato è peggio di un'assenza dichiarata: sembra
// preciso e non lo è.
// =============================================================

const it: Informativa = {
  titolo: "Cookie Policy",
  sottotitolo:
    "Quali cookie e quali strumenti di memorizzazione usa questo sito, a cosa servono e come cambiare idea in qualsiasi momento.",
  aggiornata: (data) => `Ultimo aggiornamento: ${data}`,
  sezioni: [
    {
      titolo: "1. Cosa sono i cookie",
      blocchi: [
        {
          tipo: "p",
          testo:
            "I cookie sono piccoli file che un sito salva nel tuo browser. Servono a ricordare qualcosa fra una pagina e l'altra o fra una visita e l'altra. Accanto ai cookie esistono altri strumenti che funzionano allo stesso modo — localStorage e sessionStorage — e che la normativa tratta alla stessa maniera: qui li chiamiamo tutti «cookie» per semplicità.",
        },
        {
          tipo: "p",
          testo:
            "I cookie di «prima parte» li imposta questo sito. Quelli di «terza parte» li imposta un altro soggetto attraverso contenuti incorporati nelle nostre pagine — per esempio una mappa.",
        },
      ],
    },
    {
      titolo: "2. Le quattro categorie",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Solo la prima è sempre attiva, perché senza il sito non funziona. Le altre tre restano spente finché non le attivi tu.",
        },
        {
          tipo: "tabella",
          intestazioni: ["Categoria", "A cosa serve", "Base giuridica", "Durata"],
          righe: [
            {
              categoria: "Necessari",
              finalita:
                "Consegnare la pagina richiesta, ricordare la lingua e la tua scelta sui cookie, tenere il sito sicuro.",
              base: "Obbligo legale e legittimo interesse — non richiedono consenso",
              durata: "Fino a 12 mesi",
            },
            {
              categoria: "Funzionali",
              finalita:
                "Abilitare contenuti di terze parti che scegli di caricare, come la mappa nella pagina Contatti.",
              base: "Consenso",
              durata: "Definita dal fornitore del contenuto",
            },
            {
              categoria: "Statistiche",
              finalita:
                "Capire in forma aggregata quali pagine vengono lette e da dove arrivano le visite.",
              base: "Consenso",
              durata: "Da indicare quando lo strumento sarà attivo",
            },
            {
              categoria: "Marketing",
              finalita:
                "Misurare le campagne e mostrare annunci più pertinenti su piattaforme esterne.",
              base: "Consenso",
              durata: "Da indicare quando lo strumento sarà attivo",
            },
          ],
        },
      ],
    },
    {
      titolo: "3. Cosa imposta il sito, oggi",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Se navighi senza esprimere una scelta, il sito non salva nulla nel tuo browser: nessun cookie, nessun dato in localStorage. Il banner compare proprio perché nulla è ancora stato scritto.",
        },
        {
          tipo: "p",
          testo:
            "Quando scegli — qualunque cosa scegli, anche «Rifiuta tutti» — vengono salvate due voci, entrambe di prima parte e strettamente necessarie:",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "vizio-consent (cookie)",
              descrizione:
                "Copia compatta della tua scelta, leggibile dal server. Durata: 12 mesi. Non contiene dati che ti identificano: solo quali categorie hai attivato.",
            },
            {
              termine: "vizio-consent-v1 (localStorage)",
              descrizione:
                "La stessa scelta in forma estesa, con la data in cui l'hai espressa e quella di scadenza. Resta nel tuo browser e non viene inviata a nessuno.",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Senza queste due voci non potremmo ricordare la tua decisione, e dovremmo richiedertela a ogni pagina.",
        },
      ],
    },
    {
      titolo: "4. Cookie funzionali",
      blocchi: [
        {
          tipo: "p",
          testo:
            "La pagina Contatti include una mappa fornita da Google. La mappa NON viene caricata automaticamente: al suo posto trovi un riquadro con un pulsante, e finché non lo premi nessuna richiesta parte verso Google e nessun cookie di Google viene impostato.",
        },
        {
          tipo: "p",
          testo:
            "Se decidi di caricarla, Google riceve la tua richiesta e può impostare cookie propri, secondo la propria informativa. Nessun altro contenuto di terze parti è incorporato nel sito.",
        },
      ],
    },
    {
      titolo: "5. Cookie statistici e di marketing",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Nessuno strumento di misurazione o di marketing è attualmente attivo su questo sito. Le due categorie compaiono comunque nel pannello delle preferenze perché la scelta sia già tua quando verranno attivate.",
        },
        {
          tipo: "p",
          testo:
            "Il sito è predisposto con il Consent Mode di Google: lo stato di partenza è «negato» per tutte le finalità che richiedono consenso, e viene modificato solo dalla tua scelta. Quando la misurazione sarà attiva, i nomi e le durate dei relativi cookie saranno elencati qui.",
        },
      ],
    },
    {
      titolo: "6. Servizi di terze parti collegati",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Alcune funzioni si appoggiano a servizi esterni. Se e quali cookie ciascuno imposti va verificato al momento dell'integrazione: finché non è avvenuta, non elenchiamo nomi che non abbiamo potuto controllare.",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "TheFork",
              descrizione:
                "Prenotazione dei tavoli. Se prenoti tramite quel canale, si applica l'informativa di TheFork, che tratta i tuoi dati come titolare autonomo. Eventuali cookie propri: da verificare in fase di integrazione.",
            },
            {
              termine: "Brevo",
              descrizione:
                "Invio della newsletter, quando sarà attiva. Eventuali cookie propri: da verificare in fase di integrazione.",
            },
            {
              termine: "Google",
              descrizione:
                "Mappa della pagina Contatti (solo su tua richiesta) e, in futuro, misurazione delle visite.",
            },
          ],
        },
      ],
    },
    {
      titolo: "7. Come cambiare idea",
      blocchi: [
        {
          tipo: "p",
          testo:
            "La tua scelta si riapre in qualsiasi momento dal pulsante qui sotto, presente anche in fondo a ogni pagina. Revocare è facile quanto acconsentire: puoi disattivare categorie che avevi attivato, e la modifica ha effetto subito.",
        },
        { tipo: "gestisci-cookie" },
        {
          tipo: "p",
          testo:
            "Puoi anche gestire o cancellare i cookie dalle impostazioni del tuo browser. Se cancelli le nostre due voci, la scelta va perduta e il banner ricompare.",
        },
      ],
    },
    {
      titolo: "8. Quanto dura e come viene aggiornata",
      blocchi: [
        {
          tipo: "p",
          testo:
            "La tua scelta vale 12 mesi; alla scadenza il banner ricompare. Non la trattiamo come acquisita per sempre.",
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
    "Which cookies and browser storage this site uses, what they do, and how to change your mind at any time.",
  aggiornata: (data) => `Last updated: ${data}`,
  sezioni: [
    {
      titolo: "1. What cookies are",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Cookies are small files a site saves in your browser. They remember something between one page and the next, or between visits. Alongside cookies there are other tools that work the same way — localStorage and sessionStorage — and which the law treats the same: here we call them all «cookies» for simplicity.",
        },
        {
          tipo: "p",
          testo:
            "«First-party» cookies are set by this site. «Third-party» ones are set by someone else through content embedded in our pages — a map, for instance.",
        },
      ],
    },
    {
      titolo: "2. The four categories",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Only the first is always on, because without it the site doesn't work. The other three stay off until you turn them on.",
        },
        {
          tipo: "tabella",
          intestazioni: ["Category", "What it's for", "Legal basis", "Duration"],
          righe: [
            {
              categoria: "Necessary",
              finalita:
                "Delivering the page you asked for, remembering your language and your cookie choice, keeping the site secure.",
              base: "Legal obligation and legitimate interest — no consent required",
              durata: "Up to 12 months",
            },
            {
              categoria: "Functional",
              finalita:
                "Enabling third-party content you choose to load, such as the map on the Contact page.",
              base: "Consent",
              durata: "Set by the content provider",
            },
            {
              categoria: "Analytics",
              finalita:
                "Understanding, in aggregate, which pages get read and where visits come from.",
              base: "Consent",
              durata: "To be stated once the tool is active",
            },
            {
              categoria: "Marketing",
              finalita:
                "Measuring campaigns and showing more relevant ads on external platforms.",
              base: "Consent",
              durata: "To be stated once the tool is active",
            },
          ],
        },
      ],
    },
    {
      titolo: "3. What the site sets, today",
      blocchi: [
        {
          tipo: "p",
          testo:
            "If you browse without making a choice, the site saves nothing in your browser: no cookies, nothing in localStorage. The banner appears precisely because nothing has been written yet.",
        },
        {
          tipo: "p",
          testo:
            "When you choose — whatever you choose, including «Reject all» — two entries are saved, both first-party and strictly necessary:",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "vizio-consent (cookie)",
              descrizione:
                "A compact copy of your choice, readable by the server. Duration: 12 months. It contains nothing identifying you: only which categories you turned on.",
            },
            {
              termine: "vizio-consent-v1 (localStorage)",
              descrizione:
                "The same choice in full, with the date you made it and its expiry. It stays in your browser and is not sent to anyone.",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Without these two entries we couldn't remember your decision, and would have to ask again on every page.",
        },
      ],
    },
    {
      titolo: "4. Functional cookies",
      blocchi: [
        {
          tipo: "p",
          testo:
            "The Contact page includes a map provided by Google. The map is NOT loaded automatically: in its place you'll find a panel with a button, and until you press it no request goes to Google and no Google cookie is set.",
        },
        {
          tipo: "p",
          testo:
            "If you choose to load it, Google receives your request and may set its own cookies, under its own notice. No other third-party content is embedded in the site.",
        },
      ],
    },
    {
      titolo: "5. Analytics and marketing cookies",
      blocchi: [
        {
          tipo: "p",
          testo:
            "No measurement or marketing tool is currently active on this site. The two categories still appear in the preferences panel so that the choice is already yours when they are switched on.",
        },
        {
          tipo: "p",
          testo:
            "The site is set up with Google Consent Mode: the starting state is «denied» for every purpose requiring consent, and it changes only through your choice. Once measurement is active, the names and durations of the relevant cookies will be listed here.",
        },
      ],
    },
    {
      titolo: "6. Connected third-party services",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Some features rely on external services. Whether and which cookies each one sets has to be checked at integration time: until that happens, we don't list names we haven't been able to verify.",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "TheFork",
              descrizione:
                "Table bookings. If you book through that channel, TheFork's own notice applies and it processes your data as an independent controller. Any cookies of its own: to be verified at integration time.",
            },
            {
              termine: "Brevo",
              descrizione:
                "Newsletter delivery, once active. Any cookies of its own: to be verified at integration time.",
            },
            {
              termine: "Google",
              descrizione:
                "The map on the Contact page (only at your request) and, in future, visit measurement.",
            },
          ],
        },
      ],
    },
    {
      titolo: "7. Changing your mind",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Your choice reopens at any time from the button below, which is also at the foot of every page. Withdrawing is as easy as consenting: you can switch off categories you had switched on, and the change takes effect immediately.",
        },
        { tipo: "gestisci-cookie" },
        {
          tipo: "p",
          testo:
            "You can also manage or delete cookies from your browser settings. If you delete our two entries, the choice is lost and the banner reappears.",
        },
      ],
    },
    {
      titolo: "8. How long it lasts, and how it's updated",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Your choice lasts 12 months; when it expires the banner returns. We don't treat it as settled forever.",
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
