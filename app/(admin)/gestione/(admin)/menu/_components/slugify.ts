/**
 * Converte un nome (macro-categoria o categoria) in uno slug leggibile
 * per la query string, es. "Bar & Cocktail" -> "bar-cocktail".
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
