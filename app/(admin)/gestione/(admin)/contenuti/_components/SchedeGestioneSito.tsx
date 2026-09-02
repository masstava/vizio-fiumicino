"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const SCHEDE = [
  { href: "/gestione/contenuti", label: "Home" },
  { href: "/gestione/contenuti/foto", label: "Foto delle pagine" },
  { href: "/gestione/contenuti/testi", label: "Testi" },
];

// Le tre schede di "Gestione sito" sono rotte vere, non stato client:
// ognuna ha una propria intestazione in topbar (§ AdminTopbar), l'URL
// resta condivisibile e il tasto indietro del browser funziona come
// ci si aspetta — stesso trattamento già dato a lista/nuovo/modifica
// di menu ed eventi nei passaggi precedenti.
export function SchedeGestioneSito() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex gap-1 border-b border-admin-line" role="tablist">
      {SCHEDE.map((s) => {
        const attivo = pathname === s.href;
        return (
          <Link
            key={s.href}
            href={s.href}
            role="tab"
            aria-selected={attivo}
            className={cn(
              "inline-flex min-h-11 items-center border-b-2 px-4 font-sans text-sm transition-colors md:min-h-0 md:py-2.5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60",
              attivo
                ? "border-admin-brick font-medium text-admin-text"
                : "border-transparent text-admin-text-2 hover:text-admin-text",
            )}
          >
            {s.label}
          </Link>
        );
      })}
    </div>
  );
}
