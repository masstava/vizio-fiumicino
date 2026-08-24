export interface PiattoListItem {
  id: string;
  nome: string;
  descrizione: string | null;
  prezzo: number | null;
  prezzo_variabile: boolean;
  disponibile: boolean;
  foto_url: string | null;
  categoria_id: string;
  allergeni: number[];
  badges: string[];
}

export interface CategoriaGroup {
  id: string;
  nome: string;
  piatti: PiattoListItem[];
}

export interface MacroGroup {
  id: string;
  nome: string;
  categorie: CategoriaGroup[];
}

export interface CategoriaOption {
  id: string;
  nome: string;
}

export interface CategoriaGroupOption {
  macroId: string;
  macroNome: string;
  categorie: CategoriaOption[];
}

export interface AllergeneOption {
  id: number;
  nome_it: string;
}

// Alias di tipo e non interface: le interface in TypeScript non
// ricevono un index signature implicito, quindi non risultano
// assegnabili a Json — che è il tipo dell'argomento jsonb della RPC.
// Gli alias sì. Stessa forma, nessuna differenza a runtime.
export type BadgeInput = {
  testo: string;
  testo_en: string;
};
