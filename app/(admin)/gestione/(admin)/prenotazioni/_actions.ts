"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { isLocale } from "@/src/lib/i18n/config";
import { inviaEmailCancellazioneCliente } from "@/src/lib/prenotazioni/email";

// Stesso enum del check constraint su prenotazioni.stato (migration
// del passo 1) — qui solo per la sicurezza dei tipi lato dashboard, il
// database resta la fonte di verità sui valori ammessi.
export type StatoPrenotazione =
  | "confermata"
  | "cancellata"
  | "completata"
  | "no-show";

/**
 * Cambia lo stato di una prenotazione. Se il nuovo stato è
 * "cancellata", avvisa il cliente per email (§21 passo 5) — è lo
 * staff a cancellare per lui, non un'azione che il cliente ha fatto:
 * senza un avviso lo scoprirebbe solo presentandosi al locale.
 *
 * L'email non condiziona l'esito di questa action: se l'invio
 * fallisce (vedi email.ts, non lancia mai) il cambio di stato resta
 * comunque valido — stessa filosofia del passo 3.
 */
export async function cambiaStatoPrenotazione(
  id: string,
  stato: StatoPrenotazione,
): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prenotazioni")
    .update({ stato })
    .eq("id", id)
    .select("nome, email, data, fascia, coperti, locale")
    .single();

  if (error) {
    console.error("[cambiaStatoPrenotazione] update fallito:", error, {
      id,
      stato,
    });
    throw new Error(error.message);
  }
  revalidatePath("/gestione/prenotazioni");

  if (stato === "cancellata") {
    await inviaEmailCancellazioneCliente({
      id,
      locale: isLocale(data.locale) ? data.locale : "it",
      nome: data.nome,
      email: data.email,
      data: data.data,
      fascia: data.fascia.slice(0, 5),
      coperti: data.coperti,
    });
  }
}

/**
 * Segna una prenotazione come vista — chiamata quando lo staff apre il
 * pannello di dettaglio. Una sola direzione (false → true): il
 * chiamante (PrenotazioniListClient) invoca questa action solo se la
 * riga non era già vista, quindi qui non serve rileggerla prima.
 *
 * Il filtro .eq("vista", false) è una rete di sicurezza in più, non la
 * fonte di verità: se per qualunque motivo arrivasse comunque una
 * chiamata su una riga già vista, l'update non troverebbe righe e
 * resterebbe un no-op invece di un errore o di un touch inutile di
 * aggiornata_il.
 *
 * Nessun rollback ottimistico lato client se questa fallisce (a
 * differenza di cambiaStatoPrenotazione): lo staff ha comunque aperto
 * e visto la prenotazione, indipendentemente dall'esito di questo
 * scrivere — un fallimento qui si autocorregge da solo al prossimo
 * caricamento della pagina.
 */
export async function segnaPrenotazioneVista(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prenotazioni")
    .update({ vista: true })
    .eq("id", id)
    .eq("vista", false);

  if (error) {
    console.error("[segnaPrenotazioneVista] update fallito:", error, { id });
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
