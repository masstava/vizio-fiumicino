"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
  localizedPath,
  stripLocale,
  type Locale,
} from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Selettore discreto: due sigle, non un menu a tendina. Con due sole
// lingue una tendina costerebbe un clic in più senza dare nulla.
//
// Mantiene la pagina corrente: si toglie il prefisso di lingua dal
// percorso e si ricostruisce nell'altra, così da /en/menu si arriva a
// /menu e non alla home.
export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  const t = getDizionario(locale);
  const base = stripLocale(pathname);

  return (
    // Sotto md ogni sigla diventa un riquadro di 44x44 con il testo
    // centrato. NON si usa qui il pseudo-elemento di
    // data-tocco-esteso, come per gli interruttori: le due sigle
    // distano una trentina di pixel, quindi due aree da 44px centrate
    // su ciascuna si sovrapporrebbero e un tocco al centro
    // finirebbe sulla lingua sbagliata. Meglio due bersagli veri e
    // separati. Da md in su resta la coppia compatta di prima.
    <div
      className="flex items-center gap-0 md:gap-1"
      aria-label={t.lingua.etichetta}
    >
      {(["it", "en"] as const).map((l, i) => {
        const attiva = l === locale;
        return (
          <span key={l} className="flex items-center">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="hidden text-cream-text/25 md:mx-1 md:inline"
              >
                /
              </span>
            )}
            <Link
              href={localizedPath(base, l)}
              hrefLang={l}
              lang={l}
              aria-current={attiva ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center",
                "md:min-h-0 md:min-w-0",
                "font-sans text-xs tracking-wide transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text",
                attiva
                  ? "text-cream-text"
                  : "text-muted-dark hover:text-cream-text",
              )}
            >
              <span className="sr-only">
                {l === "it" ? t.lingua.it : t.lingua.en}
              </span>
              <span aria-hidden="true">
                {l === "it" ? t.lingua.itBreve : t.lingua.enBreve}
              </span>
            </Link>
          </span>
        );
      })}
    </div>
  );
}
