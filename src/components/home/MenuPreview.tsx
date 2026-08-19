import Link from "next/link";
import { DishRow, type DishData } from "@/src/components/ui/DishRow";
import { Section } from "@/src/components/ui/Section";

interface MenuPreviewProps {
  dishes: DishData[];
}

// Tema chiaro. Il mix foto/no-foto è già gestito da DishRow stesso
// (fallback automatico a ImagePlaceholder quando foto_url è vuoto),
// nessuna logica aggiuntiva necessaria qui.
export function MenuPreview({ dishes }: MenuPreviewProps) {
  if (dishes.length === 0) return null;

  return (
    <Section tone="light">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        Il menu
      </p>
      <div>
        {dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} tone="light" />
        ))}
      </div>
      <div className="mt-8">
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
