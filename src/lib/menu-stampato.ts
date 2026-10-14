// PDF del menu in cui va stampata una macro-categoria (colonna
// categorie_macro.menu_stampato, migration 20260913000000). Lo sceglie
// lo staff nell'editor categorie; null = in nessuno dei due PDF.
// Vale solo per i PDF: sito, menu al tavolo e home non lo leggono.
export type MenuStampato = "menu" | "beverage";

export const MENU_STAMPATI: readonly MenuStampato[] = ["menu", "beverage"];

export function menuStampato(valore: string | null | undefined): MenuStampato | null {
  return valore === "menu" || valore === "beverage" ? valore : null;
}

/** Titolo in copertina del PDF: uguale in italiano e in inglese. */
export const TITOLO_MENU_STAMPATO: Record<MenuStampato, string> = {
  menu: "MENU",
  beverage: "BEVERAGE",
};

/** Etichetta nella dashboard. */
export const ETICHETTA_MENU_STAMPATO: Record<MenuStampato, string> = {
  menu: "Menu",
  beverage: "Beverage",
};
