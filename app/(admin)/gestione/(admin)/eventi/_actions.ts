"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import type { ArgomentiRpc, ArgomentiRpcStretti } from "@/src/lib/supabase/rpc";

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

// Alias e non interface: serve l'index signature implicito per
// risultare assegnabile a Json, il tipo del parametro jsonb di
// save_evento (stesso motivo di BadgeInput in dashboard/menu).
export type CampoExtraInput = {
  etichetta: string;
};

export interface SaveEventoInput {
  id: string | null;
  titolo: string;
  titolo_en: string | null;
  descrizione: string | null;
  descrizione_en: string | null;
  data_evento: string | null;
  attivo: boolean;
  /** Fino a 3, ordine = posizione nell'array — vincolo d'interfaccia, non del DB. */
  campiExtra: CampoExtraInput[];
}

/**
 * Scrive eventi + campi_extra_evento in un'unica transazione tramite
 * la funzione save_evento (sostituzione completa dei campi extra a
 * ogni salvataggio, stesso schema di save_piatto per badge/allergeni):
 * un fallimento a metà strada non lascia un evento con solo alcuni
 * campi extra aggiornati.
 */
export async function saveEvento(
  input: SaveEventoInput,
): Promise<{ id: string }> {
  const supabase = await createClient();

  const argomenti: ArgomentiRpc<"save_evento"> = {
    p_id: input.id,
    p_titolo: input.titolo,
    p_titolo_en: input.titolo_en,
    p_descrizione: input.descrizione,
    p_descrizione_en: input.descrizione_en,
    p_data_evento: input.data_evento,
    p_attivo: input.attivo,
    p_campi_extra: input.campiExtra.map((c, ordine) => ({
      etichetta: c.etichetta,
      ordine,
    })),
  };

  const { data, error } = await supabase.rpc(
    "save_evento",
    argomenti as ArgomentiRpcStretti<"save_evento">,
  );

  if (error) throw new Error(error.message);

  revalidatePath("/gestione/eventi");
  return { id: data };
}
