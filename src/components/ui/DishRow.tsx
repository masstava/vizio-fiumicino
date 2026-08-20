import Image from "next/image";
import { cn } from "@/src/lib/utils";
import { Badge } from "./Badge";
import { PriceTag } from "./PriceTag";
import { AllergenCodes } from "./AllergenCodes";
import { ImagePlaceholder } from "./ImagePlaceholder";

// NOTA: questo tipo resta qui di proposito, e non in src/lib/dominio.
// DishRow è usato solo dalla dashboard, dove descrive la riga di un
// elenco redazionale (prezzo, allergeni come codici numerici, badge
// multipli) — una forma diversa da quella che serve al sito pubblico.
// Andrà spostato quando la pagina menu completo dirà se la riusa:
// consolidarlo adesso, senza sapere che forma le servirà, vorrebbe
// dire indovinare.
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
  const hasBadges = dish.badges && dish.badges.length > 0;
  const hasAllergeni = dish.allergeni && dish.allergeni.length > 0;
  const hasMeta = hasBadges || hasAllergeni;

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

        {/* Badges e Allergeni — sempre su righe separate */}
        {hasMeta && (
          <div className="mt-2 flex flex-col gap-1.5">
            {hasBadges && (
              <div className="flex flex-wrap gap-2">
                {dish.badges!.map((text) => (
                  <Badge key={text} variant={tone === "dark" ? "dark" : "light"}>
                    {text}
                  </Badge>
                ))}
              </div>
            )}
            {hasAllergeni && (
              <AllergenCodes codes={dish.allergeni!} tone={tone} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
