import { GARANTE, TITOLARE } from "@/src/lib/legale";
import type { Informativa } from "./legale-tipi";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// PRIVACY POLICY — 11 sezioni (§14.3)
// =============================================================
// A differenza del copy editoriale, qui la sostanza NON è bozza:
// titolare, basi giuridiche, categorie di dati e fornitori sono
// decisioni già prese. Quella che ho scritto io è la prosa che le
// esprime.
//
// Resta però contenuto legale: va riletto da chi ne risponde prima
// della pubblicazione. Un errore qui non è una questione di tono.
//
// Due scelte di merito, dichiarate perché sono verificabili:
//
//  - Si distingue fra trattamenti ATTIVI OGGI e trattamenti che
//    partiranno con funzioni non ancora costruite (newsletter,
//    prenotazioni). Un'informativa che descrive come in corso
//    qualcosa che non avviene è inesatta quanto una che tace.
//    Misurato: navigando il sito senza esprimere una scelta non
//    viene impostato alcun cookie e non viene scritto nulla nel
//    browser.
//
//  - Sui trasferimenti extra-UE non si afferma che un dato fornitore
//    aderisca a un dato meccanismo: si dice quale meccanismo si
//    applica e si rimanda alle sue condizioni. Affermarlo senza
//    poterlo verificare sarebbe una dichiarazione a vuoto.
// =============================================================

const it: Informativa = {
  titolo: "Informativa sulla privacy",
  sottotitolo:
    "Come trattiamo i dati personali di chi visita questo sito e di chi ci contatta, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679.",
  aggiornata: (data) => `Ultimo aggiornamento: ${data}`,
  sezioni: [
    {
      titolo: "1. Chi tratta i tuoi dati",
      blocchi: [
        {
          tipo: "p",
          testo: `Il titolare del trattamento è ${TITOLARE.ragioneSociale}, con sede legale in ${TITOLARE.sedeLegale.completo} e unità operativa in ${TITOLARE.unitaOperativa.completo}, partita IVA ${TITOLARE.partitaIva}.`,
        },
        {
          tipo: "p",
          testo: `Per qualunque questione riguardi i tuoi dati puoi scrivere a ${TITOLARE.email} oppure, via posta elettronica certificata, a ${TITOLARE.pec}.`,
        },
        {
          tipo: "p",
          testo:
            "Non è stato nominato un Responsabile della protezione dei dati (DPO): l'attività non rientra fra i casi in cui il Regolamento lo rende obbligatorio.",
        },
      ],
    },
    {
      titolo: "2. Quali dati raccogliamo",
      blocchi: [
        {
          tipo: "p",
          testo:
            "La semplice consultazione di questo sito non richiede di identificarsi. Finché non esprimi una scelta sui cookie e non ci contatti, non raccogliamo dati che ti riguardano.",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Dati di navigazione",
              descrizione:
                "I sistemi che fanno funzionare il sito registrano, per necessità tecnica, informazioni come indirizzo IP, tipo di browser e pagina richiesta. Servono a consegnarti la pagina e a mantenere il servizio sicuro; non li usiamo per identificarti.",
            },
            {
              termine: "Preferenze sui cookie",
              descrizione:
                "La scelta che esprimi nel banner viene conservata nel tuo browser per poterla rispettare alla visita successiva. È l'unico dato che il sito salva sul tuo dispositivo di propria iniziativa.",
            },
            {
              termine: "Dati di contatto",
              descrizione:
                "Se ci scrivi via email o WhatsApp, o se ci telefoni, trattiamo quello che ci comunichi: nome, recapito e il contenuto del messaggio.",
            },
            {
              termine: "Dati di prenotazione",
              descrizione:
                "Se prenoti un tavolo, trattiamo nome, recapito, data, orario e numero di persone, oltre a eventuali richieste particolari che scegli di comunicarci.",
            },
            {
              termine: "Indirizzo email per la newsletter",
              descrizione:
                "Se ti iscrivi alla newsletter trattiamo il tuo indirizzo email. Al momento il modulo presente sul sito non è collegato ad alcun servizio e non invia nulla: l'iscrizione sarà attiva quando lo comunicheremo qui.",
            },
            {
              termine: "Statistiche di utilizzo",
              descrizione:
                "Solo se acconsenti alla categoria «Statistiche», raccogliamo dati aggregati su quali pagine vengono lette e da dove arrivano le visite. Questa raccolta non è ancora attiva.",
            },
          ],
        },
      ],
    },
    {
      titolo: "3. Perché li trattiamo e su quale base giuridica",
      blocchi: [
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Far funzionare il sito e tenerlo sicuro",
              descrizione:
                "Legittimo interesse (art. 6.1.f): consegnare le pagine richieste, prevenire abusi e malfunzionamenti. È l'interesse minimo senza il quale il servizio non esiste.",
            },
            {
              termine: "Ricordare la tua scelta sui cookie",
              descrizione:
                "Obbligo legale (art. 6.1.c): conservare la preferenza è ciò che ci permette di rispettarla, ed è richiesto dalla normativa sui cookie.",
            },
            {
              termine: "Rispondere a chi ci contatta",
              descrizione:
                "Misure precontrattuali o esecuzione di un contratto (art. 6.1.b) quando la richiesta riguarda una prenotazione; legittimo interesse (art. 6.1.f) quando è una domanda generica.",
            },
            {
              termine: "Gestire le prenotazioni",
              descrizione:
                "Esecuzione di un contratto (art. 6.1.b): senza quei dati il tavolo non può essere tenuto.",
            },
            {
              termine: "Inviare la newsletter",
              descrizione:
                "Consenso (art. 6.1.a), che puoi revocare in qualsiasi momento con il link di disiscrizione presente in ogni email.",
            },
            {
              termine: "Misurare l'utilizzo del sito",
              descrizione:
                "Consenso (art. 6.1.a), espresso attivando la categoria «Statistiche». Senza, nessuna misurazione viene attivata.",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Il conferimento dei dati è sempre facoltativo, ma senza i dati necessari a una prenotazione o a una risposta non possiamo darti seguito.",
        },
      ],
    },
    {
      titolo: "4. Cookie e tecnologie simili",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Il sito usa cookie e strumenti di memorizzazione nel browser. Quali siano, a cosa servano e quanto durino è spiegato in dettaglio nella Cookie Policy, che è parte integrante di questa informativa.",
        },
        {
          tipo: "p",
          testo:
            "Puoi cambiare idea in qualsiasi momento: la tua scelta si riapre dal pulsante qui sotto e dal collegamento presente in fondo a ogni pagina.",
        },
        { tipo: "gestisci-cookie" },
      ],
    },
    {
      titolo: "5. Chi altro può trattare i tuoi dati",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Non vendiamo e non cediamo dati personali. Alcuni fornitori li trattano per nostro conto, come responsabili del trattamento, sulla base di un contratto che ne limita l'uso a quanto serve al servizio.",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Vercel Inc.",
              descrizione:
                "Hosting del sito. Tratta i dati di navigazione necessari a consegnare le pagine.",
            },
            {
              termine: "Supabase Inc.",
              descrizione:
                "Banca dati dei contenuti del sito (menu, orari, eventi). I dati risiedono nella regione dell'Unione europea (Francoforte).",
            },
            {
              termine: "Brevo SAS",
              descrizione:
                "Invio della newsletter, quando la funzione sarà attiva. Sede in Francia.",
            },
            {
              termine: "Resend",
              descrizione:
                "Invio delle email di servizio legate alle prenotazioni, quando la funzione sarà attiva.",
            },
            {
              termine: "Google LLC",
              descrizione:
                "Statistiche di utilizzo e mappa della pagina Contatti, solo previo tuo consenso. La mappa non viene caricata finché non la richiedi esplicitamente.",
            },
            {
              termine: "TheFork",
              descrizione:
                "Piattaforma di prenotazione. Se prenoti tramite TheFork, quella società tratta i tuoi dati come titolare autonomo, secondo la propria informativa, sulla quale non abbiamo controllo.",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "I dati possono inoltre essere comunicati a professionisti e autorità quando la legge lo impone.",
        },
      ],
    },
    {
      titolo: "6. Trasferimenti fuori dall'Unione europea",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Alcuni fornitori hanno sede negli Stati Uniti. La banca dati del sito è configurata sulla regione europea (Francoforte), ma non si può escludere che l'assistenza tecnica del fornitore vi acceda dall'estero.",
        },
        {
          tipo: "p",
          testo:
            "Quando un trasferimento avviene verso un Paese terzo, esso è coperto dalle garanzie previste dal Capo V del Regolamento: decisione di adeguatezza della Commissione europea, oppure clausole contrattuali tipo. Le condizioni applicabili a ciascun fornitore sono indicate nella documentazione del fornitore stesso; su richiesta ti indichiamo quale meccanismo si applica.",
        },
      ],
    },
    {
      titolo: "7. Per quanto tempo li conserviamo",
      blocchi: [
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Preferenze sui cookie",
              descrizione:
                "12 mesi dalla scelta, dopodiché la richiesta viene riproposta.",
            },
            {
              termine: "Messaggi e richieste",
              descrizione:
                "Il tempo necessario a rispondere e a gestire quanto ne consegue; poi vengono cancellati, salvo quanto la legge imponga di conservare.",
            },
            {
              termine: "Dati di prenotazione",
              descrizione:
                "Il tempo necessario alla gestione della prenotazione e agli obblighi amministrativi e fiscali che ne derivano.",
            },
            {
              termine: "Iscrizione alla newsletter",
              descrizione: "Fino alla disiscrizione.",
            },
            {
              termine: "Statistiche",
              descrizione:
                "Secondo la conservazione impostata sullo strumento di misurazione, che indicheremo nella Cookie Policy quando sarà attivo.",
            },
          ],
        },
      ],
    },
    {
      titolo: "8. I tuoi diritti",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Il Regolamento ti riconosce una serie di diritti che puoi esercitare in qualsiasi momento e gratuitamente:",
        },
        {
          tipo: "elenco",
          voci: [
            "sapere se trattiamo dati che ti riguardano e ottenerne copia (accesso, art. 15);",
            "far correggere dati inesatti o incompleti (rettifica, art. 16);",
            "chiederne la cancellazione, nei casi previsti (art. 17);",
            "chiedere che il trattamento sia limitato (art. 18);",
            "ricevere i dati in un formato leggibile da una macchina, o farli trasferire ad altro titolare (portabilità, art. 20);",
            "opporti al trattamento fondato sul legittimo interesse (art. 21);",
            "revocare il consenso in qualsiasi momento, senza che ciò tolga validità a quanto fatto prima (art. 7.3).",
          ],
        },
        {
          tipo: "p",
          testo: `Per esercitarli scrivi a ${TITOLARE.email}. Rispondiamo entro un mese; se la richiesta è complessa il termine può essere prorogato, e in quel caso te lo diciamo.`,
        },
      ],
    },
    {
      titolo: "9. Se ritieni che qualcosa non vada",
      blocchi: [
        {
          tipo: "p",
          testo: `Puoi rivolgerti a noi in qualsiasi momento. Se non sei soddisfatto della risposta, hai diritto di proporre reclamo al ${GARANTE.nome} (${GARANTE.sito}) o all'autorità di controllo dello Stato membro in cui risiedi o lavori.`,
        },
      ],
    },
    {
      titolo: "10. Minori",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Questo sito non è rivolto a minori di quattordici anni e non raccoglie consapevolmente i loro dati. Se ritieni che un minore ci abbia comunicato dati personali, scrivici: li cancelleremo.",
        },
      ],
    },
    {
      titolo: "11. Modifiche a questa informativa",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Possiamo aggiornare questa informativa quando cambiano i trattamenti, gli strumenti o la normativa. La data in cima indica l'ultimo aggiornamento; se le modifiche riguardano finalità per le quali serve il tuo consenso, te lo chiederemo di nuovo invece di darlo per acquisito.",
        },
      ],
    },
  ],
};

const en: Informativa = {
  titolo: "Privacy notice",
  sottotitolo:
    "How we handle the personal data of people who visit this site and get in touch, under Articles 13 and 14 of Regulation (EU) 2016/679.",
  aggiornata: (data) => `Last updated: ${data}`,
  sezioni: [
    {
      titolo: "1. Who processes your data",
      blocchi: [
        {
          tipo: "p",
          testo: `The data controller is ${TITOLARE.ragioneSociale}, registered office at ${TITOLARE.sedeLegale.completo}, operating premises at ${TITOLARE.unitaOperativa.completo}, VAT number ${TITOLARE.partitaIva}.`,
        },
        {
          tipo: "p",
          testo: `For anything concerning your data you can write to ${TITOLARE.email} or, by certified email, to ${TITOLARE.pec}.`,
        },
        {
          tipo: "p",
          testo:
            "No Data Protection Officer has been appointed: the business does not fall within the cases in which the Regulation makes one mandatory.",
        },
      ],
    },
    {
      titolo: "2. What data we collect",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Simply browsing this site does not require you to identify yourself. Until you make a choice about cookies and get in touch with us, we collect no data about you.",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Browsing data",
              descrizione:
                "The systems that run the site record, out of technical necessity, information such as IP address, browser type and the page requested. They serve to deliver the page and keep the service secure; we don't use them to identify you.",
            },
            {
              termine: "Cookie preferences",
              descrizione:
                "The choice you make in the banner is kept in your browser so we can honour it on your next visit. It's the only thing the site stores on your device of its own accord.",
            },
            {
              termine: "Contact details",
              descrizione:
                "If you write to us by email or WhatsApp, or call us, we process what you tell us: name, contact details and the content of your message.",
            },
            {
              termine: "Booking data",
              descrizione:
                "If you book a table, we process name, contact details, date, time and number of people, along with any particular requests you choose to share.",
            },
            {
              termine: "Newsletter email address",
              descrizione:
                "If you subscribe to the newsletter we process your email address. At present the form on the site is not connected to any service and sends nothing: subscription will be active when we say so here.",
            },
            {
              termine: "Usage statistics",
              descrizione:
                "Only if you consent to the «Analytics» category do we collect aggregate data on which pages get read and where visits come from. This collection is not active yet.",
            },
          ],
        },
      ],
    },
    {
      titolo: "3. Why we process it, and on what legal basis",
      blocchi: [
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Running the site and keeping it secure",
              descrizione:
                "Legitimate interest (Art. 6(1)(f)): delivering the pages you ask for, preventing abuse and malfunction. It's the minimum interest without which the service doesn't exist.",
            },
            {
              termine: "Remembering your cookie choice",
              descrizione:
                "Legal obligation (Art. 6(1)(c)): storing the preference is what lets us honour it, and the cookie rules require it.",
            },
            {
              termine: "Replying to people who contact us",
              descrizione:
                "Pre-contractual steps or performance of a contract (Art. 6(1)(b)) where the request concerns a booking; legitimate interest (Art. 6(1)(f)) where it's a general question.",
            },
            {
              termine: "Managing bookings",
              descrizione:
                "Performance of a contract (Art. 6(1)(b)): without that data the table can't be held.",
            },
            {
              termine: "Sending the newsletter",
              descrizione:
                "Consent (Art. 6(1)(a)), which you can withdraw at any time using the unsubscribe link in every email.",
            },
            {
              termine: "Measuring site usage",
              descrizione:
                "Consent (Art. 6(1)(a)), given by turning on the «Analytics» category. Without it, no measurement is activated.",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Providing your data is always optional, but without the data needed for a booking or a reply we can't follow up.",
        },
      ],
    },
    {
      titolo: "4. Cookies and similar technologies",
      blocchi: [
        {
          tipo: "p",
          testo:
            "The site uses cookies and browser storage. What they are, what they do and how long they last is set out in detail in the Cookie Policy, which forms part of this notice.",
        },
        {
          tipo: "p",
          testo:
            "You can change your mind at any time: your choice reopens from the button below and from the link at the foot of every page.",
        },
        { tipo: "gestisci-cookie" },
      ],
    },
    {
      titolo: "5. Who else may process your data",
      blocchi: [
        {
          tipo: "p",
          testo:
            "We do not sell or trade personal data. Some suppliers process it on our behalf, as processors, under a contract limiting its use to what the service requires.",
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Vercel Inc.",
              descrizione:
                "Site hosting. Processes the browsing data needed to deliver pages.",
            },
            {
              termine: "Supabase Inc.",
              descrizione:
                "Database for the site's content (menu, opening hours, events). The data sits in the European Union region (Frankfurt).",
            },
            {
              termine: "Brevo SAS",
              descrizione:
                "Newsletter delivery, once the feature is live. Based in France.",
            },
            {
              termine: "Resend",
              descrizione:
                "Service emails relating to bookings, once the feature is live.",
            },
            {
              termine: "Google LLC",
              descrizione:
                "Usage statistics and the map on the Contact page, only with your consent. The map is not loaded until you explicitly ask for it.",
            },
            {
              termine: "TheFork",
              descrizione:
                "Booking platform. If you book through TheFork, that company processes your data as an independent controller under its own notice, over which we have no control.",
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Data may also be disclosed to professional advisers and authorities where the law requires it.",
        },
      ],
    },
    {
      titolo: "6. Transfers outside the European Union",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Some suppliers are based in the United States. The site's database is configured on the European region (Frankfurt), but access from abroad by the supplier's technical support cannot be ruled out.",
        },
        {
          tipo: "p",
          testo:
            "Where a transfer to a third country takes place, it is covered by the safeguards in Chapter V of the Regulation: an adequacy decision of the European Commission, or standard contractual clauses. The conditions applying to each supplier are set out in that supplier's own documentation; on request we'll tell you which mechanism applies.",
        },
      ],
    },
    {
      titolo: "7. How long we keep it",
      blocchi: [
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Cookie preferences",
              descrizione:
                "12 months from your choice, after which we ask again.",
            },
            {
              termine: "Messages and enquiries",
              descrizione:
                "As long as needed to reply and deal with what follows; then deleted, save for what the law requires us to keep.",
            },
            {
              termine: "Booking data",
              descrizione:
                "As long as needed to manage the booking and to meet the administrative and tax obligations arising from it.",
            },
            {
              termine: "Newsletter subscription",
              descrizione: "Until you unsubscribe.",
            },
            {
              termine: "Statistics",
              descrizione:
                "According to the retention set on the measurement tool, which we'll state in the Cookie Policy once it is active.",
            },
          ],
        },
      ],
    },
    {
      titolo: "8. Your rights",
      blocchi: [
        {
          tipo: "p",
          testo:
            "The Regulation gives you a set of rights you can exercise at any time, free of charge:",
        },
        {
          tipo: "elenco",
          voci: [
            "to know whether we process data about you and obtain a copy (access, Art. 15);",
            "to have inaccurate or incomplete data corrected (rectification, Art. 16);",
            "to ask for erasure, in the cases provided for (Art. 17);",
            "to ask for processing to be restricted (Art. 18);",
            "to receive your data in a machine-readable format, or have it transferred to another controller (portability, Art. 20);",
            "to object to processing based on legitimate interest (Art. 21);",
            "to withdraw consent at any time, without affecting what was done beforehand (Art. 7(3)).",
          ],
        },
        {
          tipo: "p",
          testo: `To exercise them, write to ${TITOLARE.email}. We reply within a month; if the request is complex the deadline may be extended, and we'll tell you if so.`,
        },
      ],
    },
    {
      titolo: "9. If you think something is wrong",
      blocchi: [
        {
          tipo: "p",
          testo: `You can come to us at any time. If you're not satisfied with the answer, you have the right to lodge a complaint with the Italian data protection authority, ${GARANTE.nome} (${GARANTE.sito}), or with the supervisory authority of the Member State where you live or work.`,
        },
      ],
    },
    {
      titolo: "10. Children",
      blocchi: [
        {
          tipo: "p",
          testo:
            "This site is not aimed at children under fourteen and does not knowingly collect their data. If you believe a child has given us personal data, write to us and we'll delete it.",
        },
      ],
    },
    {
      titolo: "11. Changes to this notice",
      blocchi: [
        {
          tipo: "p",
          testo:
            "We may update this notice when processing, tools or the law change. The date at the top shows the last update; if the changes concern purposes requiring your consent, we'll ask again rather than assume it.",
        },
      ],
    },
  ],
};

const COPY: Record<Locale, Informativa> = { it, en };

export function getPrivacy(locale: Locale): Informativa {
  return COPY[locale];
}
