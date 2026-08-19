import Image from "next/image";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { cn } from "@/src/lib/utils";
import type { FeaturedDish } from "./FeaturedDishSlide";

interface EditorialDishCardProps {
  dish: FeaturedDish;
  tone?: "light" | "dark";
  // Alterna il lato della foto per un ritmo da "articolo di rivista"
  // quando ci sono più card in sequenza — ignorato su mobile, dove
  // la foto resta sempre sopra al testo.
  reverse?: boolean;
}

// Layout editoriale (foto grande + nome/descrizione breve), stessa
// logica visiva di FeaturedDishSlide ma parametrizzata per tono e
// senza CTA propria — qui la CTA "Vedi il menu completo" è unica a
// fine sezione, non ripetuta per ogni piatto. Nessun prezzo: FeaturedDish
// non ha nemmeno il campo, quindi non può comparire per errore.
export function EditorialDishCard({
  dish,
  tone = "light",
  reverse = false,
}: EditorialDishCardProps) {
  const photo = (
    <div className="aspect-[4/3] overflow-hidden rounded-[2px]">
      {dish.foto_url ? (
        <Image
          src={dish.foto_url}
          alt={dish.nome}
          width={640}
          height={480}
          className="h-full w-full object-cover"
        />
      ) : (
        <ImagePlaceholder seed={dish.id} aspectRatio="4 / 3" />
      )}
    </div>
  );

  const text = (
    <div>
      <h3
        className={cn(
          "font-serif text-2xl font-medium md:text-3xl",
          tone === "light" ? "text-ink" : "text-cream-text",
        )}
      >
        {dish.nome}
      </h3>
      {dish.descrizione && (
        <p
          className={cn(
            "mt-3 font-sans text-sm leading-relaxed",
            tone === "light" ? "text-muted" : "text-muted-dark",
          )}
        >
          {dish.descrizione}
        </p>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
      <div className={reverse ? "md:order-2" : undefined}>{photo}</div>
      <div className={reverse ? "md:order-1" : undefined}>{text}</div>
    </div>
  );
}
