"use client";

import { cn } from "@/src/lib/utils";
import { TONI_STATUS, type StatusBadgeTono } from "./StatusBadge";

// Stessa pillola-pallino di StatusBadge/StatusToggle, ma per uno stato
// con PIÙ di due valori (qui: le 4 prenotazioni reali) — StatusToggle
// resta binario di proposito (§ Badge di stato in
// DASHBOARD_DESIGN_SYSTEM.md), qui serve scegliere fra N opzioni.
// Riusa TONI_STATUS di StatusBadge.tsx invece di una copia propria: un
// solo posto dove i quattro colori sono definiti.
//
// Sotto, resta un <select> nativo — tastiera, screen reader e lista
// delle opzioni funzionano esattamente come un select qualunque. Sopra,
// una pillola puramente decorativa (aria-hidden, pointer-events-none)
// mostra pallino+testo colorati in base al tono dell'opzione corrente.
// Il select è nella stessa posizione della pillola ma invisibile
// (opacity-0, non display:none): resta nell'albero di accessibilità e
// cattura click/tastiera, la pillola sotto è solo la sua veste visiva.

export interface StatusSelectOption<T extends string> {
  valore: T;
  etichetta: string;
  tono: StatusBadgeTono;
}

export function StatusSelect<T extends string>({
  value,
  options,
  onChange,
  disabled = false,
  ariaLabel,
  className,
}: {
  value: T;
  options: StatusSelectOption<T>[];
  onChange: (next: T) => void;
  disabled?: boolean;
  ariaLabel: string;
  className?: string;
}) {
  const corrente = options.find((o) => o.valore === value) ?? options[0];
  const t = TONI_STATUS[corrente.tono];

  return (
    <div className={cn("relative inline-flex items-center rounded-full", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        aria-label={ariaLabel}
        data-tocco-esteso
        className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 opacity-0 disabled:cursor-not-allowed"
      >
        {options.map((o) => (
          <option key={o.valore} value={o.valore}>
            {o.etichetta}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-xs font-medium peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-admin-brick/60",
          disabled ? "opacity-50" : "",
          t.testo,
          t.sfondo,
        )}
      >
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", t.pallino)} />
        {corrente.etichetta}
      </span>
    </div>
  );
}
