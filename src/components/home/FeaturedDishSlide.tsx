import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/src/components/ui/Badge";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

export interface FeaturedDish {
  id: string;
  nome: string;
  descrizione: string | null;
  foto_url: string | null;
  badge?: string | null;
}

// Presentazione condivisa tra il blocco fisso (1 piatto) e lo slider
// (2-3 piatti) — nessun prezzo mostrato di proposito: questo blocco è
// una leva di desiderio, non un punto di ordinazione. Il prezzo
// compare sempre nella pagina menu completo, verso cui punta la CTA.
export function FeaturedDishSlide({
  dish,
  locale,
}: {
  dish: FeaturedDish;
  locale: Locale;
}) {
  const t = getDizionario(locale);
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
        {dish.badge && (
          <Badge variant="dark" className="mb-3">
            {dish.badge}
          </Badge>
        )}
        {dish.descrizione && (
          <p className="mb-6 font-sans text-sm leading-relaxed text-muted-dark">
            {dish.descrizione}
          </p>
        )}
        <Link
          href={localizedPath("/menu", locale)}
          className="font-sans text-sm font-medium text-gold underline underline-offset-4 hover:opacity-80"
        >
          {t.cta.menuCompleto}
        </Link>
      </div>
    </div>
  );
}
