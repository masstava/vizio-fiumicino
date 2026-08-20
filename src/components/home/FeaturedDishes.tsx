import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { FlameAccent } from "@/src/components/ui/FlameAccent";
import { Section } from "@/src/components/ui/Section";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { FeaturedDishSlide, type FeaturedDish } from "./FeaturedDishSlide";
import { FeaturedDishesSlider } from "./FeaturedDishesSlider";

interface FeaturedDishesProps {
  dishes: FeaturedDish[];
  locale: Locale;
}

// Tema scuro. 0 piatti in evidenza → sezione assente (niente da
// mostrare). 1 → blocco fisso, senza slider. 2-3 → slider con
// puntini. Contrasto: text-cream-text su bg-dark ≈ 17.6:1,
// text-muted-dark su bg-dark ≈ 12.2:1 — oltre la soglia 4.5:1.
export function FeaturedDishes({ dishes, locale }: FeaturedDishesProps) {
  if (dishes.length === 0) return null;
  const t = getDizionario(locale);

  return (
    <Section
      tone="dark"
      id="piatti-in-evidenza"
      className="relative isolate overflow-hidden"
    >
      <DarkSectionAccent />
      <div className="relative">
        <p className="mb-8 flex items-center gap-2 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
          <FlameAccent className="h-3.5" />
          {t.sezioni.inEvidenza}
        </p>
        {dishes.length === 1 ? (
          <FeaturedDishSlide dish={dishes[0]} locale={locale} />
        ) : (
          <FeaturedDishesSlider dishes={dishes} locale={locale} />
        )}
      </div>
    </Section>
  );
}
