import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "@/src/lib/fonts";

// Layout radice della dashboard. Resta solo in italiano: la usa lo
// staff del locale, non i clienti — nessun instradamento per lingua,
// nessun selettore.
//
// Il sito pubblico ha il proprio layout radice separato, in
// app/(public)/[locale], perché deve poter cambiare l'attributo lang
// dell'elemento <html> a seconda della lingua, e da un layout unico
// condiviso non sarebbe possibile.
export const metadata: Metadata = {
  title: "Gestione · Vizio Bistrot",
  // La dashboard non deve finire nei risultati di ricerca.
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={fontVariables}>
      <body className="bg-cream text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
