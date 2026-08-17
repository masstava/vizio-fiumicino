"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export async function toggleAttivo(id: string, attivo: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("eventi")
    .update({ attivo })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/eventi");
}

export async function deleteEvento(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("eventi").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/eventi");
}

export interface SaveEventoInput {
  id: string | null;
  titolo: string;
  titolo_en: string | null;
  descrizione: string | null;
  descrizione_en: string | null;
  data_evento: string | null;
  attivo: boolean;
}

export async function saveEvento(
  input: SaveEventoInput,
): Promise<{ id: string }> {
  const supabase = await createClient();

  const payload = {
    titolo: input.titolo,
    titolo_en: input.titolo_en,
    descrizione: input.descrizione,
    descrizione_en: input.descrizione_en,
    data_evento: input.data_evento,
    attivo: input.attivo,
  };

  const query = input.id
    ? supabase.from("eventi").update(payload).eq("id", input.id)
    : supabase.from("eventi").insert(payload);

  const { data, error } = await query.select("id").single();

  if (error) throw new Error(error.message);

  revalidatePath("/gestione/eventi");
  return { id: data.id };
}
