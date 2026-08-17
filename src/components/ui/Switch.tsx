"use client";

import { cn } from "@/src/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
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
      {label && <span className="font-sans text-sm text-ink">{label}</span>}
    </label>
  );
}
