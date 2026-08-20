import type { Metadata } from "next";
import { localizedPath, type Locale } from "./config";

// Canonical + hreflang per UNA pagina specifica.
//
// Vanno dichiarati per pagina e non nel layout: un canonical messo
// nel layout varrebbe "/" per ogni rotta sotto di esso, e da quando
// esisteranno /menu, /contatti eccetera tutte direbbero ai motori di
// ricerca di essere la home. Ogni pagina passa qui il proprio
// percorso senza prefisso di lingua ("/", "/menu", ...).
export function alternatesPerPagina(
  percorso: string,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: localizedPath(percorso, locale),
    languages: {
      it: localizedPath(percorso, "it"),
      en: localizedPath(percorso, "en"),
      // L'italiano è la versione servita sull'URL radice.
      "x-default": localizedPath(percorso, "it"),
    },
  };
}
