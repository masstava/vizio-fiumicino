import { createClient } from "@/src/lib/supabase/server";
import { DishForm } from "../_components/DishForm";
import type { CategoriaGroupOption } from "../_components/types";

export const dynamic = "force-dynamic";

export default async function NuovoPiattoPage() {
  const supabase = await createClient();

  const [
    { data: macros },
    { data: categorie },
    { data: allergeni },
    { count: evidenzaCount },
    { count: anteprimaCount },
  ] = await Promise.all([
    supabase.from("categorie_macro").select("id, nome, ordine").order("ordine"),
    supabase
      .from("categorie")
      .select("id, nome, ordine, categoria_macro_id")
      .order("ordine"),
    supabase.from("allergeni").select("id, nome_it").order("id"),
    supabase
      .from("piatti_in_evidenza")
      .select("piatto_id", { count: "exact", head: true }),
    supabase
      .from("piatti_anteprima_home")
      .select("piatto_id", { count: "exact", head: true }),
  ]);

  const categorieGrouped: CategoriaGroupOption[] = (macros ?? []).map((m) => ({
    macroId: m.id,
    macroNome: m.nome,
    categorie: (categorie ?? [])
      .filter((c) => c.categoria_macro_id === m.id)
      .map((c) => ({ id: c.id, nome: c.nome })),
  }));

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione · Menu
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-8">
        Nuovo piatto
      </h1>
      <DishForm
        mode="create"
        categorieGrouped={categorieGrouped}
        allergeniList={allergeni ?? []}
        otherEvidenzaCount={evidenzaCount ?? 0}
        otherAnteprimaCount={anteprimaCount ?? 0}
      />
    </div>
  );
}
