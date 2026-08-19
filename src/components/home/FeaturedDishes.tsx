import { Section } from "@/src/components/ui/Section";
import { FeaturedDishSlide, type FeaturedDish } from "./FeaturedDishSlide";
import { FeaturedDishesSlider } from "./FeaturedDishesSlider";

interface FeaturedDishesProps {
  dishes: FeaturedDish[];
}

// Tema scuro. 0 piatti in evidenza → sezione assente (niente da
// mostrare). 1 → blocco fisso, senza slider. 2-3 → slider con
// puntini. Contrasto: text-cream-text su bg-dark ≈ 17.6:1,
// text-muted-dark su bg-dark ≈ 12.2:1 — oltre la soglia 4.5:1.
export function FeaturedDishes({ dishes }: FeaturedDishesProps) {
  if (dishes.length === 0) return null;

  return (
    <Section tone="dark" id="piatti-in-evidenza">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
        In evidenza
      </p>
      {dishes.length === 1 ? (
        <FeaturedDishSlide dish={dishes[0]} />
      ) : (
        <FeaturedDishesSlider dishes={dishes} />
      )}
    </Section>
  );
}
