"use server";

import { createClient } from "@/src/lib/supabase/server";

export type DisiscrizioneMotivo = "token_non_valido" | "gia_disiscritto" | "sconosciuto";

export type DisiscrizioneEsito = { ok: true } | { ok: false; motivo: DisiscrizioneMotivo };

const MOTIVI_VALIDI = new Set<DisiscrizioneMotivo>(["token_non_valido", "gia_disiscritto"]);

/**
 * Unica via di revoca del consenso: chiama la RPC disiscriviti_newsletter,
 * mai un update diretto — coupon non ha comunque una policy pubblica su
 * questa colonna, ma anche se l'avesse, saltare la funzione vorrebbe
 * dire saltare la ricerca per token, l'unico modo legittimo di
 * identificare la riga giusta senza esporre una lettura per email.
 *
 * Un token mancante o vuoto (link malformato) è trattato come "token
 * non valido" senza nemmeno chiamare il database: stesso esito finale,
 * un giro di rete in meno per un caso che non può avere successo.
 */
export async function disiscrivitiNewsletter(token: string): Promise<DisiscrizioneEsito> {
  if (!token.trim()) return { ok: false, motivo: "token_non_valido" };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("disiscriviti_newsletter", {
    p_token: token,
  });

  if (error) {
    console.error("[disiscrivitiNewsletter] rpc fallita:", error);
    return { ok: false, motivo: "sconosciuto" };
  }

  const risultato = data as { ok?: boolean; motivo?: string } | null;
  if (!risultato) return { ok: false, motivo: "sconosciuto" };
  if (risultato.ok) return { ok: true };

  const motivo = risultato.motivo;
  return {
    ok: false,
    motivo: motivo && MOTIVI_VALIDI.has(motivo as DisiscrizioneMotivo)
      ? (motivo as DisiscrizioneMotivo)
      : "sconosciuto",
  };
}
