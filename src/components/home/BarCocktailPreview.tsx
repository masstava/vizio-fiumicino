import Link from "next/link";
import { DishRow, type DishData } from "@/src/components/ui/DishRow";
import { Section } from "@/src/components/ui/Section";

interface BarCocktailPreviewProps {
  dishes: DishData[];
}

// Tema scuro. Stessa fonte dati e stesso componente (DishRow) del
// blocco Menu — qui prezzo/allergeni/badge restano visibili, non è
// un blocco "leva di desiderio" come i piatti in evidenza.
export function BarCocktailPreview({ dishes }: BarCocktailPreviewProps) {
  if (dishes.length === 0) return null;

  return (
    <Section tone="dark">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
        Cocktail &amp; Bar
      </p>
      <div>
        {dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} tone="dark" />
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/menu"
          className="font-sans text-sm font-medium text-gold underline underline-offset-4 hover:opacity-80"
        >
          Vedi il menu completo
        </Link>
      </div>
    </Section>
  );
}
