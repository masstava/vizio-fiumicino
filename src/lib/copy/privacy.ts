import { GARANTE, TITOLARE } from "@/src/lib/legale";
import type { Informativa } from "./legale-tipi";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// PRIVACY POLICY — 11 sezioni (§14.3)
// =============================================================
// Struttura, titoli e sotto-sezioni sono quelli della specifica.
// La sostanza (titolare, basi giuridiche, fornitori, ruoli) è già
// decisa; quella scritta qui è la prosa che la esprime.
//
// RESTA CONTENUTO LEGALE: va riletto da chi ne risponde prima della
// pubblicazione. Un errore qui non è una questione di tono.
//
// Tre cautele mantenute, perché riguardano cose che non ho potuto
// verificare:
//
//  - §7: il meccanismo di trasferimento (DPF + Clausole tipo) è
//    quello deciso, ma i fornitori possono cambiarlo. Il testo dice
//    che le condizioni sono quelle della documentazione del
//    fornitore e che su richiesta si indica quale si applichi al
//    momento, invece di dichiarare come permanente uno stato che non
//    controlliamo.
//  - §6: Google è indicato come responsabile "se attivato". La
//    qualificazione per GA4 è dibattuta e dipende dalla
//    configurazione.
//  - §5: i 12 mesi indicati per i dati di prenotazione sono una
//    PROPOSTA, non un valore confermato dal committente — coerente
//    con l'ordine di grandezza già usato per le richieste di
//    contatto (24 mesi), ma da confermare prima che questo testo
//    valga come definitivo.
//
// Aggiornamento 2026-08-26: il sistema di prenotazione nativo (§21)
// è ora completo e in produzione. I dati di chi prenota dal sito
// (§2.2) sono trattati direttamente da noi, non più tramite TheFork
// — §2.2, §3.2 (nuovo), §5 e §6 sono stati corretti di conseguenza.
// Se TheFork continua a esistere come canale di sola scoperta
// esterno (marketplace/app, non integrato sul sito), quel trattamento
// avviene interamente fuori dal nostro sito e non richiede menzione
// qui.
//
// Due trattamenti descritti NON sono ancora attivi, e il testo lo
// dice invece di lasciarlo intendere: Vercel Analytics (§3.4) e
// Google Analytics 4 (§3.5). Verificato: nessuno dei due è fra le
// dipendenze del progetto né importato nel codice.
// =============================================================

const it: Informativa = {
  titolo: "Informativa sulla privacy",
  sottotitolo:
    "Come Nuova Ristorazione S.r.l. tratta i dati personali di chi visita questo sito e di chi ci contatta, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679.",
  aggiornata: (data) => `Ultimo aggiornamento: ${data}`,
  sezioni: [
    {
      titolo: "1. Titolare del trattamento",
      blocchi: [
        {
          tipo: "p",
          testo: `Il titolare del trattamento è ${TITOLARE.ragioneSociale}, con sede legale in ${TITOLARE.sedeLegale.completo} e unità operativa in ${TITOLARE.unitaOperativa.completo}, partita IVA ${TITOLARE.partitaIva}.`,
        },
        {
          tipo: "p",
          testo: `Recapiti per ogni questione relativa ai dati personali: ${TITOLARE.email}, oppure ${TITOLARE.pec} via posta elettronica certificata.`,
        },
        {
          tipo: "p",
          testo:
            "Non è stato nominato un Responsabile della protezione dei dati: l'attività non rientra fra i casi in cui l'articolo 37 del Regolamento lo rende obbligatorio.",
        },
      ],
    },
    {
      titolo: "2. Tipologie di dati raccolti",
      blocchi: [
        {
          tipo: "p",
          testo:
            "La semplice consultazione del sito non richiede di identificarsi. I dati che seguono vengono trattati solo nelle situazioni indicate.",
        },
      ],
      sottosezioni: [
        {
          titolo: "2.1 Dati conferiti tramite i moduli di contatto e newsletter",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Nome, indirizzo email e, facoltativamente, numero di telefono, quando li comunichi per iscriverti alla newsletter o per chiederci qualcosa. Il telefono non è obbligatorio: serve solo se preferisci essere richiamato.",
            },
            {
              tipo: "p",
              testo:
                "Il modulo newsletter presente sul sito non è al momento collegato ad alcun servizio di invio e non trasmette nulla: l'iscrizione sarà attiva quando lo indicheremo qui.",
            },
          ],
        },
        {
          titolo: "2.2 Dati di prenotazione",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Chi prenota un tavolo tramite il modulo presente sul sito ci comunica nome, telefono, email (facoltativa), data, fascia oraria e numero di coperti, ed eventualmente note o allergie; per le prenotazioni legate a un evento specifico, anche le risposte alle domande aggiuntive previste per quell'evento.",
            },
            {
              tipo: "p",
              testo:
                "Questi dati sono raccolti e trattati direttamente da noi, in qualità di titolari del trattamento: non transitano da, né sono raccolti da, piattaforme di prenotazione terze.",
            },
          ],
        },
        {
          titolo: "2.3 Dati di navigazione",
          blocchi: [
            {
              tipo: "p",
              testo:
                "I sistemi che fanno funzionare il sito registrano, per necessità tecnica, indirizzo IP, tipo di browser e pagine visitate. Vengono usati in forma aggregata per finalità statistiche e per mantenere il servizio sicuro, non per identificare chi naviga.",
            },
          ],
        },
        {
          titolo: "2.4 Cookie e tecnologie analoghe",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Il sito usa cookie e strumenti di memorizzazione nel browser. Quali siano, a cosa servano e quanto durino è indicato nella Cookie Policy, che è parte integrante di questa informativa.",
            },
            {
              tipo: "collegamenti",
              voci: [{ testo: "Leggi la Cookie Policy", href: "/cookie-policy" }],
            },
          ],
        },
      ],
    },
    {
      titolo: "3. Finalità del trattamento e basi giuridiche",
      sottosezioni: [
        {
          titolo: "3.1 Invio della newsletter",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Base giuridica: consenso (art. 6.1.a). L'invio è affidato a Brevo SAS. Il consenso è revocabile in qualsiasi momento, con il link di disiscrizione presente in ogni email o scrivendoci: la revoca non tocca la liceità di quanto fatto prima.",
            },
          ],
        },
        {
          titolo: "3.2 Gestione delle prenotazioni",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Base giuridica: esecuzione di misure precontrattuali o del contratto (art. 6.1.b). Accettare una prenotazione è una misura precontrattuale richiesta da chi prenota; trattiamo i dati indicati al punto 2.2 per confermarla, gestirla e, se richiesto, cancellarla. L'invio delle email di conferma e delle eventuali comunicazioni relative a una cancellazione è affidato a Resend.",
            },
          ],
        },
        {
          titolo: "3.3 Riscontro alle richieste di contatto",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Base giuridica: esecuzione di misure precontrattuali o del contratto (art. 6.1.b). Trattiamo quanto ci comunichi per risponderti e per dare seguito alla richiesta.",
            },
          ],
        },
        {
          titolo: "3.4 Statistiche di utilizzo aggregate",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Base giuridica: legittimo interesse (art. 6.1.f) a conoscere l'andamento del sito. La misurazione prevista è Vercel Analytics, che non usa cookie e non conserva l'indirizzo IP in chiaro: per questo non è subordinata a consenso preventivo e non compare nel banner.",
            },
            {
              tipo: "p",
              testo:
                "Questa misurazione non è ancora attiva. Puoi comunque opporti in qualsiasi momento ai sensi dell'articolo 21 scrivendo ai recapiti indicati.",
            },
          ],
        },
        {
          titolo: "3.5 Google Analytics 4, se attivato",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Base giuridica: consenso esplicito (art. 6.1.a), espresso attivando la categoria corrispondente nel pannello dei cookie. A differenza della misurazione anonima, Google Analytics 4 usa cookie e non viene attivato senza il tuo consenso.",
            },
            {
              tipo: "p",
              testo:
                "Al momento non è integrato. Il sito è però già predisposto con il Consent Mode di Google, il cui stato di partenza è «negato» per tutte le finalità che richiedono consenso.",
            },
          ],
        },
        {
          titolo: "3.6 Adempimento di obblighi di legge",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Base giuridica: obbligo legale (art. 6.1.c). Riguarda gli adempimenti amministrativi, contabili e fiscali, e le richieste legittime dell'autorità.",
            },
          ],
        },
      ],
    },
    {
      titolo: "4. Modalità del trattamento",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Il trattamento avviene con strumenti informatici, adottando le misure tecniche e organizzative adeguate previste dall'articolo 32 del Regolamento.",
        },
        {
          tipo: "elenco",
          voci: [
            "le comunicazioni fra il tuo browser e il sito viaggiano cifrate (HTTPS/TLS);",
            "l'accesso ai dati è limitato al personale autorizzato e protetto da autenticazione;",
            "l'infrastruttura dati è fornita da Supabase, con la base dati collocata nella regione dell'Unione europea.",
          ],
        },
        {
          tipo: "p",
          testo:
            "Non è previsto alcun processo decisionale automatizzato né alcuna profilazione ai sensi dell'articolo 22.",
        },
      ],
    },
    {
      titolo: "5. Periodo di conservazione",
      blocchi: [
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Iscrizione alla newsletter",
              descrizione: "Fino alla revoca del consenso.",
            },
            {
              termine: "Richieste di contatto",
              descrizione:
                "24 mesi dall'ultimo scambio, salvo quanto debba essere conservato più a lungo per obbligo di legge.",
            },
            {
              termine: "Dati di prenotazione",
              descrizione:
                "12 mesi dalla data della prenotazione, salvo la necessità di conservarli più a lungo per obblighi fiscali o contabili.",
            },
            {
              termine: "Dati di navigazione",
              descrizione: "Non oltre 12 mesi.",
            },
            {
              termine: "Cookie e strumenti analoghi",
              descrizione:
                "Le durate sono indicate nella Cookie Policy, voce per voce.",
            },
          ],
        },
      ],
    },
    {
      titolo: "6. Categorie di destinatari",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Non vendiamo e non cediamo dati personali. Possono venirne a conoscenza:",
        },
        {
          tipo: "elenco",
          voci: [
            "il personale autorizzato al trattamento, istruito ai sensi dell'articolo 29;",
            "i fornitori che trattano dati per nostro conto in qualità di responsabili ai sensi dell'articolo 28;",
            "le autorità pubbliche, quando la legge lo richieda.",
          ],
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Supabase Inc. — responsabile",
              descrizione:
                "Infrastruttura della base dati dei contenuti del sito. Regione Unione europea (Francoforte).",
            },
            {
              termine: "Vercel Inc. — responsabile",
              descrizione:
                "Hosting del sito e, quando sarà attiva, misurazione aggregata delle visite.",
            },
            {
              termine: "Google LLC — responsabile, se attivato",
              descrizione:
                "Google Analytics 4 e mappa della pagina Contatti, entrambi subordinati al tuo consenso.",
            },
            {
              termine: "Brevo SAS — responsabile",
              descrizione: "Invio della newsletter, quando sarà attiva. Sede in Francia.",
            },
            {
              termine: "Resend, Inc. — responsabile",
              descrizione:
                "Invio delle email di conferma delle prenotazioni e delle eventuali comunicazioni relative a una loro cancellazione. Sede negli Stati Uniti.",
            },
          ],
        },
      ],
    },
    {
      titolo: "7. Trasferimenti verso Paesi terzi",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Vercel Inc. e Google LLC hanno sede negli Stati Uniti. I trasferimenti verso tali fornitori sono fondati sull'EU-U.S. Data Privacy Framework e, in via ulteriore, sulle Clausole contrattuali tipo adottate dalla Commissione europea ai sensi dell'articolo 46.",
        },
        {
          tipo: "p",
          testo:
            "Anche Resend, Inc., il fornitore usato per l'invio delle email di conferma e delle eventuali comunicazioni di cancellazione delle prenotazioni, ha sede negli Stati Uniti.",
        },
        {
          tipo: "p",
          testo:
            "La base dati Supabase è configurata sulla regione dell'Unione europea (Francoforte), il che riduce al minimo i trasferimenti; non è però escluso un accesso dall'estero da parte dell'assistenza tecnica del fornitore, coperto dalle medesime garanzie.",
        },
        {
          tipo: "p",
          testo:
            "Le condizioni applicabili a ciascun fornitore sono quelle indicate nella documentazione contrattuale del fornitore stesso, che può aggiornarle: su richiesta ti indichiamo quale meccanismo risulta applicabile al momento della richiesta.",
        },
      ],
    },
    {
      titolo: "8. Diritti dell'interessato",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Il Regolamento ti riconosce i diritti previsti dagli articoli da 15 a 22:",
        },
        {
          tipo: "elenco",
          voci: [
            "accesso ai dati che ti riguardano e copia degli stessi (art. 15);",
            "rettifica dei dati inesatti o incompleti (art. 16);",
            "cancellazione, nei casi previsti (art. 17);",
            "limitazione del trattamento (art. 18);",
            "notifica ai destinatari di rettifica, cancellazione o limitazione (art. 19);",
            "portabilità dei dati in formato leggibile da dispositivo automatico (art. 20);",
            "opposizione al trattamento fondato sul legittimo interesse (art. 21);",
            "non essere sottoposto a decisioni automatizzate, ipotesi qui non prevista (art. 22).",
          ],
        },
        {
          tipo: "p",
          testo:
            "Dove il trattamento si fonda sul consenso, puoi revocarlo in qualsiasi momento ai sensi dell'articolo 7, paragrafo 3, senza che ciò pregiudichi la liceità del trattamento svolto prima della revoca.",
        },
      ],
    },
    {
      titolo: "9. Come esercitare i diritti",
      blocchi: [
        {
          tipo: "p",
          testo: "Puoi scrivere per posta elettronica, per PEC o per posta ordinaria:",
        },
        {
          tipo: "definizioni",
          voci: [
            { termine: "Email", descrizione: TITOLARE.email },
            { termine: "PEC", descrizione: TITOLARE.pec },
            {
              termine: "Posta ordinaria",
              descrizione: `${TITOLARE.ragioneSociale}, ${TITOLARE.sedeLegale.completo}`,
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "Rispondiamo senza ingiustificato ritardo e comunque entro un mese dalla richiesta, come prevede l'articolo 12, paragrafo 3. Il termine può essere prorogato di due mesi se la richiesta è complessa o se ne riceviamo molte: in quel caso te lo comunichiamo entro il primo mese, spiegandone il motivo.",
        },
      ],
    },
    {
      titolo: "10. Reclamo all'autorità di controllo",
      blocchi: [
        {
          tipo: "p",
          testo: `Se ritieni che il trattamento violi il Regolamento, hai diritto di proporre reclamo al ${GARANTE.nome}, oppure all'autorità di controllo dello Stato membro in cui risiedi, lavori o in cui si è verificata la presunta violazione.`,
        },
        {
          tipo: "collegamenti",
          voci: [{ testo: "garanteprivacy.it", href: GARANTE.sito, esterno: true }],
        },
      ],
    },
    {
      titolo: "11. Modifiche alla presente informativa",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Questa informativa può essere aggiornata quando cambiano i trattamenti, gli strumenti impiegati o la normativa. La data dell'ultimo aggiornamento è indicata in apertura.",
        },
        {
          tipo: "p",
          testo:
            "Se le modifiche riguardano finalità per le quali è necessario il consenso, ti verrà richiesto di nuovo invece di essere considerato acquisito.",
        },
      ],
    },
  ],
};


const en: Informativa = {
  titolo: "Privacy notice",
  sottotitolo:
    "How Nuova Ristorazione S.r.l. handles the personal data of people who visit this site and get in touch, under Articles 13 and 14 of Regulation (EU) 2016/679.",
  aggiornata: (data) => `Last updated: ${data}`,
  sezioni: [
    {
      titolo: "1. Data controller",
      blocchi: [
        {
          tipo: "p",
          testo: `The data controller is ${TITOLARE.ragioneSociale}, registered office at ${TITOLARE.sedeLegale.completo}, operating premises at ${TITOLARE.unitaOperativa.completo}, VAT number ${TITOLARE.partitaIva}.`,
        },
        {
          tipo: "p",
          testo: `Contact for any matter concerning personal data: ${TITOLARE.email}, or ${TITOLARE.pec} by certified email.`,
        },
        {
          tipo: "p",
          testo:
            "No Data Protection Officer has been appointed: the business does not fall within the cases in which Article 37 of the Regulation makes one mandatory.",
        },
      ],
    },
    {
      titolo: "2. Categories of data collected",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Simply browsing the site does not require you to identify yourself. The data below is processed only in the situations described.",
        },
      ],
      sottosezioni: [
        {
          titolo: "2.1 Data provided through the contact and newsletter forms",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Name, email address and, optionally, a phone number, when you give them to subscribe to the newsletter or to ask us something. The phone number is not required: it's only there if you'd rather be called back.",
            },
            {
              tipo: "p",
              testo:
                "The newsletter form on the site is not currently connected to any sending service and transmits nothing: subscription will be active when we say so here.",
            },
          ],
        },
        {
          titolo: "2.2 Booking data",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Anyone booking a table through the form on the site gives us their name, phone number, email address (optional), date, time slot and number of guests, and optionally any notes or allergies; for bookings tied to a specific event, also the answers to any additional questions set for that event.",
            },
            {
              tipo: "p",
              testo:
                "This data is collected and processed directly by us, as data controller: it does not pass through, or get collected by, third-party booking platforms.",
            },
          ],
        },
        {
          titolo: "2.3 Browsing data",
          blocchi: [
            {
              tipo: "p",
              testo:
                "The systems that run the site record, out of technical necessity, IP address, browser type and pages visited. They are used in aggregate form for statistical purposes and to keep the service secure, not to identify who is browsing.",
            },
          ],
        },
        {
          titolo: "2.4 Cookies and similar technologies",
          blocchi: [
            {
              tipo: "p",
              testo:
                "The site uses cookies and browser storage. What they are, what they do and how long they last is set out in the Cookie Policy, which forms part of this notice.",
            },
            {
              tipo: "collegamenti",
              voci: [{ testo: "Read the Cookie Policy", href: "/cookie-policy" }],
            },
          ],
        },
      ],
    },
    {
      titolo: "3. Purposes of processing and legal bases",
      sottosezioni: [
        {
          titolo: "3.1 Sending the newsletter",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Legal basis: consent (Art. 6(1)(a)). Delivery is handled by Brevo SAS. Consent can be withdrawn at any time, using the unsubscribe link in every email or by writing to us: withdrawal does not affect the lawfulness of processing carried out beforehand.",
            },
          ],
        },
        {
          titolo: "3.2 Managing bookings",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Legal basis: performance of pre-contractual measures or of the contract (Art. 6(1)(b)). Accepting a booking is a pre-contractual measure requested by the person booking; we process the data described in 2.2 to confirm it, manage it and, if requested, cancel it. Confirmation emails and any communications relating to a cancellation are sent through Resend.",
            },
          ],
        },
        {
          titolo: "3.3 Responding to contact requests",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Legal basis: performance of pre-contractual measures or of the contract (Art. 6(1)(b)). We process what you tell us in order to reply and follow up on your request.",
            },
          ],
        },
        {
          titolo: "3.4 Aggregate usage statistics",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Legal basis: legitimate interest (Art. 6(1)(f)) in knowing how the site performs. The intended tool is Vercel Analytics, which uses no cookies and does not retain IP addresses in clear: for that reason it is not subject to prior consent and does not appear in the banner.",
            },
            {
              tipo: "p",
              testo:
                "This measurement is not active yet. You may object at any time under Article 21 by writing to the contacts given.",
            },
          ],
        },
        {
          titolo: "3.5 Google Analytics 4, if enabled",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Legal basis: explicit consent (Art. 6(1)(a)), given by turning on the corresponding category in the cookie panel. Unlike anonymous measurement, Google Analytics 4 uses cookies and is not activated without your consent.",
            },
            {
              tipo: "p",
              testo:
                "It is not integrated at present. The site is however already set up with Google Consent Mode, whose starting state is «denied» for every purpose requiring consent.",
            },
          ],
        },
        {
          titolo: "3.6 Compliance with legal obligations",
          blocchi: [
            {
              tipo: "p",
              testo:
                "Legal basis: legal obligation (Art. 6(1)(c)). This covers administrative, accounting and tax obligations, and lawful requests from the authorities.",
            },
          ],
        },
      ],
    },
    {
      titolo: "4. How data is processed",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Processing is carried out using IT systems, applying the appropriate technical and organisational measures required by Article 32 of the Regulation.",
        },
        {
          tipo: "elenco",
          voci: [
            "traffic between your browser and the site is encrypted (HTTPS/TLS);",
            "access to data is limited to authorised staff and protected by authentication;",
            "the data infrastructure is provided by Supabase, with the database located in the European Union region.",
          ],
        },
        {
          tipo: "p",
          testo:
            "There is no automated decision-making and no profiling within the meaning of Article 22.",
        },
      ],
    },
    {
      titolo: "5. Retention period",
      blocchi: [
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Newsletter subscription",
              descrizione: "Until consent is withdrawn.",
            },
            {
              termine: "Contact requests",
              descrizione:
                "24 months from the last exchange, save for anything that must be kept longer by law.",
            },
            {
              termine: "Booking data",
              descrizione:
                "12 months from the date of the booking, save for the need to keep it longer for tax or accounting obligations.",
            },
            { termine: "Browsing data", descrizione: "No more than 12 months." },
            {
              termine: "Cookies and similar tools",
              descrizione: "Durations are given entry by entry in the Cookie Policy.",
            },
          ],
        },
      ],
    },
    {
      titolo: "6. Categories of recipients",
      blocchi: [
        {
          tipo: "p",
          testo: "We do not sell or trade personal data. It may be seen by:",
        },
        {
          tipo: "elenco",
          voci: [
            "staff authorised to process it, instructed under Article 29;",
            "suppliers processing data on our behalf as processors under Article 28;",
            "public authorities, where the law requires it.",
          ],
        },
        {
          tipo: "definizioni",
          voci: [
            {
              termine: "Supabase Inc. — processor",
              descrizione:
                "Database infrastructure for the site's content. European Union region (Frankfurt).",
            },
            {
              termine: "Vercel Inc. — processor",
              descrizione:
                "Site hosting and, once active, aggregate measurement of visits.",
            },
            {
              termine: "Google LLC — processor, if enabled",
              descrizione:
                "Google Analytics 4 and the map on the Contact page, both subject to your consent.",
            },
            {
              termine: "Brevo SAS — processor",
              descrizione: "Newsletter delivery, once active. Based in France.",
            },
            {
              termine: "Resend, Inc. — processor",
              descrizione:
                "Sending booking confirmation emails and any communications relating to a cancellation. Based in the United States.",
            },
          ],
        },
      ],
    },
    {
      titolo: "7. Transfers to third countries",
      blocchi: [
        {
          tipo: "p",
          testo:
            "Vercel Inc. and Google LLC are based in the United States. Transfers to those suppliers rest on the EU-U.S. Data Privacy Framework and, additionally, on the Standard Contractual Clauses adopted by the European Commission under Article 46.",
        },
        {
          tipo: "p",
          testo:
            "Resend, Inc., the supplier used for sending booking confirmation emails and any cancellation-related communications, is also based in the United States.",
        },
        {
          tipo: "p",
          testo:
            "The Supabase database is configured on the European Union region (Frankfurt), which keeps transfers to a minimum; access from abroad by the supplier's technical support cannot be ruled out, and is covered by the same safeguards.",
        },
        {
          tipo: "p",
          testo:
            "The conditions applying to each supplier are those set out in that supplier's own contractual documentation, which it may update: on request we will tell you which mechanism applies at the time you ask.",
        },
      ],
    },
    {
      titolo: "8. Your rights",
      blocchi: [
        {
          tipo: "p",
          testo: "The Regulation gives you the rights set out in Articles 15 to 22:",
        },
        {
          tipo: "elenco",
          voci: [
            "access to data concerning you, and a copy of it (Art. 15);",
            "rectification of inaccurate or incomplete data (Art. 16);",
            "erasure, in the cases provided for (Art. 17);",
            "restriction of processing (Art. 18);",
            "notification to recipients of rectification, erasure or restriction (Art. 19);",
            "portability of data in a machine-readable format (Art. 20);",
            "objection to processing based on legitimate interest (Art. 21);",
            "not to be subject to automated decisions, which do not occur here (Art. 22).",
          ],
        },
        {
          tipo: "p",
          testo:
            "Where processing rests on consent, you may withdraw it at any time under Article 7(3), without affecting the lawfulness of processing carried out before withdrawal.",
        },
      ],
    },
    {
      titolo: "9. How to exercise your rights",
      blocchi: [
        { tipo: "p", testo: "You can write by email, certified email or post:" },
        {
          tipo: "definizioni",
          voci: [
            { termine: "Email", descrizione: TITOLARE.email },
            { termine: "Certified email (PEC)", descrizione: TITOLARE.pec },
            {
              termine: "Post",
              descrizione: `${TITOLARE.ragioneSociale}, ${TITOLARE.sedeLegale.completo}`,
            },
          ],
        },
        {
          tipo: "p",
          testo:
            "We reply without undue delay and in any case within one month of the request, as Article 12(3) requires. That period may be extended by two months where the request is complex or where we receive many: if so, we tell you within the first month and explain why.",
        },
      ],
    },
    {
      titolo: "10. Complaint to the supervisory authority",
      blocchi: [
        {
          tipo: "p",
          testo: `If you believe the processing infringes the Regulation, you have the right to lodge a complaint with the Italian supervisory authority, ${GARANTE.nome}, or with the authority of the Member State where you live, work, or where the alleged infringement took place.`,
        },
        {
          tipo: "collegamenti",
          voci: [{ testo: "garanteprivacy.it", href: GARANTE.sito, esterno: true }],
        },
      ],
    },
    {
      titolo: "11. Changes to this notice",
      blocchi: [
        {
          tipo: "p",
          testo:
            "This notice may be updated when processing, the tools used or the law change. The date of the last update is shown at the top.",
        },
        {
          tipo: "p",
          testo:
            "If the changes concern purposes requiring consent, you will be asked again rather than having it treated as already given.",
        },
      ],
    },
  ],
};

const COPY: Record<Locale, Informativa> = { it, en };

export function getPrivacy(locale: Locale): Informativa {
  return COPY[locale];
}
