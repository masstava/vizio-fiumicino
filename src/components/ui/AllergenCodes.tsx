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

  return (
    <span
      className={cn(
        "font-sans text-[10px] tracking-wider",
        tone === "light" ? "text-muted" : "text-muted-dark",
        className,
      )}
      title={`Allergeni: ${codes.join(", ")}`}
    >
      {codes.join(" ")}
    </span>
  );
}
