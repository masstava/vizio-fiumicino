"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import type {
  ArgomentiRpc,
  ArgomentiRpcStretti,
} from "@/src/lib/supabase/rpc";
import type { BadgeInput } from "./_components/types";

export async function toggleDisponibile(id: string, disponibile: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("piatti")
    .update({ disponibile })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/menu");
}

export async function deletePiatto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("piatti").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/menu");
}

// Alias e non interface: serve l'index signature implicito per
// risultare assegnabile a Json, il tipo del parametro jsonb della RPC.
export type OrdinePiatto = {
  id: string;
  ordine: number;
};

export async function reorderPiatti(
  categoriaId: string,
  ordini: OrdinePiatto[],
) {
  const supabase = await createClient();

  // Una singola chiamata RPC = un'unica istruzione SQL batch,
  // atomica: l'intera categoria si riordina o nessuna riga cambia.
  const { error } = await supabase.rpc("reorder_piatti", {
    p_categoria_id: categoriaId,
    p_ordini: ordini,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/gestione/menu");
}

export interface SavePiattoInput {
  id: string | null;
  categoria_id: string;
  nome: string;
  nome_en: string | null;
  descrizione: string | null;
  descrizione_en: string | null;
  prezzo: number | null;
  prezzo_variabile: boolean;
  disponibile: boolean;
  foto_url: string | null;
  allergeni: number[];
  badges: BadgeInput[];
  in_evidenza: boolean;
  in_evidenza_ordine: number | null;
  anteprima_home: boolean;
  anteprima_home_ordine: number | null;
}

export async function savePiatto(
  input: SavePiattoInput,
): Promise<{ id: string }> {
  const supabase = await createClient();

  // Tipizzati con ArgomentiRpc: nomi delle chiavi e tipi dei valori
  // restano controllati dai tipi generati dal database. Il cast alla
  // firma stretta serve solo perché il generatore emette i parametri
  // come non-nullable, mentre nella funzione Postgres il NULL è parte
  // del contratto — p_id nullo è proprio il modo in cui si distingue
  // un inserimento da un aggiornamento.
  const argomenti: ArgomentiRpc<"save_piatto"> = {
    p_id: input.id,
    p_categoria_id: input.categoria_id,
    p_nome: input.nome,
    p_nome_en: input.nome_en,
    p_descrizione: input.descrizione,
    p_descrizione_en: input.descrizione_en,
    p_prezzo: input.prezzo,
    p_prezzo_variabile: input.prezzo_variabile,
    p_disponibile: input.disponibile,
    p_foto_url: input.foto_url,
    p_allergeni: input.allergeni,
    p_badges: input.badges,
    p_in_evidenza: input.in_evidenza,
    p_in_evidenza_ordine: input.in_evidenza_ordine,
    p_anteprima_home: input.anteprima_home,
    p_anteprima_home_ordine: input.anteprima_home_ordine,
  };

  const { data, error } = await supabase.rpc(
    "save_piatto",
    argomenti as ArgomentiRpcStretti<"save_piatto">,
  );

  if (error) throw new Error(error.message);

  revalidatePath("/gestione/menu");
  // La home mostra la selezione curata: va rigenerata anche lei.
  revalidatePath("/");
  // Nessun cast: i tipi generati dichiarano che save_piatto ritorna
  // l'uuid del piatto.
  return { id: data };
}
