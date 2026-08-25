import type { SupabaseClient } from "@supabase/supabase-js";
import type { VoceAllergene } from "@/src/components/menu/LegendaAllergeni";
import type { MacroMenu } from "@/src/components/menu/MenuCompleto";
import type { Database } from "@/src/lib/database.types";
import type { PiattoRiga } from "@/src/lib/dominio";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// Lettura del menu completo — fonte unica
// =============================================================
// Estratta dalla pagina /menu, dove stava in linea, perché ora la
// usano in due: la vetrina /menu e la vista operativa /menu-online
// (QR al tavolo). Erano un centinaio di righe di fetch e join: due
// copie sarebbero divergute alla prima colonna aggiunta.
//
// Le due pagine mostrano gli STESSI dati con impaginazioni diverse.
// Qui non c'è nulla di specifico dell'una o dell'altra.
//
// Fetch espliciti e join lato JS con Map, come nel resto del
// progetto: mai join annidati di PostgREST.

export interface MenuCompletoDati {
  macro: MacroMenu[];
  legenda: VoceAllergene[];
}

export async function getMenuCompleto(
  supabase: SupabaseClient<Database>,
  locale: Locale,
): Promise<MenuCompletoDati> {
  const [
    { data: macroRows },
    { data: categorieRows },
    { data: piattiRows },
    { data: allergeniRows },
  ] = await Promise.all([
    supabase
      .from("categorie_macro")
      .select("id, nome, nome_en, ordine")
      .order("ordine"),
    supabase
      .from("categorie")
      .select("id, nome, nome_en, ordine, categoria_macro_id")
      .order("ordine"),
    supabase
      .from("piatti")
      .select(
        "id, categoria_id, nome, nome_en, descrizione, descrizione_en, prezzo, prezzo_variabile, foto_url, ordine",
      )
      .eq("disponibile", true)
      .order("ordine"),
    supabase.from("allergeni").select("id, nome_it, nome_en").order("id"),
  ]);

  const piattoIds = (piattiRows ?? []).map((p) => p.id);

  // Secondo livello: dipendono dagli id del primo ma non l'una
  // dall'altra, quindi partono insieme.
  const [{ data: allergeniLinks }, { data: badgeLinks }] = await Promise.all([
    piattoIds.length
      ? supabase
          .from("piatti_allergeni")
          .select("piatto_id, allergene_id")
          .in("piatto_id", piattoIds)
      : Promise.resolve({
          data: [] as { piatto_id: string; allergene_id: number }[],
        }),
    piattoIds.length
      ? supabase
          .from("badge")
          .select("piatto_id, testo, testo_en")
          .in("piatto_id", piattoIds)
      : Promise.resolve({
          data: [] as {
            piatto_id: string;
            testo: string;
            testo_en: string | null;
          }[],
        }),
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
    arr.push(campoLocalizzato(b.testo, b.testo_en, locale));
    badgeByPiatto.set(b.piatto_id, arr);
  });

  const piattiByCategoria = new Map<string, PiattoRiga[]>();
  (piattiRows ?? []).forEach((p) => {
    const arr = piattiByCategoria.get(p.categoria_id) ?? [];
    arr.push({
      id: p.id,
      nome: campoLocalizzato(p.nome, p.nome_en, locale),
      descrizione: campoLocalizzatoOpzionale(
        p.descrizione,
        p.descrizione_en,
        locale,
      ),
      // Il prezzo qui è SEMPRE visibile: è la differenza voluta
      // rispetto alle anteprime in home, che non lo mostrano mai.
      prezzo: p.prezzo,
      prezzo_variabile: p.prezzo_variabile,
      foto_url: p.foto_url,
      allergeni: allergeniByPiatto.get(p.id) ?? [],
      badges: badgeByPiatto.get(p.id) ?? [],
    });
    piattiByCategoria.set(p.categoria_id, arr);
  });

  // Categorie e macro senza piatti disponibili non compaiono: una
  // sezione vuota sul menu è peggio di una sezione assente.
  const macro: MacroMenu[] = (macroRows ?? [])
    .map((m) => ({
      id: m.id,
      nome: campoLocalizzato(m.nome, m.nome_en, locale),
      chiave: m.nome,
      categorie: (categorieRows ?? [])
        .filter((c) => c.categoria_macro_id === m.id)
        .map((c) => ({
          id: c.id,
          nome: campoLocalizzato(c.nome, c.nome_en, locale),
          piatti: piattiByCategoria.get(c.id) ?? [],
        }))
        .filter((c) => c.piatti.length > 0),
    }))
    .filter((m) => m.categorie.length > 0);

  // Solo gli allergeni davvero usati da almeno un piatto: la legenda
  // completa a 14 voci elencherebbe codici che nel menu non compaiono.
  const usati = new Set<number>();
  allergeniByPiatto.forEach((codici) => codici.forEach((c) => usati.add(c)));
  const legenda: VoceAllergene[] = (allergeniRows ?? [])
    .filter((a) => usati.has(a.id))
    .map((a) => ({
      id: a.id,
      nome: campoLocalizzato(a.nome_it, a.nome_en, locale),
    }));

  return { macro, legenda };
}
