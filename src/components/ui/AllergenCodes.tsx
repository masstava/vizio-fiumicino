import { cn } from "@/src/lib/utils";

interface AllergenCodesProps {
  codes: number[];
  tone?: "light" | "dark";
  className?: string;
}

export function AllergenCodes({
  codes,
  tone = "light",
  className,
}: AllergenCodesProps) {
  if (codes.length === 0) return null;

  // Unica fonte di verità per l'ordine di visualizzazione: sempre
  // crescente, indipendentemente da come arriva l'array in ingresso
  // (dati grezzi dal DB, selezione locale nel form, ecc.).
  const sorted = [...codes].sort((a, b) => a - b);

  return (
    <span
      className={cn(
        "font-sans text-[10px] tracking-wider",
        tone === "light" ? "text-muted" : "text-muted-dark",
        className,
      )}
      title={`Allergeni: ${sorted.join(", ")}`}
    >
      {sorted.join(" ")}
    </span>
  );
}
