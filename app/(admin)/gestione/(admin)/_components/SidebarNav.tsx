"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconEventi,
  IconMenu,
  IconOrari,
  IconPrenotazioni,
  IconTesti,
} from "@/src/components/admin/AdminIcons";
import { cn } from "@/src/lib/utils";

type NavItem = { label: string; href: string; Icon: typeof IconDashboard; contatoreKey?: keyof Contatori };
type Contatori = { menu?: number };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/gestione", Icon: IconDashboard },
  { label: "Menu", href: "/gestione/menu", Icon: IconMenu, contatoreKey: "menu" },
  { label: "Testi della home", href: "/gestione/contenuti", Icon: IconTesti },
  { label: "Orari", href: "/gestione/orari", Icon: IconOrari },
  { label: "Eventi", href: "/gestione/eventi", Icon: IconEventi },
  { label: "Prenotazioni", href: "/gestione/prenotazioni", Icon: IconPrenotazioni },
  // Le voci senza "contatoreKey" restano senza pillola: nessun dato
  // reale ancora disponibile per loro (es. "prenotazioni da
  // confermare" non esiste nel modello dati — stato è confermata/
  // cancellata/completata/no-show, nessuno stato "in attesa" da
  // contare). Inventare un numero solo per riempire la voce sarebbe
  // fabbricare un significato che i dati non hanno.
];

export function SidebarNav({
  onNavigate,
  contatori,
}: {
  onNavigate?: () => void;
  contatori?: Contatori;
}) {
  const pathname = usePathname();

  return (
    <nav>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/gestione"
            ? pathname === "/gestione"
            : pathname.startsWith(item.href);
        const contatore = item.contatoreKey ? contatori?.[item.contatoreKey] : undefined;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              // min-h-11: area di tocco da 44px, sotto la quale il dito
              // manca il bersaglio.
              "flex min-h-11 items-center gap-3 border-l-[3px] px-[21px] py-2.5 font-sans text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cream-text",
              isActive
                ? "border-admin-brick text-cream-text"
                : "border-transparent text-muted-dark hover:text-cream-text",
            )}
          >
            <item.Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-cream-text" : "text-muted-dark")} />
            <span className="flex-1">{item.label}</span>
            {contatore ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-admin-brick px-1 font-sans text-[11px] font-medium text-cream-text">
                {contatore}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
