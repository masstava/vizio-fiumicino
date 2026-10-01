import type { RuoloMacro } from "@/src/lib/ruolo-macro";

// Forma dei dati dell'editor categorie, passata dalla pagina server
// al componente client.
export interface SottoCategoriaEditor {
  id: string;
  nome: string;
  nomeEn: string | null;
  /** Piatti che la usano: conteggio reale, per il blocco eliminazione. */
  piatti: number;
}

export interface MacroEditor {
  id: string;
  nome: string;
  nomeEn: string | null;
  ruolo: RuoloMacro | null;
  categorie: SottoCategoriaEditor[];
}
