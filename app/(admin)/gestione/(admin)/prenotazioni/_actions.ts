"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

// Stesso enum del check constraint su prenotazioni.stato (migration
// del passo 1) — qui solo per la sicurezza dei tipi lato dashboard, il
// database resta la fonte di verità sui valori ammessi.
export type StatoPrenotazione =
  | "confermata"
  | "cancellata"
  | "completata"
  | "no-show";

export async function cambiaStatoPrenotazione(
  id: string,
  stato: StatoPrenotazione,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prenotazioni")
    .update({ stato })
    .eq("id", id);

  if (error) {
    console.error("[cambiaStatoPrenotazione] update fallito:", error, {
      id,
      stato,
    });
    throw new Error(error.message);
  }
  revalidatePath("/gestione/prenotazioni");
}

export interface RigaCapienzaInput {
  /** "HH:MM" */
  fascia: string;
  /** null = nessun tetto per quella fascia. */
  limiteCoperti: number | null;
}

/**
 * Salva la capienza di un intero giorno in un colpo, stesso principio
 * di saveOrari: la dashboard manda lo stato completo della griglia
 * (una riga per fascia, con o senza limite) invece di un salvataggio
 * per singolo campo.
 *
 * capienza_config non ha una funzione atomica dedicata: a differenza
 * di save_piatto/save_evento non c'è qui un'entità padre da
 * creare/aggiornare insieme ai figli, solo righe indipendenti con
 * (data, fascia) come chiave — un upsert e una delete bastano.
 */
export async function salvaCapienzaGiorno(
  data: string,
  righe: RigaCapienzaInput[],
): Promise<void> {
  const supabase = await createClient();

  const daImpostare = righe.filter((r) => r.limiteCoperti != null);
  const daRimuovere = righe
    .filter((r) => r.limiteCoperti == null)
    .map((r) => r.fascia);

  if (daImpostare.length > 0) {
    const { error } = await supabase.from("capienza_config").upsert(
      daImpostare.map((r) => ({
        data,
        fascia: r.fascia,
        limite_coperti: r.limiteCoperti,
      })),
      { onConflict: "data,fascia" },
    );
    if (error) {
      console.error("[salvaCapienzaGiorno] upsert fallito:", error, { data });
      throw new Error(error.message);
    }
  }

  if (daRimuovere.length > 0) {
    const { error } = await supabase
      .from("capienza_config")
      .delete()
      .eq("data", data)
      .in("fascia", daRimuovere);
    if (error) {
      console.error("[salvaCapienzaGiorno] delete fallito:", error, { data });
      throw new Error(error.message);
    }
  }

  revalidatePath("/gestione/prenotazioni");
}
