import { cn } from "@/src/lib/utils";

interface PriceTagProps {
  price: number;
  variable?: boolean;
  tone?: "light" | "dark";
  className?: string;
}

export function PriceTag({
  price,
  variable = false,
  tone = "light",
  className,
}: PriceTagProps) {
  const formatted = price.toFixed(2).replace(".", ",");

  return (
    <span
      className={cn(
        "font-sans italic font-semibold whitespace-nowrap tabular-nums",
        tone === "light" ? "text-bordeaux" : "text-gold",
        className,
      )}
    >
      {formatted}€{variable ? " / hg" : ""}
    </span>
  );
}
