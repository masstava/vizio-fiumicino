import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
