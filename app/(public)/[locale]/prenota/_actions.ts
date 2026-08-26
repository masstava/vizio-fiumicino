"use server";

import { createClient } from "@/src/lib/supabase/server";
import type { ArgomentiRpc, ArgomentiRpcStretti } from "@/src/lib/supabase/rpc";
import type { RigaCapienza } from "@/src/lib/prenotazioni/disponibilita";

// =============================================================
// Disponibilità
// =============================================================

/**
 * Capienza configurata per una data, una riga per ogni fascia che ha
 * un tetto impostato. Chiama capienza_del_giorno: non è una lettura
 * diretta di "prenotazioni", che non ha lettura pubblica — la
 * funzione espone solo l'aggregato (fascia, limite, occupati), mai
 * una riga con dati personali.
 */
export async function leggiCapienzaGiorno(data: string): Promise<RigaCapienza[]> {
  const supabase = await createClient();
  const { data: righe, error } = await supabase.rpc("capienza_del_giorno", {
    p_data: data,
  });

  if (error) throw new Error(error.message);

  return (righe ?? []).map((r) => ({
    fascia: r.fascia,
    limiteCoperti: r.limite_coperti,
    occupati: Number(r.occupati),
  }));
}

// =============================================================
// Creazione
// =============================================================

// Alias e non interface: serve l'index signature implicito per
// risultare assegnabile a Json, il tipo del parametro jsonb della RPC
// (stesso motivo di BadgeInput/FasciaInput in dashboard).
export type RispostaExtra = {
  etichetta: string;
  valore: string;
};

export interface CreaPrenotazioneInput {
  nome: string;
  telefono: string;
  email: string | null;
  data: string;
  fascia: string;
  coperti: number;
  note: string | null;
  eventoId: string | null;
  risposteExtra: RispostaExtra[] | null;
}

export type CreaPrenotazioneEsito =
  | { ok: true; id: string }
  | { ok: false; capienzaEsaurita: true }
  | { ok: false; capienzaEsaurita: false; messaggio: string };

/**
 * Unica via di creazione di una prenotazione: chiama la funzione
 * atomica crea_prenotazione, MAI un insert diretto sulla tabella —
 * da questo passo in poi un insert diretto verrebbe comunque negato
 * dalla RLS, ma anche se non lo fosse, saltare la funzione vorrebbe
 * dire saltare la verifica di capienza e il lucchetto che la rende
 * atomica sotto richieste simultanee.
 */
export async function creaPrenotazione(
  input: CreaPrenotazioneInput,
): Promise<CreaPrenotazioneEsito> {
  const supabase = await createClient();

  // Tipizzato con ArgomentiRpc: il generatore emette gli argomenti
  // delle funzioni sempre non-nullable, ma qui email, note, evento_id
  // e risposte_extra sono legittimamente assenti (vedi
  // src/lib/supabase/rpc.ts per la spiegazione estesa).
  const argomenti: ArgomentiRpc<"crea_prenotazione"> = {
    p_nome: input.nome,
    p_telefono: input.telefono,
    p_email: input.email,
    p_data: input.data,
    p_fascia: input.fascia,
    p_coperti: input.coperti,
    p_note: input.note,
    p_evento_id: input.eventoId,
    p_risposte_extra: input.risposteExtra,
  };

  const { data, error } = await supabase.rpc(
    "crea_prenotazione",
    argomenti as ArgomentiRpcStretti<"crea_prenotazione">,
  );

  if (error) {
    if (error.message === "CAPIENZA_ESAURITA") {
      return { ok: false, capienzaEsaurita: true };
    }
    return { ok: false, capienzaEsaurita: false, messaggio: error.message };
  }

  const riga = data?.[0];
  if (!riga) {
    return {
      ok: false,
      capienzaEsaurita: false,
      messaggio: "Nessuna riga restituita dalla funzione di creazione.",
    };
  }

  return { ok: true, id: riga.id };
}
