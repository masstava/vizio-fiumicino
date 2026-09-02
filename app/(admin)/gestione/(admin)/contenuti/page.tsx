import { createClient } from "@/src/lib/supabase/server";
import { SchedeGestioneSito } from "./_components/SchedeGestioneSito";
import { SelezioneHomeForm } from "./_components/SelezioneHomeForm";
import type { PiattoCatalogo } from "./_components/types";

export const dynamic = "force-dynamic";

const MASSIMO_EVIDENZA = 3;
const MASSIMO_ANTEPRIMA = 8;

export default async function GestioneSitoHomePage() {
  const supabase = await createClient();

  // Quattro letture indipendenti: partono insieme.
  const [
    { data: piatti },
    { data: categorie },
    { data: evidenzaRows },
    { data: anteprimaRows },
  ] = await Promise.all([
    supabase
      .from("piatti")
      .select("id, nome, foto_url, categoria_id")
      .eq("disponibile", true)
      .order("nome"),
    supabase.from("categorie").select("id, nome"),
    supabase.from("piatti_in_evidenza").select("piatto_id, ordine").order("ordine"),
    supabase.from("piatti_anteprima_home").select("piatto_id, ordine").order("ordine"),
  ]);

  const categoriaNomeById = new Map((categorie ?? []).map((c) => [c.id, c.nome]));

  const catalogo: PiattoCatalogo[] = (piatti ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    categoria: categoriaNomeById.get(p.categoria_id) ?? "",
    fotoUrl: p.foto_url,
  }));

  const catalogoById = new Map(catalogo.map((p) => [p.id, p]));

  const initialEvidenza = (evidenzaRows ?? [])
    .map((r) => catalogoById.get(r.piatto_id))
    .filter((p): p is PiattoCatalogo => p != null);

  const initialAnteprima = (anteprimaRows ?? [])
    .map((r) => catalogoById.get(r.piatto_id))
    .filter((p): p is PiattoCatalogo => p != null);

  return (
    <div className="p-8 md:p-12">
      <SchedeGestioneSito />
      <p className="font-sans text-sm text-admin-text-2 mb-8 max-w-2xl">
        Scegli quali piatti e drink compaiono in home. Riguarda solo la
        presentazione: i piatti restano quelli del menu, qui decidi solo
        quali mettere in mostra.
      </p>
      <SelezioneHomeForm
        catalogo={catalogo}
        initialEvidenza={initialEvidenza}
        initialAnteprima={initialAnteprima}
        massimoEvidenza={MASSIMO_EVIDENZA}
        massimoAnteprima={MASSIMO_ANTEPRIMA}
      />
    </div>
  );
}
