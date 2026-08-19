import { createClient } from "@/src/lib/supabase/server";
import { FeaturedDishes } from "@/src/components/home/FeaturedDishes";
import type { FeaturedDish } from "@/src/components/home/FeaturedDishSlide";
import { Hero } from "@/src/components/home/Hero";
import { StickyReservationBar } from "@/src/components/home/StickyReservationBar";
import { ThreePillars } from "@/src/components/home/ThreePillars";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const { data: evidenzaLinks } = await supabase
    .from("piatti_in_evidenza")
    .select("piatto_id, ordine")
    .order("ordine");

  const evidenzaIds = (evidenzaLinks ?? []).map((e) => e.piatto_id);

  const { data: evidenzaPiatti } = evidenzaIds.length
    ? await supabase
        .from("piatti")
        .select("id, nome, descrizione, foto_url")
        .in("id", evidenzaIds)
        .eq("disponibile", true)
    : { data: [] as FeaturedDish[] };

  const piattoById = new Map((evidenzaPiatti ?? []).map((p) => [p.id, p]));
  const featuredDishes: FeaturedDish[] = (evidenzaLinks ?? [])
    .map((e) => piattoById.get(e.piatto_id))
    .filter((p): p is FeaturedDish => p != null);

  return (
    <main>
      <StickyReservationBar />
      <Hero />
      <ThreePillars />
      <FeaturedDishes dishes={featuredDishes} />
    </main>
  );
}
