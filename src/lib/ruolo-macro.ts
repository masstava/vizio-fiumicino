// Ruolo di una macro-categoria (colonna categorie_macro.ruolo,
// migration 20260910000000): è così, e non col nome, che home,
// vetrina del bar, suggerimento orario del menu al tavolo e anteprima
// dell'editor piatti riconoscono la cucina e il bar. Il nome è
// modificabile dalla dashboard; il ruolo segue la riga.
export type RuoloMacro = "cucina" | "bar";

export function ruoloMacro(valore: string | null | undefined): RuoloMacro | null {
  return valore === "cucina" || valore === "bar" ? valore : null;
}
