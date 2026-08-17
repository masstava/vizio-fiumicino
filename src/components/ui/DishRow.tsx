import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { Badge } from "./Badge";
import { PriceTag } from "./PriceTag";
import { AllergenCodes } from "./AllergenCodes";
import { ImagePlaceholder } from "./ImagePlaceholder";

export interface DishData {
  id: string;
  nome: string;
  descrizione?: string | null;
  prezzo?: number | null;
  prezzo_variabile?: boolean;
  foto_url?: string | null;
  allergeni?: number[];
  badges?: string[];
}

interface DishRowProps {
  dish: DishData;
  tone?: "light" | "dark";
  className?: string;
}

export function DishRow({ dish, tone = "light", className }: DishRowProps) {
  const hasMeta =
    (dish.badges && dish.badges.length > 0) ||
    (dish.allergeni && dish.allergeni.length > 0);

  return (
    <div
      className={cn(
        "flex gap-4 items-start py-5",
        "border-b",
        tone === "light" ? "border-ink/10" : "border-cream-text/10",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-[2px]">
        {dish.foto_url ? (
          <Image
            src={dish.foto_url}
            alt={dish.nome}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder seed={dish.id} className="h-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + Price */}
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              "font-serif font-medium text-lg leading-snug",
              tone === "light" ? "text-ink" : "text-cream-text",
            )}
          >
            {dish.nome}
          </h3>
          {dish.prezzo != null && (
            <PriceTag
              price={dish.prezzo}
              variable={dish.prezzo_variabile}
              tone={tone}
            />
          )}
        </div>

        {/* Description */}
        {dish.descrizione && (
          <p
            className={cn(
              "font-sans text-sm mt-0.5 leading-relaxed",
              tone === "light" ? "text-muted" : "text-muted-dark",
            )}
          >
            {dish.descrizione}
          </p>
        )}

        {/* Badges + Allergens */}
        {hasMeta && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {dish.badges?.map((text) => (
              <Badge key={text} variant={tone === "dark" ? "dark" : "light"}>
                {text}
              </Badge>
            ))}
            {dish.allergeni && dish.allergeni.length > 0 && (
              <AllergenCodes codes={dish.allergeni} tone={tone} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
