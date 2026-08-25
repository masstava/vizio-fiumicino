// =============================================================
// Dati del titolare del trattamento — fonte unica
// =============================================================
// Stesso principio di src/lib/contatti.ts: questi valori compaiono
// nella privacy policy, nella cookie policy e domani in eventuali
// moduli o email. Un dato sbagliato in uno solo dei posti è un
// problema di conformità, non un refuso — quindi stanno qui una volta
// sola.
//
// La sede legale è DIVERSA dall'unità operativa: la prima è la sede
// della società, la seconda è il locale. Nell'informativa vanno
// distinte, perché il titolare è la società.

export const TITOLARE = {
  ragioneSociale: "Nuova Ristorazione S.r.l.",
  sedeLegale: {
    via: "Via della Spiaggia 29",
    cap: "00054",
    citta: "Fiumicino",
    provincia: "RM",
    completo: "Via della Spiaggia 29, 00054 Fiumicino (RM)",
  },
  unitaOperativa: {
    via: "Via delle Ombrine 25",
    completo: "Via delle Ombrine 25, 00054 Fiumicino (RM)",
  },
  partitaIva: "15704811007",
  pec: "nuova_ristorazione@pec.it",
  email: "info@vizio-fiumicino.it",
  /** Nessun Responsabile della protezione dei dati nominato: non
   *  obbligatorio per questa attività. Confermato dal committente. */
  dpo: null,
} as const;

// Autorità di controllo competente, per la sezione "reclamo".
export const GARANTE = {
  nome: "Garante per la protezione dei dati personali",
  sito: "https://www.garanteprivacy.it",
} as const;

/**
 * Data dell'ultimo aggiornamento delle informative.
 *
 * Va cambiata a mano quando il TESTO cambia, non a ogni deploy: una
 * data che si aggiorna da sola direbbe all'utente che l'informativa è
 * cambiata anche quando non è vero, e renderebbe impossibile
 * accorgersi di una modifica reale.
 */
export const AGGIORNAMENTO_INFORMATIVE = "2026-08-25";
