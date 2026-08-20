import type { Locale } from "./config";

// Scelta del campo tradotto con ricaduta sull'italiano.
//
// Comportamento voluto e confermato: un piatto può restare in
// italiano se non ha la traduzione. Meglio "Supplì di zucchine" che
// un buco nel menu — e per i nomi propri di piatto spesso l'italiano
// è la forma corretta anche in inglese.
//
// Vale per piatti, eventi e contenuti_sito: ovunque ci sia una coppia
// campo / campo_en.
export function campoLocalizzato(
  valoreIt: string | null | undefined,
  valoreEn: string | null | undefined,
  locale: Locale,
): string {
  if (locale === "en") {
    const en = valoreEn?.trim();
    if (en) return en;
  }
  return valoreIt?.trim() ?? "";
}

// Variante che conserva il null: utile per i campi facoltativi
// (descrizioni, note) dove "assente" e "stringa vuota" vanno
// distinti, perché il componente decide se rendere o meno il blocco.
export function campoLocalizzatoOpzionale(
  valoreIt: string | null | undefined,
  valoreEn: string | null | undefined,
  locale: Locale,
): string | null {
  const risolto = campoLocalizzato(valoreIt, valoreEn, locale);
  return risolto === "" ? null : risolto;
}
