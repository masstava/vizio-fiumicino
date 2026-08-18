import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { Button } from "@/src/components/ui/Button";
import { MenuListClient } from "./_components/MenuListClient";
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
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
            Gestione
          </p>
          <h1 className="font-serif text-4xl font-medium text-ink">Menu</h1>
        </div>
        <Link href="/gestione/menu/nuovo">
          <Button variant="primary">+ Aggiungi piatto</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <a
          href="/api/pdf/menu?lang=it"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-bordeaux hover:opacity-70 transition-opacity"
        >
          Scarica PDF menu (IT)
        </a>
        <a
          href="/api/pdf/menu?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm text-bordeaux hover:opacity-70 transition-opacity"
        >
          Download menu PDF (EN)
        </a>
        <span className="font-sans text-xs text-muted">
          — solo sezione &quot;Da mangiare&quot; per ora
        </span>
      </div>

      <MenuListClient groups={groups} />
    </div>
  );
}
