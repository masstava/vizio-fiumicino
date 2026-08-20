"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export interface FasciaInput {
  giorno_settimana: number;
  ordine: number;
  apertura: string | null;
  chiusura: string | null;
}

export interface OrariConfigInput {
  nota: string | null;
  valida_fino_al: string | null;
}

// Riga singola garantita dallo schema (PK boolean con check), quindi
// un update mirato basta: nessun rischio di duplicati.
export async function saveOrariConfig(config: OrariConfigInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orari_config")
    .update({ nota: config.nota, valida_fino_al: config.valida_fino_al })
    .eq("id", true);

  if (error) {
    console.error("[saveOrariConfig] update orari_config fallito:", error);
    throw new Error(error.message);
  }
  revalidatePath("/gestione/orari");
  revalidatePath("/");
}

export async function saveOrari(rows: FasciaInput[]) {
  const supabase = await createClient();

  // delete+insert dentro un'unica funzione Postgres: atomico anche
  // con un numero variabile di fasce per giorno (un upsert singolo
  // non basta più a garantirlo, vedi migration save_orari_function).
  const { error } = await supabase.rpc("save_orari", { p_rows: rows });

  if (error) {
    console.error("[saveOrari] RPC save_orari fallita:", error, {
      rowsCount: rows.length,
    });
    throw new Error(error.message);
  }
  revalidatePath("/gestione/orari");
  revalidatePath("/");
}
