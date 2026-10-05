import type { MetadataRoute } from "next";
import { DOMINIO_FINALE, INDICIZZABILE } from "@/src/lib/indicizzazione";

// robots.txt — vedi src/lib/indicizzazione.ts.
//
// A interruttore SPENTO il crawling resta permesso (tranne /gestione):
// è il noindex di meta e header a tenere il sito fuori dai risultati,
// e Google può leggerlo solo se la pagina non è bloccata qui. Bloccare
// tutto lascerebbe Google libero di indicizzare gli URL che trova
// linkati altrove, senza vederne il noindex.
//
// /gestione: bloccata sempre (area riservata, nessun contenuto
// pubblico da esplorare; ha comunque anche il proprio noindex).
//
// /api/ a interruttore ACCESO: bloccata, tranne i due PDF pubblici di
// menu e orari, che sono contenuto voluto (linkato dal sito). Gli
// altri endpoint non sono pagine: esplorarli sprecherebbe crawling e
// non porterebbe nulla da indicizzare. Oggi sotto /api ci sono solo
// i due PDF: la regola protegge da quelli che verranno aggiunti.
export default function robots(): MetadataRoute.Robots {
  if (!INDICIZZABILE) {
    return { rules: { userAgent: "*", allow: "/", disallow: "/gestione" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/pdf/menu", "/api/pdf/orari"],
      disallow: ["/gestione", "/api/"],
    },
    sitemap: `${DOMINIO_FINALE}/sitemap.xml`,
  };
}
