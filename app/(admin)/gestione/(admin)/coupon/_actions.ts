"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import type { ArgomentiRpc, ArgomentiRpcStretti } from "@/src/lib/supabase/rpc";

// =============================================================
// Dashboard "Coupon" — §6
// =============================================================

export interface CreaCouponCampagnaInput {
  codice: string;
  descrizione: string;
  /** "YYYY-MM-DD" o null = nessun inizio. */
  validoDal: string | null;
  /** "YYYY-MM-DD" o null = nessuna scadenza. */
  validoAl: string | null;
  /** null = utilizzi illimitati. */
  utilizzoMassimo: number | null;
}

export type CreaCouponCampagnaEsito = { ok: true } | { ok: false; messaggio: string };

/**
 * Crea un coupon campagna con un insert diretto, non una RPC: a
 * differenza dell'iscrizione newsletter (idempotente, con codice
 * generato e collisioni da gestire) qui il codice lo sceglie lo
 * staff, e i vincoli della tabella (descrizione obbligatoria per
 * tipo='campagna', finestra coerente, tetto positivo) bastano da soli
 * a garantire una riga valida — niente logica applicativa in più da
 * mettere in una funzione dedicata.
 */
export async function creaCouponCampagna(
  input: CreaCouponCampagnaInput,
): Promise<CreaCouponCampagnaEsito> {
  const codice = input.codice.trim().toUpperCase();
  const descrizione = input.descrizione.trim();

  if (!codice) return { ok: false, messaggio: "Il codice è obbligatorio." };
  if (!descrizione) return { ok: false, messaggio: "La descrizione è obbligatoria." };

  const supabase = await createClient();
  const { error } = await supabase.from("coupon").insert({
    codice,
    tipo: "campagna",
    descrizione,
    valido_dal: input.validoDal || null,
    valido_al: input.validoAl || null,
    utilizzo_massimo: input.utilizzoMassimo,
  });

  if (error) {
    console.error("[creaCouponCampagna] insert fallito:", error, { codice });
    if (error.code === "23505") {
      return { ok: false, messaggio: "Esiste già un coupon con questo codice." };
    }
    return { ok: false, messaggio: error.message };
  }

  revalidatePath("/gestione/coupon");
  revalidatePath("/gestione/coupon/analytics");
  return { ok: true };
}

export type MotivoRiscattoFallito =
  | "scaduto"
  | "esaurito"
  | "disattivato"
  | "non_trovato"
  | "non_ancora_valido"
  | "sconosciuto";

export type SegnaComeUsatoEsito = { ok: true } | { ok: false; motivo: MotivoRiscattoFallito };

const MOTIVI_VALIDI = new Set<MotivoRiscattoFallito>([
  "scaduto",
  "esaurito",
  "disattivato",
  "non_trovato",
  "non_ancora_valido",
]);

/**
 * Registra un riscatto: unica via è la RPC riscatta_coupon, mai un
 * insert diretto in coupon_utilizzi — la tabella non ha comunque una
 * policy di scrittura per lo staff (vedi migration), proprio perché
 * solo la funzione applica i controlli (attivo, finestra, tetto).
 */
export async function segnaComeUsato(codice: string): Promise<SegnaComeUsatoEsito> {
  const supabase = await createClient();

  const argomenti: ArgomentiRpc<"riscatta_coupon"> = { p_codice: codice };
  const { data, error } = await supabase.rpc(
    "riscatta_coupon",
    argomenti as ArgomentiRpcStretti<"riscatta_coupon">,
  );

  if (error) {
    console.error("[segnaComeUsato] rpc fallita:", error, { codice });
    return { ok: false, motivo: "sconosciuto" };
  }

  const risultato = data as { ok?: boolean; motivo?: string } | null;
  if (!risultato) return { ok: false, motivo: "sconosciuto" };

  if (risultato.ok) {
    revalidatePath("/gestione/coupon");
    revalidatePath("/gestione/coupon/analytics");
    return { ok: true };
  }

  const motivo = risultato.motivo;
  return {
    ok: false,
    motivo: motivo && MOTIVI_VALIDI.has(motivo as MotivoRiscattoFallito)
      ? (motivo as MotivoRiscattoFallito)
      : "sconosciuto",
  };
}
