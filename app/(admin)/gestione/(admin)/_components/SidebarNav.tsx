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
type Contatori = { menu?: number; eventi?: number; prenotazioni?: number; gestioneSito?: number };

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/gestione", Icon: IconDashboard },
  { label: "Menu", href: "/gestione/menu", Icon: IconMenu, contatoreKey: "menu" },
  { label: "Gestione sito", href: "/gestione/contenuti", Icon: IconTesti, contatoreKey: "gestioneSito" },
  { label: "Orari", href: "/gestione/orari", Icon: IconOrari },
  { label: "Eventi", href: "/gestione/eventi", Icon: IconEventi, contatoreKey: "eventi" },
  { label: "Prenotazioni", href: "/gestione/prenotazioni", Icon: IconPrenotazioni, contatoreKey: "prenotazioni" },
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
