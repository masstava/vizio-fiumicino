/**
 * Pre-selezione della sezione da mostrare per prima nella vista
 * operativa del menu (QR al tavolo).
 *
 * ATTENZIONE, ASSUNZIONE DA CONFERMARE: nel database non esiste il
 * concetto di "fascia oraria del menu". Le sezioni sono le
 * macro-categorie, e questa tabella associa a ciascuna ora del giorno
 * il RUOLO della macro più probabile (cucina o bar — colonna
 * categorie_macro.ruolo). È una scelta redazionale, non un dato: si
 * cambia qui, in un posto solo.
 *
 * Ruolo e non nome: il nome si modifica dalla dashboard, e con un
 * confronto per nome una rinomina spegnerebbe il suggerimento senza
 * alcun errore visibile.
 *
 * La pre-selezione NON nasconde nulla: tutte le sezioni restano
 * presenti e raggiungibili dalla barra in alto. Cambia solo QUALE
 * viene renderizzata per prima.
 *
 * Viene calcolata una sola volta, al momento della richiesta, e non
 * viene più rivalutata: se un cliente sta guardando i cocktail alle
 * 13:00 la pagina non deve riordinarsi sotto le sue dita.
 */

import type { RuoloMacro } from "@/src/lib/ruolo-macro";

interface Fascia {
  /** Ora di inizio inclusa, sul fuso di Roma. */
  da: number;
  /** Ora di fine esclusa. */
  a: number;
  ruolo: RuoloMacro;
}

// Le fasce coprono le 24 ore senza buchi né sovrapposizioni.
const FASCE: Fascia[] = [
  { da: 6, a: 16, ruolo: "cucina" }, // mattina e pranzo
  { da: 16, a: 20, ruolo: "bar" },    // aperitivo
  { da: 20, a: 23, ruolo: "cucina" }, // cena
  { da: 23, a: 24, ruolo: "bar" },    // dopocena
  { da: 0, a: 6, ruolo: "bar" },      // notte
];

/** Ora corrente a Roma (0-23), indipendente dal fuso del server. */
export function oraDiRoma(adesso: Date = new Date()): number {
  const ore = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    hour12: false,
  }).format(adesso);
  return Number(ore);
}

/** Ruolo della macro-categoria da mostrare per prima a quest'ora. */
export function ruoloDaMostrarePerPrimo(ora: number = oraDiRoma()): RuoloMacro {
  const fascia = FASCE.find((f) => ora >= f.da && ora < f.a);
  return fascia?.ruolo ?? "cucina";
}

/**
 * Riordina le sezioni mettendo davanti quella suggerita dall'ora.
 * L'ordine relativo di tutte le altre resta quello del database:
 * si sposta una sezione, non si rimescola il menu.
 */
export function conSezioneSuggerita<T extends { ruolo?: RuoloMacro | null }>(
  sezioni: T[],
  ruoloSuggerito: RuoloMacro,
): T[] {
  const i = sezioni.findIndex((s) => s.ruolo === ruoloSuggerito);
  if (i <= 0) return sezioni; // già prima, o non presente
  return [sezioni[i], ...sezioni.slice(0, i), ...sezioni.slice(i + 1)];
}
