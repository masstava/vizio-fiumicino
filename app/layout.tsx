import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/src/lib/site-url";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Le immagini Open Graph (app/opengraph-image.png e twitter-image.png)
// vengono collegate da Next per convenzione di file: metadataBase serve
// a renderne assoluto l'URL, altrimenti le anteprime social non le
// caricano. Vedi src/lib/site-url.ts per la risoluzione per ambiente.
const DESCRIZIONE =
  "Carne alla brace, cocktail d'autore e aperitivo fino a notte fonda, a Fiumicino. Via delle Ombrine 25.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vizio Bistrot — Fiumicino",
    template: "%s · Vizio Bistrot",
  },
  description: DESCRIZIONE,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Vizio Bistrot",
    title: "Vizio Bistrot — Fiumicino",
    description: DESCRIZIONE,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vizio Bistrot — Fiumicino",
    description: DESCRIZIONE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-cream text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
