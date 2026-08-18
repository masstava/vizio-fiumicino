import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/src/lib/supabase/server";
import {
  MenuDocument,
  type MenuAllergene,
  type MenuCategoria,
  type MenuPiatto,
} from "@/src/lib/pdf/MenuDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Prima fase: solo "Da mangiare". Le altre macro-categorie verranno
// aggiunte dopo aver verificato l'impaginazione su questa porzione.
const MACRO_NOME = "Da mangiare";

export async function GET(request: NextRequest) {
  const langParam = request.nextUrl.searchParams.get("lang");
  const lang: "it" | "en" = langParam === "en" ? "en" : "it";

  const supabase = await createClient();

  const { data: macro, error: macroError } = await supabase
    .from("categorie_macro")
    .select("id")
    .eq("nome", MACRO_NOME)
    .maybeSingle();

  if (macroError || !macro) {
    return NextResponse.json(
      { error: macroError?.message ?? `Macro-categoria "${MACRO_NOME}" non trovata.` },
      { status: 500 },
    );
  }

  const { data: categorieRows, error: categorieError } = await supabase
    .from("categorie")
    .select("id, nome, nome_en, ordine")
    .eq("categoria_macro_id", macro.id)
    .order("ordine");

  if (categorieError) {
    return NextResponse.json({ error: categorieError.message }, { status: 500 });
  }

  const categoriaIds = (categorieRows ?? []).map((c) => c.id);

  const { data: piattiRows, error: piattiError } = categoriaIds.length
    ? await supabase
        .from("piatti")
        .select(
          "id, categoria_id, nome, nome_en, descrizione, descrizione_en, prezzo, prezzo_variabile, ordine",
        )
        .in("categoria_id", categoriaIds)
        .eq("disponibile", true)
        .order("ordine")
    : { data: [], error: null };

  if (piattiError) {
    return NextResponse.json({ error: piattiError.message }, { status: 500 });
  }

  const piattoIds = (piattiRows ?? []).map((p) => p.id);

  const [{ data: allergeniLinks }, { data: badgeLinks }, { data: allergeniAll }] =
    await Promise.all([
      piattoIds.length
        ? supabase
            .from("piatti_allergeni")
            .select("piatto_id, allergene_id")
            .in("piatto_id", piattoIds)
        : Promise.resolve({ data: [] as { piatto_id: string; allergene_id: number }[] }),
      piattoIds.length
        ? supabase
            .from("badge")
            .select("piatto_id, testo, testo_en")
            .in("piatto_id", piattoIds)
        : Promise.resolve({
            data: [] as { piatto_id: string; testo: string; testo_en: string | null }[],
          }),
      supabase.from("allergeni").select("id, nome_it, nome_en").order("id"),
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
    arr.push(lang === "en" ? b.testo_en || b.testo : b.testo);
    badgeByPiatto.set(b.piatto_id, arr);
  });

  const piattiByCategoria = new Map<string, MenuPiatto[]>();
  (piattiRows ?? []).forEach((p) => {
    const arr = piattiByCategoria.get(p.categoria_id) ?? [];
    arr.push({
      id: p.id,
      nome: lang === "en" ? p.nome_en || p.nome : p.nome,
      descrizione: lang === "en" ? p.descrizione_en || p.descrizione : p.descrizione,
      prezzo: p.prezzo,
      prezzo_variabile: p.prezzo_variabile,
      badges: badgeByPiatto.get(p.id) ?? [],
      allergeni: allergeniByPiatto.get(p.id) ?? [],
    });
    piattiByCategoria.set(p.categoria_id, arr);
  });

  const categorie: MenuCategoria[] = (categorieRows ?? [])
    .map((c) => ({
      id: c.id,
      nome: lang === "en" ? c.nome_en || c.nome : c.nome,
      piatti: piattiByCategoria.get(c.id) ?? [],
    }))
    .filter((c) => c.piatti.length > 0);

  const allergeni: MenuAllergene[] = (allergeniAll ?? []).map((a) => ({
    id: a.id,
    nome: lang === "en" ? a.nome_en : a.nome_it,
  }));

  const buffer = await renderToBuffer(
    MenuDocument({ categorie, allergeni, lang }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="menu-vizio-${lang}.pdf"`,
    },
  });
}
