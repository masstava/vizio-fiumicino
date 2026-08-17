"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export interface FasciaInput {
  giorno_settimana: number;
  ordine: number;
  apertura: string | null;
  chiusura: string | null;
}

export async function saveOrari(rows: FasciaInput[]) {
  const supabase = await createClient();

  // delete+insert dentro un'unica funzione Postgres: atomico anche
  // con un numero variabile di fasce per giorno (un upsert singolo
  // non basta più a garantirlo, vedi migration save_orari_function).
  const { error } = await supabase.rpc("save_orari", { p_rows: rows });

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/orari");
}
