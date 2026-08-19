import { createClient } from "@/src/lib/supabase/server";
import { BarCocktailPreview } from "@/src/components/home/BarCocktailPreview";
import type { HybridDish } from "@/src/components/home/CompactDishCard";
import { ExperienceEventi } from "@/src/components/home/ExperienceEventi";
import { FeaturedDishes } from "@/src/components/home/FeaturedDishes";
import type { FeaturedDish } from "@/src/components/home/FeaturedDishSlide";
import { Footer, type GiornoOrario } from "@/src/components/home/Footer";
import { Hero } from "@/src/components/home/Hero";
import { MenuPreview } from "@/src/components/home/MenuPreview";
import { Newsletter } from "@/src/components/home/Newsletter";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { SocialProof } from "@/src/components/home/SocialProof";
import { ThreePillars } from "@/src/components/home/ThreePillars";
import { isApertoOra } from "@/src/lib/orari";

export const dynamic = "force-dynamic";

// Numero di piatti mostrati nell'anteprima menu in home — il resto
// del menu "Da mangiare" vive nella pagina menu completa (CTA "Vedi
// il menu completo"). Cocktail/Bar hanno un proprio blocco separato.
const MENU_PREVIEW_LIMIT = 6;
const MENU_PREVIEW_MACRO = "Da mangiare";

// Teaser più corto: solo la categoria "Cocktail" (non tutti gli
// spirits/birre/bar della macro), a scopo di assaggio visivo.
const COCKTAIL_PREVIEW_LIMIT = 4;
const COCKTAIL_PREVIEW_MACRO = "Bar & Cocktail";
const COCKTAIL_PREVIEW_CATEGORIA = "Cocktail";

// giorno_settimana: 0 = Lunedì ... 6 = Domenica (stessa convenzione
// già usata in /gestione/orari e nella route del PDF orari).
const GIORNI_LABELS = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
] as const;

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

  // Un solo badge per piatto (se presente), stesso pattern già usato
  // per le anteprime menu/cocktail.
  const { data: evidenzaBadgeLinks } = evidenzaIds.length
    ? await supabase
        .from("badge")
        .select("piatto_id, testo")
        .in("piatto_id", evidenzaIds)
    : { data: [] as { piatto_id: string; testo: string }[] };

  const evidenzaBadgeByPiatto = new Map<string, string>();
  (evidenzaBadgeLinks ?? []).forEach((b) => {
    if (!evidenzaBadgeByPiatto.has(b.piatto_id)) {
      evidenzaBadgeByPiatto.set(b.piatto_id, b.testo);
    }
  });

  const piattoById = new Map((evidenzaPiatti ?? []).map((p) => [p.id, p]));
  const featuredDishes: FeaturedDish[] = (evidenzaLinks ?? [])
    .map((e) => piattoById.get(e.piatto_id))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({ ...p, badge: evidenzaBadgeByPiatto.get(p.id) ?? null }));

  // Anteprima menu: prime N portate disponibili di "Da mangiare",
  // ordinate per categoria poi per piatto (l'ordine della categoria
  // riparte da 0 per ogni macro-categoria, quindi il sort a due
  // livelli va fatto lato JS, come già nella route del PDF menu).
  const { data: macroDaMangiare } = await supabase
    .from("categorie_macro")
    .select("id")
    .eq("nome", MENU_PREVIEW_MACRO)
    .maybeSingle();

  const { data: categorieDaMangiare } = macroDaMangiare
    ? await supabase
        .from("categorie")
        .select("id, ordine")
        .eq("categoria_macro_id", macroDaMangiare.id)
        .order("ordine")
    : { data: [] as { id: string; ordine: number }[] };

  const categoriaOrdineById = new Map(
    (categorieDaMangiare ?? []).map((c) => [c.id, c.ordine]),
  );
  const categoriaIds = (categorieDaMangiare ?? []).map((c) => c.id);

  // Layout ibrido: bastano id/nome/descrizione/foto_url più un
  // eventuale badge (letto sotto), nessun prezzo né allergeni (non
  // mostrati in questo blocco).
  const { data: menuPreviewRows } = categoriaIds.length
    ? await supabase
        .from("piatti")
        .select("id, categoria_id, nome, descrizione, foto_url, ordine")
        .in("categoria_id", categoriaIds)
        .eq("disponibile", true)
        .order("ordine")
    : {
        data: [] as {
          id: string;
          categoria_id: string;
          nome: string;
          descrizione: string | null;
          foto_url: string | null;
          ordine: number;
        }[],
      };

  const menuPreviewRowsSorted = (menuPreviewRows ?? [])
    .slice()
    .sort((a, b) => {
      const ca = categoriaOrdineById.get(a.categoria_id) ?? 0;
      const cb = categoriaOrdineById.get(b.categoria_id) ?? 0;
      return ca !== cb ? ca - cb : a.ordine - b.ordine;
    })
    .slice(0, MENU_PREVIEW_LIMIT);

  // Un solo badge per piatto (se presente) come richiesto per la
  // griglia compatta — non ne inventiamo, leggiamo quelli già in
  // "badge" e prendiamo il primo.
  const menuPreviewIds = menuPreviewRowsSorted.map((p) => p.id);
  const { data: menuPreviewBadgeLinks } = menuPreviewIds.length
    ? await supabase
        .from("badge")
        .select("piatto_id, testo")
        .in("piatto_id", menuPreviewIds)
    : { data: [] as { piatto_id: string; testo: string }[] };

  const menuPreviewBadgeByPiatto = new Map<string, string>();
  (menuPreviewBadgeLinks ?? []).forEach((b) => {
    if (!menuPreviewBadgeByPiatto.has(b.piatto_id)) {
      menuPreviewBadgeByPiatto.set(b.piatto_id, b.testo);
    }
  });

  const menuPreviewDishes: HybridDish[] = menuPreviewRowsSorted.map((p) => ({
    id: p.id,
    nome: p.nome,
    descrizione: p.descrizione,
    foto_url: p.foto_url,
    badge: menuPreviewBadgeByPiatto.get(p.id) ?? null,
  }));

  // Teaser Cocktail & Bar: singola categoria, quindi nessun sort a
  // due livelli necessario — si può limitare già in query.
  const { data: macroBarCocktail } = await supabase
    .from("categorie_macro")
    .select("id")
    .eq("nome", COCKTAIL_PREVIEW_MACRO)
    .maybeSingle();

  const { data: categoriaCocktail } = macroBarCocktail
    ? await supabase
        .from("categorie")
        .select("id")
        .eq("categoria_macro_id", macroBarCocktail.id)
        .eq("nome", COCKTAIL_PREVIEW_CATEGORIA)
        .maybeSingle()
    : { data: null };

  // Layout ibrido: nessun prezzo, ma un eventuale badge sì (letto
  // sotto, stessa logica dell'anteprima menu).
  const { data: cocktailRows } = categoriaCocktail
    ? await supabase
        .from("piatti")
        .select("id, nome, descrizione, foto_url")
        .eq("categoria_id", categoriaCocktail.id)
        .eq("disponibile", true)
        .order("ordine")
        .limit(COCKTAIL_PREVIEW_LIMIT)
    : { data: [] as FeaturedDish[] };

  const cocktailIds = (cocktailRows ?? []).map((p) => p.id);
  const { data: cocktailBadgeLinks } = cocktailIds.length
    ? await supabase
        .from("badge")
        .select("piatto_id, testo")
        .in("piatto_id", cocktailIds)
    : { data: [] as { piatto_id: string; testo: string }[] };

  const cocktailBadgeByPiatto = new Map<string, string>();
  (cocktailBadgeLinks ?? []).forEach((b) => {
    if (!cocktailBadgeByPiatto.has(b.piatto_id)) {
      cocktailBadgeByPiatto.set(b.piatto_id, b.testo);
    }
  });

  const cocktailDishes: HybridDish[] = (cocktailRows ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    descrizione: p.descrizione,
    foto_url: p.foto_url,
    badge: cocktailBadgeByPiatto.get(p.id) ?? null,
  }));

  // Orari per il footer: stessa fonte unica usata in /gestione/orari
  // e nella route del PDF orari.
  const { data: orariRows } = await supabase
    .from("orari")
    .select("giorno_settimana, apertura, chiusura")
    .order("giorno_settimana")
    .order("ordine");

  const fasceByGiorno = new Map<number, { apertura: string; chiusura: string }[]>();
  (orariRows ?? []).forEach((r) => {
    if (!r.apertura || !r.chiusura) return;
    const arr = fasceByGiorno.get(r.giorno_settimana) ?? [];
    arr.push({ apertura: r.apertura.slice(0, 5), chiusura: r.chiusura.slice(0, 5) });
    fasceByGiorno.set(r.giorno_settimana, arr);
  });

  const orariSettimana: GiornoOrario[] = GIORNI_LABELS.map((nome, giorno) => {
    const fasce = fasceByGiorno.get(giorno) ?? [];
    return { nome, chiuso: fasce.length === 0, fasce };
  });

  // Nota orari temporanei (es. orario estivo): mostrata sul sito
  // accanto agli orari, così un orario stagionale non passa per
  // definitivo. La data di validità è solo un promemoria per la
  // dashboard, qui non serve.
  const { data: orariConfig } = await supabase
    .from("orari_config")
    .select("nota")
    .maybeSingle();

  const apertoOra = isApertoOra(
    Array.from(fasceByGiorno.entries()).map(([giorno_settimana, fasce]) => ({
      giorno_settimana,
      fasce,
    })),
  );

  return (
    <main>
      <SiteHeader />
      <Hero />
      <ThreePillars />
      <FeaturedDishes dishes={featuredDishes} />
      <SocialProof />
      <MenuPreview dishes={menuPreviewDishes} />
      <BarCocktailPreview dishes={cocktailDishes} />
      <ExperienceEventi />
      <Newsletter />
      <Footer
        orari={orariSettimana}
        apertoOra={apertoOra}
        notaOrari={orariConfig?.nota ?? null}
      />
    </main>
  );
}
