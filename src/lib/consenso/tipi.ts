// =============================================================
// Modello del consenso — §14.1
// =============================================================

/** Cambiare questo numero invalida i consensi già raccolti e li
 *  richiede di nuovo. Va alzato SOLO se cambiano le finalità o le
 *  categorie: un consenso raccolto per finalità diverse non è valido. */
export const VERSIONE_CONSENSO = 1;

export const CHIAVE_LOCALSTORAGE = "vizio-consent-v1";
export const NOME_COOKIE = "vizio-consent";

/** Dodici mesi, come da Linee guida del Garante del 10/06/2021. */
export const DURATA_GIORNI = 365;

// "necessary" è sempre attivo e non è negoziabile: senza, il sito non
// funziona. Resta nell'elenco perché va comunque mostrato all'utente,
// dichiarato e non spuntabile.
export const CATEGORIE = [
  "necessary",
  "functional",
  "analytics",
  "marketing",
] as const;

export type Categoria = (typeof CATEGORIE)[number];

export type Scelte = Record<Categoria, boolean>;

export interface ConsensoSalvato {
  versione: number;
  scelte: Scelte;
  /** ISO 8601, momento della scelta. */
  salvatoIl: string;
  /** ISO 8601, dopo il quale il consenso va richiesto di nuovo. */
  scadeIl: string;
}

export const TUTTO_NEGATO: Scelte = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const TUTTO_CONCESSO: Scelte = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};
