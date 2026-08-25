// Forma comune delle informative: un elenco ordinato di sezioni, ognuna
// con titolo, blocchi e — dove la specifica le prevede — sotto-sezioni
// numerate. Tenerle come DATI e non come JSX serve a tre cose: la
// stessa pagina rende italiano e inglese senza duplicare il markup,
// l'ordine e i titoli si cambiano senza toccare i componenti, e il
// numero di sezioni è verificabile a colpo d'occhio.

export interface Voce {
  termine: string;
  descrizione: string;
}

export interface RigaTabella {
  categoria: string;
  finalita: string;
  base: string;
  durata: string;
}

/** Tabella a due colonne, per gli elenchi di cookie concreti. */
export interface RigaCookie {
  nome: string;
  tipo: string;
  finalita: string;
  durata: string;
}

export interface Collegamento {
  testo: string;
  href: string;
  /** true per i link fuori dal sito: aprono in una nuova scheda. */
  esterno?: boolean;
}

export type Blocco =
  | { tipo: "p"; testo: string }
  | { tipo: "elenco"; voci: string[] }
  | { tipo: "definizioni"; voci: Voce[] }
  | { tipo: "tabella"; intestazioni: [string, string, string, string]; righe: RigaTabella[] }
  | { tipo: "tabella-cookie"; intestazioni: [string, string, string, string]; righe: RigaCookie[] }
  | { tipo: "collegamenti"; voci: Collegamento[] }
  | { tipo: "gestisci-cookie" };

export interface Sottosezione {
  titolo: string;
  blocchi: Blocco[];
}

export interface Sezione {
  titolo: string;
  blocchi?: Blocco[];
  sottosezioni?: Sottosezione[];
}

export interface Informativa {
  titolo: string;
  sottotitolo: string;
  aggiornata: (data: string) => string;
  sezioni: Sezione[];
}
