import type { MetadataRoute } from "next";
import { DOMINIO_FINALE, INDICIZZABILE } from "@/src/lib/indicizzazione";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { AGGIORNAMENTO_INFORMATIVE } from "@/src/lib/legale";

// Pagine pubbliche indicizzabili, ciascuna in IT ed EN con le
// alternative hreflang. Escluse di proposito: /menu-online (menu al
// tavolo, noindex), le pagine con token (/gestisci-prenotazione,
// /disiscrivi-newsletter), /gestione.
//
// lastModified solo dove esiste una data VERA: le informative hanno
// AGGIORNAMENTO_INFORMATIVE. Le altre pagine non hanno nel database
// una data di modifica (piatti, eventi, orari, testi non registrano
// quando cambiano): la data della build direbbe "modificata" a ogni
// deploy, e Google smette di fidarsi di un lastmod che non è
// accurato — meglio ometterlo.
const PAGINE: { percorso: string; lastModified?: string }[] = [
  { percorso: "/" },
  { percorso: "/menu" },
  { percorso: "/la-carne" },
  { percorso: "/cocktail-bar" },
  { percorso: "/experience-eventi" },
  { percorso: "/contatti" },
  { percorso: "/prenota" },
  { percorso: "/privacy", lastModified: AGGIORNAMENTO_INFORMATIVE },
  { percorso: "/cookie-policy", lastModified: AGGIORNAMENTO_INFORMATIVE },
];

const url = (percorso: string, locale: Locale) => `${DOMINIO_FINALE}${localizedPath(percorso, locale)}`;

// A interruttore spento: sitemap vuota (robots.txt non la indica).
export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDICIZZABILE) return [];
  return PAGINE.flatMap(({ percorso, lastModified }) =>
    (["it", "en"] as const).map((locale) => ({
      url: url(percorso, locale),
      ...(lastModified ? { lastModified } : {}),
      alternates: {
        languages: {
          it: url(percorso, "it"),
          en: url(percorso, "en"),
          "x-default": url(percorso, "it"),
        },
      },
    })),
  );
}
