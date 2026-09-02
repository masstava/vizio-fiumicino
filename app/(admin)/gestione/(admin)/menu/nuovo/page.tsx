import { createClient } from "@/src/lib/supabase/server";
import { DishForm } from "../_components/DishForm";
import type { CategoriaGroupOption } from "../_components/types";

export const dynamic = "force-dynamic";

export default async function NuovoPiattoPage() {
  const supabase = await createClient();

  const [{ data: macros }, { data: categorie }, { data: allergeni }] =
    await Promise.all([
      supabase.from("categorie_macro").select("id, nome, ordine").order("ordine"),
      supabase
        .from("categorie")
        .select("id, nome, ordine, categoria_macro_id")
        .order("ordine"),
      supabase.from("allergeni").select("id, nome_it").order("id"),
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
      <DishForm
        mode="create"
        categorieGrouped={categorieGrouped}
        allergeniList={allergeni ?? []}
      />
    </div>
  );
}
