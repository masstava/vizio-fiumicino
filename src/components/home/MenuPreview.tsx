import Link from "next/link";
import { Section } from "@/src/components/ui/Section";
import { EditorialDishCard } from "./EditorialDishCard";
import type { FeaturedDish } from "./FeaturedDishSlide";

interface MenuPreviewProps {
  dishes: FeaturedDish[];
}

// Tema chiaro. Layout editoriale (foto + nome/descrizione, nessun
// prezzo) — stessa logica del blocco "Piatti in evidenza", non più
// un elenco compatto di righe. Il prezzo resta sempre visibile nella
// pagina menu completo raggiunta dalla CTA, che qui non cambia.
export function MenuPreview({ dishes }: MenuPreviewProps) {
  if (dishes.length === 0) return null;

  return (
    <Section tone="light" id="menu">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        Il menu
      </p>
      <div className="space-y-14">
        {dishes.map((dish, index) => (
          <EditorialDishCard
            key={dish.id}
            dish={dish}
            tone="light"
            reverse={index % 2 === 1}
          />
        ))}
      </div>
      <div className="mt-12">
        <Link
          href="/menu"
          className="font-sans text-sm font-medium text-bordeaux underline underline-offset-4 hover:opacity-80"
        >
          Vedi il menu completo
        </Link>
      </div>
    </Section>
  );
}
