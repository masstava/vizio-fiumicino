"use client";

import type { ReactNode } from "react";

interface AccordionSectionProps {
  open: boolean;
  onToggle: () => void;
  header: ReactNode;
  headerClassName?: string;
  children: ReactNode;
}

// Trucco CSS puro per animare l'apertura/chiusura senza misurare
// l'altezza via JS: la riga della grid passa da 0fr a 1fr, il
// contenuto interno (overflow-hidden) segue l'altezza della riga.
// Transizione breve (180ms) per restare percettibile ma non invadente.
export function AccordionSection({
  open,
  onToggle,
  header,
  headerClassName,
  children,
}: AccordionSectionProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        // min-h-11 sotto md: le intestazioni sono l'unico modo per
        // aprire una categoria, e a 380px erano alte 15px.
        className={`flex min-h-11 w-full items-center justify-between gap-2 text-left cursor-pointer md:min-h-0 ${headerClassName ?? ""}`}
      >
        {header}
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3 w-3 shrink-0 text-muted transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-150 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
