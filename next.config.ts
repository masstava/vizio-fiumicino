import type { NextConfig } from "next";
import { HOST_INDICIZZABILI, INDICIZZABILE, SEMPRE_NOINDEX } from "./src/lib/indicizzazione";

// Header X-Robots-Tag — vedi src/lib/indicizzazione.ts. Copre anche
// ciò che non è HTML (PDF sotto /api) e, a interruttore acceso,
// qualunque host diverso dal dominio finale: dopo il cutover lo
// stesso deploy resta raggiungibile anche su *.vercel.app, e quella
// copia non deve finire nei risultati di ricerca.
const NOINDEX = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

function intestazioniIndicizzazione() {
  if (!INDICIZZABILE) return [{ source: "/:path*", headers: NOINDEX }];
  return [
    {
      source: "/:path*",
      missing: [{ type: "host" as const, value: HOST_INDICIZZABILI }],
      headers: NOINDEX,
    },
    ...SEMPRE_NOINDEX.map((source) => ({ source, headers: NOINDEX })),
  ];
}

// Redirect permanenti dal vecchio sito WordPress (§15). Next usa 308,
// che per Google equivale a 301. Le vecchie pagine amministrative
// (elenco-*, nuovo-*, modifica-*, elimina-*, annulla-*, dashboard,
// /clienti/*, /prenotazioni/*, coupon, attivazioni) NON hanno redirect
// di proposito: devono rispondere 404, e nessuna rotta pubblica nuova
// ha quei nomi. /cocktail-bar, /cookie-policy e /menu-online hanno lo
// stesso percorso sul nuovo sito: nessun redirect.
const REDIRECT_VECCHIO_SITO: [origine: string, destinazione: string][] = [
  ["/aperitivo", "/menu"],
  ["/pranzo", "/menu"],
  ["/cena", "/menu"],
  ["/dopo-cena", "/menu"],
  ["/vino", "/menu"],
  ["/cantina", "/menu"],
  ["/birre", "/menu"],
  ["/distillati", "/menu"],
  ["/maincat/:percorso*", "/menu"],
  // Gli allergeni non hanno una pagina propria: sono la legenda in
  // fondo al menu, che ha l'ancora #allergeni.
  ["/tabella-allergeni", "/menu#allergeni"],
  ["/cocktails", "/cocktail-bar"],
  ["/specialita-di-carne", "/la-carne"],
  ["/experiences", "/experience-eventi"],
  ["/eventi-vizio", "/experience-eventi"],
  ["/eventi/:percorso*", "/experience-eventi"],
  // La pagina "Chi siamo" non esiste ancora.
  // DA TOGLIERE quando verrà costruita app/(public)/[locale]/chi-siamo:
  // i redirect di next.config vengono prima delle rotte, quindi questa
  // riga continuerebbe a mandare in home chi cerca la pagina nuova.
  ["/chi-siamo", "/"],
  ["/ex-prenota-da-vizio", "/prenota"],
  ["/privacy-policy", "/privacy"],
];

const nextConfig: NextConfig = {
  async headers() {
    return intestazioniIndicizzazione();
  },
  // Lo slash finale lo gestiamo noi (ultima regola in redirects): con
  // il redirect automatico di Next, "/aperitivo/" faceva DUE salti —
  // prima "/aperitivo/" → "/aperitivo", poi → "/menu". Il vecchio sito
  // WordPress usava proprio gli URL con lo slash finale.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // {/}? — slash finale facoltativo: le due varianti arrivano a
      // destinazione con un solo salto.
      ...REDIRECT_VECCHIO_SITO.map(([source, destination]) => ({
        source: `${source}{/}?`,
        destination,
        permanent: true,
      })),
      // Per tutto il resto, stesso comportamento del redirect
      // automatico di Next che abbiamo spento: "/menu/" → "/menu".
      { source: "/:percorso+/", destination: "/:percorso+", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // I file .woff di Fraunces sono letti da disco a runtime da
  // @react-pdf/renderer: garantiamo che finiscano nel bundle
  // serverless anche se il tracing automatico non li rileva
  // (la lettura avviene dentro la libreria, non nel nostro codice).
  outputFileTracingIncludes: {
    "/api/pdf/orari": ["./src/lib/pdf/fonts/**"],
    "/api/pdf/menu": ["./src/lib/pdf/fonts/**"],
  },
};

export default nextConfig;
