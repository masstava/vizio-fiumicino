import type { createClient } from "@/src/lib/supabase/server";

type ClientSupabase = Awaited<ReturnType<typeof createClient>>;

export interface MediaPagina {
  url: string;
  tipo: "immagine" | "video";
}

// I 5 slot reali identificati nella diagnosi del passaggio 5a (vedi
// supabase/migrations/20260901000000_media_pagine.sql): unica fonte —
// riusata sia per il contatore sidebar "Gestione sito" (quanti slot
// sono ancora vuoti) sia per la scheda "Foto delle pagine".
export const PAGINE_MEDIA_SITO: {
  pagina: string;
  etichetta: string;
  tipo: "immagine" | "video";
}[] = [
  { pagina: "home", etichetta: "Home (video hero)", tipo: "video" },
  { pagina: "la-carne", etichetta: "La carne", tipo: "immagine" },
  { pagina: "cocktail-bar", etichetta: "Cocktail & Bar", tipo: "immagine" },
  { pagina: "contatti", etichetta: "Contatti", tipo: "immagine" },
  { pagina: "experience-eventi", etichetta: "Experience & Eventi", tipo: "immagine" },
];

// Lettura dello slot immagine/video di una pagina (§ Gestione sito,
// passaggio 5b). Riga assente o url nullo → null: chi chiama ricade sul
// proprio comportamento attuale (env var per la home, nessuna immagine
// per le pagine editoriali) — stessa filosofia già in uso per
// contenuti_sito.
//
// Va sempre incluso in un Promise.all esistente insieme alle altre
// letture indipendenti della pagina, mai atteso da solo in sequenza
// (Fase 18 — la cascata di query della home è già stata corretta una
// volta per questo esatto motivo).
export async function getMediaPagina(
  supabase: ClientSupabase,
  pagina: string,
  slot: string = "hero",
): Promise<MediaPagina | null> {
  const { data } = await supabase
    .from("media_pagine")
    .select("url, tipo")
    .eq("pagina", pagina)
    .eq("slot", slot)
    .maybeSingle();

  if (!data?.url) return null;
  return { url: data.url, tipo: data.tipo === "video" ? "video" : "immagine" };
}
