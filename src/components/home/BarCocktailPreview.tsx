import Link from "next/link";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { FlameAccent } from "@/src/components/ui/FlameAccent";
import { Section } from "@/src/components/ui/Section";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { CompactDishCard, type HybridDish } from "./CompactDishCard";
import { EditorialDishCard } from "./EditorialDishCard";

interface BarCocktailPreviewProps {
  dishes: HybridDish[];
  locale: Locale;
}

// Tema scuro. Layout ibrido: il primo drink ha trattamento editoriale
// (foto grande + testo); il resto va in una griglia compatta (foto
// piccola, nome, un badge se presente) — stessa logica di MenuPreview.
// Contrasto: text-cream-text su bg-dark ≈ 17.6:1, text-muted-dark su
// bg-dark ≈ 12.2:1 — oltre 4.5:1.
export function BarCocktailPreview({ dishes, locale }: BarCocktailPreviewProps) {
  if (dishes.length === 0) return null;
  const t = getDizionario(locale);

  const [hero, ...rest] = dishes;

  return (
    <Section
      tone="dark"
      id="cocktail"
      className="relative isolate overflow-hidden"
    >
      <DarkSectionAccent />
      <div className="relative">
        <p className="mb-8 flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
          <FlameAccent className="h-3.5" />
          {t.sezioni.cocktailBar}
        </p>
        <div className="space-y-10">
          <EditorialDishCard dish={hero} tone="dark" />
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-3">
              {rest.map((dish) => (
                <CompactDishCard key={dish.id} dish={dish} tone="dark" />
              ))}
            </div>
          )}
        </div>
        <div className="mt-10">
          <Link
            href={localizedPath("/menu", locale)}
            className="font-sans text-sm font-medium text-gold underline underline-offset-4 hover:opacity-80"
          >
            {t.cta.menuCompleto}
          </Link>
        </div>
      </div>
    </Section>
  );
}
