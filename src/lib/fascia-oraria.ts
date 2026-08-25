/**
 * Pre-selezione della sezione da mostrare per prima nella vista
 * operativa del menu (QR al tavolo).
 *
 * ATTENZIONE, ASSUNZIONE DA CONFERMARE: nel database non esiste il
 * concetto di "fascia oraria del menu". Le sezioni sono le
 * macro-categorie ("Da mangiare", "Bar & Cocktail", ...), e questa
 * tabella associa a ciascuna ora del giorno la macro più probabile.
 * È una scelta redazionale, non un dato: si cambia qui, in un posto
 * solo.
 *
 * La pre-selezione NON nasconde nulla: tutte le sezioni restano
 * presenti e raggiungibili dalla barra in alto. Cambia solo QUALE
 * viene renderizzata per prima.
 *
 * Viene calcolata una sola volta, al momento della richiesta, e non
 * viene più rivalutata: se un cliente sta guardando i cocktail alle
 * 13:00 la pagina non deve riordinarsi sotto le sue dita.
 */

/** Nomi delle macro-categorie come sono nel database. */
const MANGIARE = "Da mangiare";
const BAR = "Bar & Cocktail";

interface Fascia {
  /** Ora di inizio inclusa, sul fuso di Roma. */
  da: number;
  /** Ora di fine esclusa. */
  a: number;
  macro: string;
}

// Le fasce coprono le 24 ore senza buchi né sovrapposizioni.
const FASCE: Fascia[] = [
  { da: 6, a: 16, macro: MANGIARE }, // mattina e pranzo
  { da: 16, a: 20, macro: BAR },     // aperitivo
  { da: 20, a: 23, macro: MANGIARE },// cena
  { da: 23, a: 24, macro: BAR },     // dopocena
  { da: 0, a: 6, macro: BAR },       // notte
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

/** Nome della macro-categoria da mostrare per prima a quest'ora. */
export function macroDaMostrarePerPrima(ora: number = oraDiRoma()): string {
  const fascia = FASCE.find((f) => ora >= f.da && ora < f.a);
  return fascia?.macro ?? MANGIARE;
}

/**
 * Riordina le sezioni mettendo davanti quella suggerita dall'ora.
 * L'ordine relativo di tutte le altre resta quello del database:
 * si sposta una sezione, non si rimescola il menu.
 */
export function conSezioneSuggerita<T extends { chiave?: string }>(
  sezioni: T[],
  chiaveSuggerita: string,
): T[] {
  // Si confronta la CHIAVE (nome originale del database) e non il
  // nome tradotto: in inglese "Da mangiare" diventa "Food" e il
  // confronto non troverebbe mai nulla.
  const i = sezioni.findIndex((s) => s.chiave === chiaveSuggerita);
  if (i <= 0) return sezioni; // già prima, o non presente
  return [sezioni[i], ...sezioni.slice(0, i), ...sezioni.slice(i + 1)];
}
