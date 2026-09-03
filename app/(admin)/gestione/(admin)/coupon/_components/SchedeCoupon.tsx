"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const SCHEDE = [
  { href: "/gestione/coupon", label: "Lista" },
  { href: "/gestione/coupon/analytics", label: "Analytics" },
];

// Due viste equivalenti sullo stesso dato — stesso pattern e stesso
// componente-tipo di SchedeGestioneSito.tsx: rotte vere, non stato
// client, ognuna con la propria voce in AdminTopbar. "Nuovo coupon
// campagna" NON è una scheda: è un'azione, non una vista, e segue
// invece il pattern "+ Nuovo evento" (pagina dedicata raggiunta da un
// pulsante primario in topbar — vedi NuovoCouponAction.tsx).
export function SchedeCoupon() {
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
