import Image from "next/image";
import Link from "next/link";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";

export interface FeaturedDish {
  id: string;
  nome: string;
  descrizione: string | null;
  foto_url: string | null;
}

// Presentazione condivisa tra il blocco fisso (1 piatto) e lo slider
// (2-3 piatti) — nessun prezzo mostrato di proposito: questo blocco è
// una leva di desiderio, non un punto di ordinazione. Il prezzo
// compare sempre nella pagina menu completo, verso cui punta la CTA.
export function FeaturedDishSlide({ dish }: { dish: FeaturedDish }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
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
      <div>
        <h3 className="mb-3 font-serif text-3xl font-medium text-cream-text">
          {dish.nome}
        </h3>
        {dish.descrizione && (
          <p className="mb-6 font-sans text-sm leading-relaxed text-muted-dark">
            {dish.descrizione}
          </p>
        )}
        <Link
          href="/menu"
          className="font-sans text-sm font-medium text-gold underline underline-offset-4 hover:opacity-80"
        >
          Vedi il menu completo
        </Link>
      </div>
    </div>
  );
}
