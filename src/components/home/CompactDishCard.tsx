import Image from "next/image";
import { Badge } from "@/src/components/ui/Badge";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { cn } from "@/src/lib/utils";
import type { PiattoConBadge } from "@/src/lib/dominio";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { DishDetailDialog } from "./DishDetailDialog";

interface CompactDishCardProps {
  dish: PiattoConBadge;
  tone?: "light" | "dark";
  locale: Locale;
}

// Voce compatta della griglia (tutto tranne il piatto "hero" della
// sezione, che usa EditorialDishCard): foto piccola, nome, un solo
// badge se presente nei dati. Niente descrizione, niente prezzo — qui
// serve dare il senso della varietà del menu, non essere esaustivi
// (quello è il compito della pagina menu completo).
//
// La card è un pulsante che apre la scheda di dettaglio: senza, di
// questi piatti resterebbe visibile solo il nome.
export function CompactDishCard({
  dish,
  tone = "light",
  locale,
}: CompactDishCardProps) {
  const t = getDizionario(locale);

  return (
    <DishDetailDialog dish={dish} locale={locale}>
      <button
        type="button"
        aria-label={t.piatto.apriDettaglio(dish.nome)}
        // Sollevamento all'hover in CSS e non con Motion: è uno stato
        // puramente visivo, il browser lo compone sulla GPU senza
        // passare dal thread principale. Farlo in JavaScript
        // aggiungerebbe lavoro a ogni movimento del puntatore, che è
        // esattamente ciò che peggiora l'INP.
        // Solo transform e opacity: nessun ricalcolo di layout.
        className={cn(
          "flex w-full items-center gap-3 rounded-sm text-left",
          "transition-[transform,opacity] duration-200 ease-out will-change-transform",
          "hover:-translate-y-0.5 hover:opacity-90",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
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
      </button>
    </DishDetailDialog>
  );
}
