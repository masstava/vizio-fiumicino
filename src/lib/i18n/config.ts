// Due sole lingue mantenute a mano nella fonte unica: italiano e
// inglese. Per tutte le altre ci si affida alla traduzione nativa del
// browser (Chrome/Safari), che si attiva solo se l'attributo lang
// della pagina è corretto — per questo il layout pubblico lo imposta
// per locale invece di lasciarlo fisso su "it".
export const LOCALES = ["it", "en"] as const;

export type Locale = (typeof LOCALES)[number];

// L'italiano vive sull'URL radice, senza prefisso /it: gli URL
// esistenti e i redirect già mappati dalla vecchia sitemap non
// devono cambiare. L'inglese sta sotto /en.
export const DEFAULT_LOCALE: Locale = "it";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Percorso pubblico di una pagina in una data lingua.
// localizedPath("/menu", "it") → "/menu"
// localizedPath("/menu", "en") → "/en/menu"
export function localizedPath(path: string, locale: Locale): string {
  const pulito = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return pulito;
  return pulito === "/" ? "/en" : `/en${pulito}`;
}

// Toglie l'eventuale prefisso di lingua da un percorso, per poter
// ricostruire la stessa pagina nell'altra lingua.
// stripLocale("/en/menu") → "/menu"
export function stripLocale(path: string): string {
  if (path === "/en") return "/";
  if (path.startsWith("/en/")) return path.slice(3);
  return path;
}
