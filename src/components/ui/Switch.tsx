"use client";

import { cn } from "@/src/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  /**
   * Mostra l'etichetta solo ai lettori di schermo. Serve dove il nome
   * della voce è già scritto accanto all'interruttore (una riga con
   * titolo e descrizione a sinistra): ripeterlo a schermo sarebbe
   * rumore, ma senza, il <button role="switch"> resterebbe privo di
   * nome accessibile.
   */
  labelNascosta?: boolean;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
  labelNascosta = false,
  className,
}: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        // L'interruttore visibile è 36x20: troppo piccolo per il dito.
        // Lo pseudo-elemento estende l'area sensibile a 44x44 senza
        // cambiare l'aspetto. Ingrandire la <label> non servirebbe:
        // una label che avvolge un <button> non gli inoltra il clic.
        data-tocco-esteso
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-9 h-5 flex-shrink-0 rounded-[2px] border transition-colors duration-150",
          checked ? "bg-bordeaux border-bordeaux" : "bg-transparent border-ink/30",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-[1px] transition-transform duration-150",
            checked ? "translate-x-4 bg-cream-text" : "translate-x-0 bg-ink/40",
          )}
        />
      </button>
      {label && (
        <span
          className={
            labelNascosta ? "sr-only" : "font-sans text-sm text-ink"
          }
        >
          {label}
        </span>
      )}
    </label>
  );
}
