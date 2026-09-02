import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { MenuListClient } from "./_components/MenuListClient";
import { NuovoPiattoAction } from "./_components/NuovoPiattoAction";
import type { MacroGroup, PiattoListItem } from "./_components/types";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const supabase = await createClient();

  const [
    { data: macros },
    { data: categorie },
    { data: piatti },
  ] = await Promise.all([
    supabase
      .from("categorie_macro")
      .select("id, nome, ordine")
      .order("ordine"),
    supabase
      .from("categorie")
      .select("id, nome, ordine, categoria_macro_id")
      .order("ordine"),
    supabase
      .from("piatti")
      .select(
        "id, nome, descrizione, prezzo, prezzo_variabile, disponibile, foto_url, ordine, categoria_id",
      )
      .order("ordine"),
  ]);

  const piattoIds = (piatti ?? []).map((p) => p.id);

  const [{ data: allergeniLinks }, { data: badgeLinks }] = await Promise.all([
    piattoIds.length
      ? supabase
          .from("piatti_allergeni")
          .select("piatto_id, allergene_id")
          .in("piatto_id", piattoIds)
      : Promise.resolve({ data: [] as { piatto_id: string; allergene_id: number }[] }),
    piattoIds.length
      ? supabase
          .from("badge")
          .select("piatto_id, testo")
          .in("piatto_id", piattoIds)
      : Promise.resolve({ data: [] as { piatto_id: string; testo: string }[] }),
  ]);

  const allergeniByPiatto = new Map<string, number[]>();
  (allergeniLinks ?? []).forEach((l) => {
    const arr = allergeniByPiatto.get(l.piatto_id) ?? [];
    arr.push(l.allergene_id);
    allergeniByPiatto.set(l.piatto_id, arr);
  });

  const badgeByPiatto = new Map<string, string[]>();
  (badgeLinks ?? []).forEach((b) => {
    const arr = badgeByPiatto.get(b.piatto_id) ?? [];
    arr.push(b.testo);
    badgeByPiatto.set(b.piatto_id, arr);
  });

  // Selezione curata dell'anteprima home: serve solo per gli avvisi
  // qui sotto (nessuno selezionato → la home ripiega su una scelta
  // automatica; troppi → torna a essere un elenco).
  const { count: anteprimaCount } = await supabase
    .from("piatti_anteprima_home")
    .select("piatto_id", { count: "exact", head: true });

  const categorieByMacro = new Map<string, NonNullable<typeof categorie>>();
  (categorie ?? []).forEach((c) => {
    const arr = categorieByMacro.get(c.categoria_macro_id) ?? [];
    arr.push(c);
    categorieByMacro.set(c.categoria_macro_id, arr);
  });

  const piattiByCategoria = new Map<string, NonNullable<typeof piatti>>();
  (piatti ?? []).forEach((p) => {
    const arr = piattiByCategoria.get(p.categoria_id) ?? [];
    arr.push(p);
    piattiByCategoria.set(p.categoria_id, arr);
  });

  const groups: MacroGroup[] = (macros ?? []).map((m) => ({
    id: m.id,
    nome: m.nome,
    categorie: (categorieByMacro.get(m.id) ?? []).map((c) => ({
      id: c.id,
      nome: c.nome,
      piatti: (piattiByCategoria.get(c.id) ?? []).map(
        (p): PiattoListItem => ({
          id: p.id,
          nome: p.nome,
          descrizione: p.descrizione,
          prezzo: p.prezzo,
          prezzo_variabile: p.prezzo_variabile,
          disponibile: p.disponibile,
          foto_url: p.foto_url,
          categoria_id: p.categoria_id,
          allergeni: allergeniByPiatto.get(p.id) ?? [],
          badges: badgeByPiatto.get(p.id) ?? [],
        }),
      ),
    })),
  }));

  return (
    <div className="p-8 md:p-12">
      <NuovoPiattoAction />

      <div className="flex items-center gap-4 mb-8">
        <a
          href="/api/pdf/menu?lang=it"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-admin-brick hover:opacity-70 transition-opacity"
        >
          Scarica PDF menu (IT)
        </a>
        <a
          href="/api/pdf/menu?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-admin-brick hover:opacity-70 transition-opacity"
        >
          Download menu PDF (EN)
        </a>
      </div>

      {/* La selezione si gestisce in Gestione sito → Home dal
          passaggio 5/6: qui restano solo gli avvisi, non più
          l'indicazione di un toggle che non esiste più su questa
          pagina. */}
      {anteprimaCount === 0 && (
        <p className="font-sans text-sm text-admin-amber bg-admin-amber-wash border border-admin-amber/40 rounded-[2px] px-3 py-2 mb-6 max-w-2xl">
          Nessun piatto selezionato per l&apos;anteprima della home: al momento
          la home mostra una scelta automatica (i primi piatti per ordine).{" "}
          <Link href="/gestione/contenuti" className="underline hover:opacity-70">
            Scegli tu cosa mostrare in Gestione sito → Home
          </Link>
          .
        </p>
      )}
      {anteprimaCount != null && anteprimaCount > 8 && (
        <p className="font-sans text-sm text-admin-amber bg-admin-amber-wash border border-admin-amber/40 rounded-[2px] px-3 py-2 mb-6 max-w-2xl">
          Sono {anteprimaCount} i piatti selezionati per l&apos;anteprima della
          home: oltre gli 8 diventa una lista invece di una selezione.
        </p>
      )}

      <MenuListClient groups={groups} />
    </div>
  );
}
