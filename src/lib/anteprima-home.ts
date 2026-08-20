import type { SupabaseClient } from "@supabase/supabase-js";
import type { HybridDish } from "@/src/components/home/CompactDishCard";

// Selezione curata dell'anteprima home. Estratto da app/page.tsx
// perché la logica (selezione + ricaduta + split per macro) è ormai
// più lunga della pagina che la usa; lo stile resta quello del
// progetto: fetch espliciti e join lato JS con Map, mai join
// annidati di PostgREST.

export const MACRO_MANGIARE = "Da mangiare";
export const MACRO_BAR = "Bar & Cocktail";

// Usato solo dalla ricaduta automatica, quando nessun piatto è stato
// ancora selezionato in dashboard.
const RICADUTA_LIMITE = 6;

export interface AnteprimaHome {
  menu: HybridDish[];
  cocktail: HybridDish[];
  /** Nessun piatto selezionato: si sta mostrando la ricaduta automatica. */
  ricadutaAutomatica: boolean;
}

interface PiattoRow {
  id: string;
  categoria_id: string;
  nome: string;
  descrizione: string | null;
  foto_url: string | null;
}

// Un solo badge per piatto, come nella griglia compatta: se un piatto
// ne ha più di uno si mostra il primo.
async function badgeByPiatto(
  supabase: SupabaseClient,
  ids: string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (ids.length === 0) return out;

  const { data } = await supabase
    .from("badge")
    .select("piatto_id, testo")
    .in("piatto_id", ids);

  (data ?? []).forEach((b) => {
    if (!out.has(b.piatto_id)) out.set(b.piatto_id, b.testo);
  });
  return out;
}

// categoria_id → nome della macro-categoria, per separare i piatti
// del menu da quelli del bar.
async function macroByCategoria(
  supabase: SupabaseClient,
  categoriaIds: string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (categoriaIds.length === 0) return out;

  const { data: categorie } = await supabase
    .from("categorie")
    .select("id, categoria_macro_id")
    .in("id", categoriaIds);

  const macroIds = [
    ...new Set((categorie ?? []).map((c) => c.categoria_macro_id)),
  ];
  if (macroIds.length === 0) return out;

  const { data: macros } = await supabase
    .from("categorie_macro")
    .select("id, nome")
    .in("id", macroIds);

  const nomeByMacroId = new Map((macros ?? []).map((m) => [m.id, m.nome]));
  (categorie ?? []).forEach((c) => {
    const nome = nomeByMacroId.get(c.categoria_macro_id);
    if (nome) out.set(c.id, nome);
  });
  return out;
}

// Ricaduta: primi piatti disponibili della macro, per ordine di
// categoria e poi di piatto. È il comportamento che c'era prima del
// flag — serve solo a non far sparire una sezione dalla home quando
// la selezione non è ancora stata fatta. La dashboard lo segnala.
async function ricaduta(
  supabase: SupabaseClient,
  macroNome: string,
): Promise<HybridDish[]> {
  const { data: macro } = await supabase
    .from("categorie_macro")
    .select("id")
    .eq("nome", macroNome)
    .maybeSingle();
  if (!macro) return [];

  const { data: categorie } = await supabase
    .from("categorie")
    .select("id, ordine")
    .eq("categoria_macro_id", macro.id)
    .order("ordine");

  const categoriaIds = (categorie ?? []).map((c) => c.id);
  if (categoriaIds.length === 0) return [];

  const ordineByCategoria = new Map(
    (categorie ?? []).map((c) => [c.id, c.ordine]),
  );

  const { data: righe } = await supabase
    .from("piatti")
    .select("id, categoria_id, nome, descrizione, foto_url, ordine")
    .in("categoria_id", categoriaIds)
    .eq("disponibile", true)
    .order("ordine");

  // L'ordine delle categorie riparte da 0 per ogni macro, quindi il
  // sort a due livelli va fatto qui e non in query.
  const scelti = (righe ?? [])
    .slice()
    .sort((a, b) => {
      const ca = ordineByCategoria.get(a.categoria_id) ?? 0;
      const cb = ordineByCategoria.get(b.categoria_id) ?? 0;
      return ca !== cb ? ca - cb : a.ordine - b.ordine;
    })
    .slice(0, RICADUTA_LIMITE);

  const badges = await badgeByPiatto(
    supabase,
    scelti.map((p) => p.id),
  );

  return scelti.map((p) => ({
    id: p.id,
    nome: p.nome,
    descrizione: p.descrizione,
    foto_url: p.foto_url,
    badge: badges.get(p.id) ?? null,
  }));
}

export async function getAnteprimaHome(
  supabase: SupabaseClient,
): Promise<AnteprimaHome> {
  const { data: links } = await supabase
    .from("piatti_anteprima_home")
    .select("piatto_id, ordine")
    .order("ordine");

  const ids = (links ?? []).map((l) => l.piatto_id);

  if (ids.length === 0) {
    const [menu, cocktail] = await Promise.all([
      ricaduta(supabase, MACRO_MANGIARE),
      ricaduta(supabase, MACRO_BAR),
    ]);
    return { menu, cocktail, ricadutaAutomatica: true };
  }

  const { data: piatti } = await supabase
    .from("piatti")
    .select("id, categoria_id, nome, descrizione, foto_url")
    .in("id", ids)
    .eq("disponibile", true);

  const righe = (piatti ?? []) as PiattoRow[];
  const [badges, macroByCat] = await Promise.all([
    badgeByPiatto(supabase, righe.map((p) => p.id)),
    macroByCategoria(supabase, [...new Set(righe.map((p) => p.categoria_id))]),
  ]);

  const piattoById = new Map(righe.map((p) => [p.id, p]));

  // L'ordine è quello impostato in dashboard: prima e ultima
  // posizione sono le più viste, quindi non si riordina per altro.
  const ordinati = (links ?? [])
    .map((l) => piattoById.get(l.piatto_id))
    .filter((p): p is PiattoRow => p != null);

  const menu: HybridDish[] = [];
  const cocktail: HybridDish[] = [];

  ordinati.forEach((p) => {
    const dish: HybridDish = {
      id: p.id,
      nome: p.nome,
      descrizione: p.descrizione,
      foto_url: p.foto_url,
      badge: badges.get(p.id) ?? null,
    };
    // Tutto ciò che non è bar finisce nell'anteprima menu: così un
    // piatto in una macro nuova resta visibile invece di sparire.
    if (macroByCat.get(p.categoria_id) === MACRO_BAR) cocktail.push(dish);
    else menu.push(dish);
  });

  return { menu, cocktail, ricadutaAutomatica: false };
}
