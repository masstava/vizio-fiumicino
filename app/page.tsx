import { createClient } from "@/src/lib/supabase/server";
import type { DishData } from "@/src/components/ui/DishRow";
import { BarCocktailPreview } from "@/src/components/home/BarCocktailPreview";
import { ExperienceEventi } from "@/src/components/home/ExperienceEventi";
import { FeaturedDishes } from "@/src/components/home/FeaturedDishes";
import type { FeaturedDish } from "@/src/components/home/FeaturedDishSlide";
import { Footer, type GiornoOrario } from "@/src/components/home/Footer";
import { Hero } from "@/src/components/home/Hero";
import { MenuPreview } from "@/src/components/home/MenuPreview";
import { Newsletter } from "@/src/components/home/Newsletter";
import { SocialProof } from "@/src/components/home/SocialProof";
import { StickyReservationBar } from "@/src/components/home/StickyReservationBar";
import { ThreePillars } from "@/src/components/home/ThreePillars";

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

  const piattoById = new Map((evidenzaPiatti ?? []).map((p) => [p.id, p]));
  const featuredDishes: FeaturedDish[] = (evidenzaLinks ?? [])
    .map((e) => piattoById.get(e.piatto_id))
    .filter((p): p is FeaturedDish => p != null);

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

  const { data: menuPreviewRows } = categoriaIds.length
    ? await supabase
        .from("piatti")
        .select(
          "id, categoria_id, nome, descrizione, prezzo, prezzo_variabile, foto_url, ordine",
        )
        .in("categoria_id", categoriaIds)
        .eq("disponibile", true)
        .order("ordine")
    : {
        data: [] as {
          id: string;
          categoria_id: string;
          nome: string;
          descrizione: string | null;
          prezzo: number | null;
          prezzo_variabile: boolean;
          foto_url: string | null;
          ordine: number;
        }[],
      };

  const menuPreviewPiatti = (menuPreviewRows ?? [])
    .slice()
    .sort((a, b) => {
      const ca = categoriaOrdineById.get(a.categoria_id) ?? 0;
      const cb = categoriaOrdineById.get(b.categoria_id) ?? 0;
      return ca !== cb ? ca - cb : a.ordine - b.ordine;
    })
    .slice(0, MENU_PREVIEW_LIMIT);

  const menuPreviewIds = menuPreviewPiatti.map((p) => p.id);

  const [{ data: allergeniLinks }, { data: badgeLinks }] = await Promise.all([
    menuPreviewIds.length
      ? supabase
          .from("piatti_allergeni")
          .select("piatto_id, allergene_id")
          .in("piatto_id", menuPreviewIds)
      : Promise.resolve({ data: [] as { piatto_id: string; allergene_id: number }[] }),
    menuPreviewIds.length
      ? supabase.from("badge").select("piatto_id, testo").in("piatto_id", menuPreviewIds)
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

  const menuPreviewDishes: DishData[] = menuPreviewPiatti.map((p) => ({
    id: p.id,
    nome: p.nome,
    descrizione: p.descrizione,
    prezzo: p.prezzo,
    prezzo_variabile: p.prezzo_variabile,
    foto_url: p.foto_url,
    allergeni: allergeniByPiatto.get(p.id) ?? [],
    badges: badgeByPiatto.get(p.id) ?? [],
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

  const { data: cocktailRows } = categoriaCocktail
    ? await supabase
        .from("piatti")
        .select("id, nome, descrizione, prezzo, prezzo_variabile, foto_url")
        .eq("categoria_id", categoriaCocktail.id)
        .eq("disponibile", true)
        .order("ordine")
        .limit(COCKTAIL_PREVIEW_LIMIT)
    : { data: [] as DishData[] };

  const cocktailIds = (cocktailRows ?? []).map((p) => p.id);

  const [{ data: cocktailAllergeniLinks }, { data: cocktailBadgeLinks }] =
    await Promise.all([
      cocktailIds.length
        ? supabase
            .from("piatti_allergeni")
            .select("piatto_id, allergene_id")
            .in("piatto_id", cocktailIds)
        : Promise.resolve({ data: [] as { piatto_id: string; allergene_id: number }[] }),
      cocktailIds.length
        ? supabase.from("badge").select("piatto_id, testo").in("piatto_id", cocktailIds)
        : Promise.resolve({ data: [] as { piatto_id: string; testo: string }[] }),
    ]);

  const cocktailAllergeniByPiatto = new Map<string, number[]>();
  (cocktailAllergeniLinks ?? []).forEach((l) => {
    const arr = cocktailAllergeniByPiatto.get(l.piatto_id) ?? [];
    arr.push(l.allergene_id);
    cocktailAllergeniByPiatto.set(l.piatto_id, arr);
  });

  const cocktailBadgeByPiatto = new Map<string, string[]>();
  (cocktailBadgeLinks ?? []).forEach((b) => {
    const arr = cocktailBadgeByPiatto.get(b.piatto_id) ?? [];
    arr.push(b.testo);
    cocktailBadgeByPiatto.set(b.piatto_id, arr);
  });

  const cocktailDishes: DishData[] = (cocktailRows ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    descrizione: p.descrizione,
    prezzo: p.prezzo,
    prezzo_variabile: p.prezzo_variabile,
    foto_url: p.foto_url,
    allergeni: cocktailAllergeniByPiatto.get(p.id) ?? [],
    badges: cocktailBadgeByPiatto.get(p.id) ?? [],
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

  return (
    <main>
      <StickyReservationBar />
      <Hero />
      <ThreePillars />
      <FeaturedDishes dishes={featuredDishes} />
      <SocialProof />
      <MenuPreview dishes={menuPreviewDishes} />
      <BarCocktailPreview dishes={cocktailDishes} />
      <ExperienceEventi />
      <Newsletter />
      <Footer orari={orariSettimana} />
    </main>
  );
}
