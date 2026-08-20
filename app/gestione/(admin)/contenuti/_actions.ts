"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { CHIAVI_CONTENUTI } from "@/src/lib/contenuti";

export async function saveContenuti(valori: Record<string, string>) {
  const supabase = await createClient();

  // Solo le chiavi dichiarate nel codice: un payload manomesso non
  // può inserire righe arbitrarie in tabella.
  const righe = CHIAVI_CONTENUTI.map((chiave) => ({
    chiave,
    valore: (valori[chiave] ?? "").trim() || null,
  }));

  const { error } = await supabase
    .from("contenuti_sito")
    .upsert(righe, { onConflict: "chiave" });

  if (error) {
    console.error("[saveContenuti] upsert fallito:", error);
    throw new Error(error.message);
  }

  revalidatePath("/gestione/contenuti");
  revalidatePath("/");
}
