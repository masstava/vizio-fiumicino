// =============================================================
// Fonte unica per i dati di contatto (principio NAP: nome,
// indirizzo e telefono devono essere identici ovunque — sito,
// footer, header, schema markup, PDF).
//
// Perché un modulo di configurazione e non variabili d'ambiente:
// questi valori sono pubblici (non sono segreti), servono sia lato
// server sia lato client, cambiano di rado e devono essere identici
// in ogni ambiente. Tenerli qui li rende tipizzati, versionati in
// git e rivedibili in diff — mentre in env andrebbero replicati in
// ogni ambiente Vercel con il rischio di disallineamenti silenziosi
// proprio sui campi che il NAP impone identici.
//
// Un dato di contatto nuovo si aggiunge QUI, mai nei componenti.
// =============================================================

export const CONTATTI = {
  nome: "Vizio Bistrot",

  indirizzo: {
    via: "Via delle Ombrine 25",
    citta: "Fiumicino",
    provincia: "RM",
    // Riga singola pronta all'uso nei componenti
    completo: "Via delle Ombrine 25, Fiumicino (RM)",
  },

  telefono: {
    // Come va mostrato a schermo
    display: "06 87165627",
    // Formato E.164 per l'href tel:
    href: "tel:+390687165627",
  },

  whatsapp: {
    display: "+39 392 640 0335",
    // wa.me vuole il numero senza + né spazi
    href: "https://wa.me/393926400335",
  },

  social: [
    { nome: "Instagram", url: "https://www.instagram.com/viziobistrot/" },
    { nome: "Facebook", url: "https://www.facebook.com/viziobistrot" },
    { nome: "TikTok", url: "https://www.tiktok.com/@viziobistrotristorante" },
    { nome: "YouTube", url: "https://www.youtube.com/@VizioRistoranteBistrot" },
  ],

  google: {
    // Scheda Google Maps (usata per l'indirizzo cliccabile)
    scheda: "https://g.page/r/CbysWr_hxrA_EBE",
    // Link che apre direttamente il form di recensione
    recensione: "https://g.page/r/CbysWr_hxrA_EBE/review",
  },
} as const;

// Valori statici: vanno aggiornati a mano finché non arriva
// l'integrazione con l'API Google Places, che li renderà dinamici.
// Tenerli qui evita che restino sepolti dentro un componente.
export const RECENSIONI = {
  rating: "4,8",
  totale: 137,
} as const;
