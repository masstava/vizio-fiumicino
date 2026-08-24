"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/gestione" },
  { label: "Menu", href: "/gestione/menu" },
  { label: "Testi della home", href: "/gestione/contenuti" },
  { label: "Orari", href: "/gestione/orari" },
  { label: "Eventi", href: "/gestione/eventi" },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav>
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/gestione"
            ? pathname === "/gestione"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              // min-h-11: area di tocco da 44px, sotto la quale il dito
              // manca il bersaglio.
              "flex min-h-11 items-center px-6 py-2.5 font-sans text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cream-text",
              isActive
                ? "text-cream-text bg-cream-text/5 border-l border-gold"
                : "text-muted-dark hover:text-cream-text ml-[1px]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
