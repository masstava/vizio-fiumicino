// Forma comune delle informative: un elenco ordinato di sezioni, ognuna
// con titolo e blocchi. Tenerle come DATI e non come JSX serve a tre
// cose: la stessa pagina rende italiano e inglese senza duplicare il
// markup, l'ordine e i titoli si cambiano senza toccare i componenti,
// e il numero di sezioni è verificabile a colpo d'occhio.

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

export type Blocco =
  | { tipo: "p"; testo: string }
  | { tipo: "elenco"; voci: string[] }
  | { tipo: "definizioni"; voci: Voce[] }
  | { tipo: "tabella"; intestazioni: [string, string, string, string]; righe: RigaTabella[] }
  | { tipo: "gestisci-cookie" };

export interface Sezione {
  titolo: string;
  blocchi: Blocco[];
}

export interface Informativa {
  titolo: string;
  sottotitolo: string;
  aggiornata: (data: string) => string;
  sezioni: Sezione[];
}
