import Link from "next/link";
import { Section } from "@/src/components/ui/Section";
import { EditorialDishCard } from "./EditorialDishCard";
import type { FeaturedDish } from "./FeaturedDishSlide";

interface BarCocktailPreviewProps {
  dishes: FeaturedDish[];
}

// Tema scuro. Layout editoriale (foto + nome/descrizione, nessun
// prezzo) — stessa logica del blocco "Piatti in evidenza", non più
// un elenco compatto di righe. Contrasto: text-cream-text su bg-dark
// ≈ 17.6:1, text-muted-dark su bg-dark ≈ 12.2:1 — oltre 4.5:1.
export function BarCocktailPreview({ dishes }: BarCocktailPreviewProps) {
  if (dishes.length === 0) return null;

  return (
    <Section tone="dark" id="cocktail">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
        Cocktail &amp; Bar
      </p>
      <div className="space-y-14">
        {dishes.map((dish, index) => (
          <EditorialDishCard
            key={dish.id}
            dish={dish}
            tone="dark"
            reverse={index % 2 === 1}
          />
        ))}
      </div>
      <div className="mt-12">
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
