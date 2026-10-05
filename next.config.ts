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

const nextConfig: NextConfig = {
  async headers() {
    return intestazioniIndicizzazione();
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
