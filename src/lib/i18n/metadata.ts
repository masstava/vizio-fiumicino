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

// Nome e descrizione generali del sito: titolo di default, descrizione
// della home, ricaduta delle anteprime social.
export const NOME_SITO = "Vizio Bistrot";

export const TITOLO_SITO: Record<Locale, string> = {
  it: "Vizio Bistrot — Fiumicino",
  en: "Vizio Bistrot — Fiumicino",
};

export const DESCRIZIONE_SITO: Record<Locale, string> = {
  it: "Carne alla griglia, cocktail d'autore e aperitivo fino a notte fonda, a Fiumicino. Via delle Ombrine 25.",
  en: "Grilled meat, signature cocktails and aperitivo until late, in Fiumicino. Via delle Ombrine 25.",
};

// Metadata completo di una pagina: titolo, descrizione, canonical +
// hreflang, Open Graph e Twitter.
//
// Open Graph e Twitter vanno ripetuti per intero: in Next l'oggetto
// openGraph di una pagina SOSTITUISCE quello del layout, non si fonde
// campo per campo — una pagina che dichiarasse solo il titolo
// perderebbe sito, lingua e tipo. L'immagine non è qui: la danno i
// file opengraph-image.tsx di ogni rotta (src/lib/og/), che Next
// aggiunge da sé. Twitter senza immagine propria usa og:image.
export function metadatiPagina({
  percorso,
  locale,
  titolo,
  descrizione,
}: {
  percorso: string;
  locale: Locale;
  /** Assente per la home, che usa il titolo di default del sito. */
  titolo?: string;
  descrizione: string;
}): Metadata {
  const titoloSocial = titolo ? `${titolo} · ${NOME_SITO}` : TITOLO_SITO[locale];
  return {
    ...(titolo ? { title: titolo } : {}),
    description: descrizione,
    alternates: alternatesPerPagina(percorso, locale),
    openGraph: {
      type: "website",
      siteName: NOME_SITO,
      locale: locale === "it" ? "it_IT" : "en_GB",
      alternateLocale: locale === "it" ? "en_GB" : "it_IT",
      url: localizedPath(percorso, locale),
      title: titoloSocial,
      description: descrizione,
    },
    twitter: {
      card: "summary_large_image",
      title: titoloSocial,
      description: descrizione,
    },
  };
}
