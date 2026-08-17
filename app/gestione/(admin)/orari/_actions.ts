"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export interface OrarioInput {
  giorno_settimana: number;
  apertura: string | null;
  chiusura: string | null;
}

export async function saveOrari(rows: OrarioInput[]) {
  const supabase = await createClient();

  // Un'unica chiamata upsert su più righe = una singola istruzione SQL
  // (INSERT ... ON CONFLICT DO UPDATE): atomica di per sé, nessun
  // rischio di salvare solo alcuni giorni.
  const { error } = await supabase
    .from("orari")
    .upsert(rows, { onConflict: "giorno_settimana" });

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/orari");
}
