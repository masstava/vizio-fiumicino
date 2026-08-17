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

export interface BadgeInput {
  testo: string;
  testo_en: string;
}
