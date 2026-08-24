import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/lib/database.types";
import type { PiattoConBadge } from "@/src/lib/dominio";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import type { Locale } from "@/src/lib/i18n/config";

export const MACRO_BAR = "Bar & Cocktail";

// Quanti drink mostrare nella vetrina della pagina.
const QUANTI = 4;

// Ordine di preferenza fra le categorie del bancone. Serve a dare
// varietà DI TIPO, non solo di nome: un cocktail, un analcolico, un
// distillato, una birra raccontano il bancone meglio di quattro
// cocktail diversi.
//
// La regola vera però è un'altra ed è strutturale: si prende AL
// MASSIMO un drink per categoria. In home lo stesso blocco aveva
// prodotto quattro varianti quasi identiche (§18) proprio perché la
// selezione ragionava sui nomi invece che sulle categorie.
const PREFERENZA = [
  "Cocktail",
  "Cocktail Analcolici",
  "Gin",
  "Whisky",
  "Mezcal",
  "Tequila",
  "Rum",
  "Amari & Liquori",
  "Birre",
  "Vodka",
  "Grappe",
  "Bar",
];

/**
 * Vetrina del bancone: fino a QUANTI drink disponibili, ciascuno da
 * una categoria diversa. Nessun nome scritto a mano: se la carta
 * cambia, cambia la pagina.
 */
export async function getSelezioneBar(
  supabase: SupabaseClient<Database>,
  locale: Locale,
): Promise<PiattoConBadge[]> {
  const { data: macro } = await supabase
    .from("categorie_macro")
    .select("id")
    .eq("nome", MACRO_BAR)
    .maybeSingle();
  if (!macro) return [];

  const { data: categorie } = await supabase
    .from("categorie")
    .select("id, nome")
    .eq("categoria_macro_id", macro.id);
  if (!categorie?.length) return [];

  const { data: righe } = await supabase
    .from("piatti")
    .select("id, categoria_id, nome, nome_en, descrizione, descrizione_en, foto_url, ordine")
    .in("categoria_id", categorie.map((c) => c.id))
    .eq("disponibile", true)
    .order("ordine");
  if (!righe?.length) return [];

  // Primo drink per ogni categoria, nell'ordine della carta.
  const primoPerCategoria = new Map<string, (typeof righe)[number]>();
  righe.forEach((r) => {
    if (!primoPerCategoria.has(r.categoria_id)) {
      primoPerCategoria.set(r.categoria_id, r);
    }
  });

  const nomeCategoria = new Map(categorie.map((c) => [c.id, c.nome]));
  const posizione = (id: string) => {
    const i = PREFERENZA.indexOf(nomeCategoria.get(id) ?? "");
    // Una categoria nuova, non ancora in PREFERENZA, va in coda
    // invece di sparire: meglio un drink in più che una vetrina vuota.
    return i === -1 ? PREFERENZA.length : i;
  };

  const scelti = [...primoPerCategoria.values()]
    .sort((a, b) => posizione(a.categoria_id) - posizione(b.categoria_id))
    .slice(0, QUANTI);

  const { data: badgeRows } = await supabase
    .from("badge")
    .select("piatto_id, testo, testo_en")
    .in("piatto_id", scelti.map((p) => p.id));

  // Un badge per drink, come nelle anteprime: il primo che il
  // database restituisce.
  const badgeByPiatto = new Map<string, string>();
  (badgeRows ?? []).forEach((b) => {
    if (!badgeByPiatto.has(b.piatto_id)) {
      badgeByPiatto.set(b.piatto_id, campoLocalizzato(b.testo, b.testo_en, locale));
    }
  });

  return scelti.map((p) => ({
    id: p.id,
    nome: campoLocalizzato(p.nome, p.nome_en, locale),
    descrizione: campoLocalizzatoOpzionale(p.descrizione, p.descrizione_en, locale),
    foto_url: p.foto_url,
    badge: badgeByPiatto.get(p.id) ?? null,
  }));
}
