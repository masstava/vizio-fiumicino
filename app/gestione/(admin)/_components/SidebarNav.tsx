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
  { label: "Badge", href: "/gestione/badge" },
] as const;

export function SidebarNav() {
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
            className={cn(
              "flex items-center px-6 py-2.5 font-sans text-sm transition-colors",
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
