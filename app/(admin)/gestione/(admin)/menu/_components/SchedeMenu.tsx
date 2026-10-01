"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const SCHEDE = [
  { href: "/gestione/menu", label: "Piatti" },
  { href: "/gestione/menu/categorie", label: "Categorie" },
];

// Due viste sullo stesso menu — stesso componente-tipo di
// SchedeCoupon.tsx / SchedeGestioneSito.tsx (§ Schede in
// DASHBOARD_DESIGN_SYSTEM.md): rotte vere, ognuna con la propria voce
// in AdminTopbar.
export function SchedeMenu() {
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
              "inline-flex min-h-11 items-center border-b-2 px-4 font-sans text-sm transition-colors md:pointer-fine:min-h-0 md:pointer-fine:py-2.5",
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
