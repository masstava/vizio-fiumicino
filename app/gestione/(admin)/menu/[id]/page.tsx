import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { DishForm } from "../_components/DishForm";
import type { CategoriaGroupOption } from "../_components/types";

export const dynamic = "force-dynamic";

export default async function ModificaPiattoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: piatto },
    { data: macros },
    { data: categorie },
    { data: allergeni },
    { data: allergeniLinks },
    { data: badgeLinks },
    { data: evidenzaRow },
    { count: otherEvidenzaCount },
  ] = await Promise.all([
    supabase.from("piatti").select("*").eq("id", id).maybeSingle(),
    supabase.from("categorie_macro").select("id, nome, ordine").order("ordine"),
    supabase
      .from("categorie")
      .select("id, nome, ordine, categoria_macro_id")
      .order("ordine"),
    supabase.from("allergeni").select("id, nome_it").order("id"),
    supabase.from("piatti_allergeni").select("allergene_id").eq("piatto_id", id),
    supabase.from("badge").select("testo, testo_en").eq("piatto_id", id),
    supabase
      .from("piatti_in_evidenza")
      .select("ordine")
      .eq("piatto_id", id)
      .maybeSingle(),
    supabase
      .from("piatti_in_evidenza")
      .select("piatto_id", { count: "exact", head: true })
      .neq("piatto_id", id),
  ]);

  if (!piatto) notFound();

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
        Modifica piatto
      </h1>
      <DishForm
        mode="edit"
        piattoId={piatto.id}
        categorieGrouped={categorieGrouped}
        allergeniList={allergeni ?? []}
        otherEvidenzaCount={otherEvidenzaCount ?? 0}
        initialData={{
          categoria_id: piatto.categoria_id,
          nome: piatto.nome,
          nome_en: piatto.nome_en ?? "",
          descrizione: piatto.descrizione ?? "",
          descrizione_en: piatto.descrizione_en ?? "",
          prezzo: piatto.prezzo != null ? String(piatto.prezzo) : "",
          prezzo_variabile: piatto.prezzo_variabile,
          disponibile: piatto.disponibile,
          foto_url: piatto.foto_url,
          allergeni: (allergeniLinks ?? []).map((a) => a.allergene_id),
          badges: (badgeLinks ?? []).map((b) => ({
            testo: b.testo,
            testo_en: b.testo_en ?? "",
          })),
          in_evidenza: !!evidenzaRow,
          in_evidenza_ordine: evidenzaRow?.ordine ?? 0,
        }}
      />
    </div>
  );
}
