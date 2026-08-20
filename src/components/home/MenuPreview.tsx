import Link from "next/link";
import { Section } from "@/src/components/ui/Section";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { CompactDishCard, type HybridDish } from "./CompactDishCard";
import { EditorialDishCard } from "./EditorialDishCard";

interface MenuPreviewProps {
  dishes: HybridDish[];
  locale: Locale;
}

// Tema chiaro. Layout ibrido: il primo piatto ha trattamento
// editoriale (foto grande + testo, come "Piatti in evidenza"); il
// resto va in una griglia compatta (foto piccola, nome, un badge se
// presente) — il layout editoriale ripetuto su ogni voce era troppo
// dispersivo senza foto reali per tutti i piatti. Il prezzo resta
// sempre visibile nella pagina menu completo raggiunta dalla CTA, che
// qui non cambia.
export function MenuPreview({ dishes, locale }: MenuPreviewProps) {
  if (dishes.length === 0) return null;
  const t = getDizionario(locale);

  const [hero, ...rest] = dishes;

  return (
    <Section tone="light" id="menu">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        {t.sezioni.ilMenu}
      </p>
      <div className="space-y-10">
        <EditorialDishCard dish={hero} tone="light" />
        {rest.length > 0 && (
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
            {rest.map((dish) => (
              <CompactDishCard
                  key={dish.id}
                  dish={dish}
                  tone="light"
                  locale={locale}
                />
            ))}
          </div>
        )}
      </div>
      <div className="mt-10">
        <Link
          href={localizedPath("/menu", locale)}
          className="font-sans text-sm font-medium text-bordeaux underline underline-offset-4 hover:opacity-80"
        >
          {t.cta.menuCompleto}
        </Link>
      </div>
    </Section>
  );
}
