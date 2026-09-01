"use client";

import { cn } from "@/src/lib/utils";
import { StatusBadge, type StatusBadgeTono } from "./StatusBadge";

// Stato che si può anche CAMBIARE, non solo leggere — a differenza di
// StatusBadge (pensata per una lista di sola lettura, § "Badge di
// stato" in DASHBOARD_DESIGN_SYSTEM.md). Stessa pillola visiva, ma
// dentro un <button role="switch">: il click cambia lo stato, la
// pillola ne mostra il risultato.
//
// data-tocco-esteso riusa la stessa regola CSS globale già usata da
// Switch (app/globals.css) per estendere l'area di tocco a 44×44px
// sotto md senza ingrandire la pillola visibile — nessuna nuova
// regola CSS necessaria.
export function StatusToggle({
  checked,
  onChange,
  disabled = false,
  tonoOn,
  testoOn,
  tonoOff,
  testoOff,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  tonoOn: StatusBadgeTono;
  testoOn: string;
  tonoOff: StatusBadgeTono;
  testoOff: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      data-tocco-esteso
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <StatusBadge tono={checked ? tonoOn : tonoOff}>
        {checked ? testoOn : testoOff}
      </StatusBadge>
    </button>
  );
}
