// =============================================================
// Interruttore unico dell'indicizzazione — fonte unica
// =============================================================
// Il sito è indicizzabile SE E SOLO SE:
//   - SITE_URL è impostata ed è esattamente il dominio finale
//     (https://vizio-fiumicino.it, barra finale tollerata), E
//   - il deploy non è una preview di Vercel.
// In ogni altro caso — variabile assente, un indirizzo *.vercel.app,
// una preview, lo sviluppo in locale — tutto resta noindex.
//
// Il giorno del cutover l'unico gesto è impostare SITE_URL su Vercel
// (ambiente Production) e rifare il deploy: Vercel applica le
// variabili solo ai deploy successivi, e robots.txt, sitemap e header
// (next.config) sono comunque calcolati alla build.
//
// Da qui leggono: il meta robots del layout pubblico, robots.txt,
// sitemap.xml e l'header X-Robots-Tag in next.config.ts. Nessuno di
// loro deve ricalcolare la condizione per conto proprio.
//
// Nessun alias "@/" negli import (qui non ce ne sono): il modulo è
// importato anche da next.config.ts, che non risolve gli alias.

export const DOMINIO_FINALE = "https://vizio-fiumicino.it";

function normalizza(url: string | undefined): string {
  return (url ?? "").trim().replace(/\/+$/, "").toLowerCase();
}

export const INDICIZZABILE =
  normalizza(process.env.SITE_URL) === DOMINIO_FINALE && process.env.VERCEL_ENV !== "preview";

/**
 * Host per cui l'indicizzazione può essere attiva, come regex per il
 * campo `has`/`missing` di next.config (Next la ancora con ^…$ e la
 * confronta con l'host senza porta). Anche www: se al cutover il
 * dominio principale su Vercel finisse per essere www invece
 * dell'apex, escluderlo spegnerebbe l'intero sito nei motori di
 * ricerca; un eventuale doppione apex/www lo risolve già il canonical,
 * che punta sempre all'apex.
 */
export const HOST_INDICIZZABILI = "(www\\.)?vizio-fiumicino\\.it";

/**
 * Percorsi SEMPRE noindex, anche a interruttore acceso. Le pagine
 * pubbliche fra questi lo dichiarano anche nel proprio metadata
 * (robots della pagina, che sostituisce quello del layout); qui si
 * aggiunge l'header, che copre pure ciò che non è HTML.
 * Formato: sorgenti di next.config `headers()`.
 */
export const SEMPRE_NOINDEX = [
  "/gestione",
  "/gestione/:path*",
  // Menu al tavolo (QR): vista operativa, la vetrina indicizzabile è /menu.
  "/menu-online",
  "/en/menu-online",
  // Pagine personali raggiunte solo con un token nell'URL.
  "/gestisci-prenotazione",
  "/en/gestisci-prenotazione",
  "/disiscrivi-newsletter",
  "/en/disiscrivi-newsletter",
  // Endpoint, non pagine — tranne i PDF pubblici di menu e orari.
  "/api/:path((?!pdf/menu$|pdf/orari$).*)",
];
