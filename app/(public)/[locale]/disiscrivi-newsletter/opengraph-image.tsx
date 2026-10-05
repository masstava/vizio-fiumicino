import { LOCALES } from "@/src/lib/i18n/config";
import { anteprimaSocial, DIMENSIONI, TIPO } from "@/src/lib/og/anteprima";
import { testiAnteprima } from "@/src/lib/og/pagine";

// Anteprima social: pagina personale (link con token), quindi i testi
// generali del sito. Serve comunque un file proprio: l'openGraph della
// pagina sostituisce quello ereditato, immagine compresa.
export const size = DIMENSIONI;
export const contentType = TIPO;
export const alt = "Vizio Bistrot";

// Generata alla build per le due lingue, non a ogni richiesta.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  return anteprimaSocial(await testiAnteprima("home", params));
}
