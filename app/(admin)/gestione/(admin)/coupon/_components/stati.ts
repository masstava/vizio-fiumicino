import type { StatusBadgeTono } from "@/src/components/admin/StatusBadge";

// Stato derivato, non un campo diretto: a differenza di
// prenotazioni.stato (una colonna che lo staff cambia direttamente),
// qui lo stato dipende da più campi insieme (attivo, finestra di
// validità, tetto utilizzi) — la stessa logica già scritta una volta
// nella RPC riscatta_coupon (vedi la migration), riprodotta qui SOLO
// per la resa visiva della lista: non decide se un riscatto va
// accettato, quello resta compito esclusivo della funzione lato
// database.
export type StatoCoupon =
  | "attivo"
  | "non_ancora_valido"
  | "scaduto"
  | "esaurito"
  | "disattivato";

export function statoCoupon(
  riga: {
    attivo: boolean;
    validoDal: string | null;
    validoAl: string | null;
    utilizzoMassimo: number | null;
    utilizzi: number;
  },
  /** "YYYY-MM-DD", fuso di Roma — vedi oggiEOraRoma(). */
  oggi: string,
): StatoCoupon {
  if (!riga.attivo) return "disattivato";
  if (riga.validoDal && oggi < riga.validoDal) return "non_ancora_valido";
  if (riga.validoAl && oggi > riga.validoAl) return "scaduto";
  if (riga.utilizzoMassimo != null && riga.utilizzi >= riga.utilizzoMassimo) return "esaurito";
  return "attivo";
}

// Un tono condiviso fra due stati (non_ancora_valido/scaduto → ambra):
// il badge non perde leggibilità perché il testo resta diverso, e i
// quattro toni disponibili (§ Colori in DASHBOARD_DESIGN_SYSTEM.md)
// bastano a coprire cinque stati raggruppando quelli della stessa
// famiglia ("non ancora utilizzabile per una questione di tempo").
// disattivato=brick: stessa scelta di "cancellata" in
// prenotazioni/stati.ts — un'azione deliberata dello staff, non un
// esito naturale del tempo che passa.
export const TONO_STATO_COUPON: Record<StatoCoupon, StatusBadgeTono> = {
  attivo: "verde",
  non_ancora_valido: "ambra",
  scaduto: "ambra",
  esaurito: "grigio",
  disattivato: "brick",
};

export const ETICHETTA_STATO_COUPON: Record<StatoCoupon, string> = {
  attivo: "Attivo",
  non_ancora_valido: "Non ancora valido",
  scaduto: "Scaduto",
  esaurito: "Esaurito",
  disattivato: "Disattivato",
};
