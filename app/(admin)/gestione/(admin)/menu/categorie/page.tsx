import { createClient } from "@/src/lib/supabase/server";
import { ruoloMacro } from "@/src/lib/ruolo-macro";
import { SchedeMenu } from "../_components/SchedeMenu";
import { EditorCategorie } from "./_components/EditorCategorie";
import type { MacroEditor } from "./_lib/tipi";

export const dynamic = "force-dynamic";

export default async function CategoriePage() {
  const supabase = await createClient();

  const [{ data: macros, error: e1 }, { data: categorie, error: e2 }, { data: piatti, error: e3 }] =
    await Promise.all([
      supabase.from("categorie_macro").select("id, nome, nome_en, ordine, ruolo").order("ordine"),
      supabase.from("categorie").select("id, nome, nome_en, ordine, categoria_macro_id").order("ordine"),
      // Solo la colonna che serve al conteggio per categoria.
      supabase.from("piatti").select("categoria_id"),
    ]);
  const errore = e1 ?? e2 ?? e3;
  if (errore) throw new Error(errore.message);

  const piattiPerCategoria = new Map<string, number>();
  (piatti ?? []).forEach((p) =>
    piattiPerCategoria.set(p.categoria_id, (piattiPerCategoria.get(p.categoria_id) ?? 0) + 1),
  );

  const macro: MacroEditor[] = (macros ?? []).map((m) => ({
    id: m.id,
    nome: m.nome,
    nomeEn: m.nome_en,
    ruolo: ruoloMacro(m.ruolo),
    categorie: (categorie ?? [])
      .filter((c) => c.categoria_macro_id === m.id)
      .map((c) => ({
        id: c.id,
        nome: c.nome,
        nomeEn: c.nome_en,
        piatti: piattiPerCategoria.get(c.id) ?? 0,
      })),
  }));

  return (
    <div className="p-8 md:p-12">
      <SchedeMenu />
      <EditorCategorie macro={macro} />
    </div>
  );
}
