import Image from "next/image";
import { Badge } from "@/src/components/ui/Badge";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { cn } from "@/src/lib/utils";
import type { FeaturedDish } from "./FeaturedDishSlide";

export interface HybridDish extends FeaturedDish {
  badge: string | null;
}

interface CompactDishCardProps {
  dish: HybridDish;
  tone?: "light" | "dark";
}

// Voce compatta della griglia (tutto tranne il piatto "hero" della
// sezione, che usa EditorialDishCard): foto piccola, nome, un solo
// badge se presente nei dati. Niente descrizione, niente prezzo — qui
// serve dare il senso della varietà del menu, non essere esaustivi
// (quello è il compito della pagina menu completo).
export function CompactDishCard({ dish, tone = "light" }: CompactDishCardProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[2px]">
        {dish.foto_url ? (
          <Image
            src={dish.foto_url}
            alt={dish.nome}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder seed={dish.id} className="h-full" />
        )}
      </div>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate font-serif text-base font-medium",
            tone === "light" ? "text-ink" : "text-cream-text",
          )}
        >
          {dish.nome}
        </p>
        {dish.badge && (
          <Badge variant={tone === "dark" ? "dark" : "light"} className="mt-1">
            {dish.badge}
          </Badge>
        )}
      </div>
    </div>
  );
}
