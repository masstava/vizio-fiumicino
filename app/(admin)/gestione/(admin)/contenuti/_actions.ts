"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { CHIAVI_CONTENUTI } from "@/src/lib/contenuti";
import { PAGINE_MEDIA_SITO } from "@/src/lib/media-pagine";

export async function saveContenuti(
  valori: Record<string, string>,
  valoriEn: Record<string, string>,
) {
  const supabase = await createClient();

  // Solo le chiavi dichiarate nel codice: un payload manomesso non
  // può inserire righe arbitrarie in tabella.
  const righe = CHIAVI_CONTENUTI.map((chiave) => ({
    chiave,
    valore: (valori[chiave] ?? "").trim() || null,
    valore_en: (valoriEn[chiave] ?? "").trim() || null,
  }));

  const { error } = await supabase
    .from("contenuti_sito")
    .upsert(righe, { onConflict: "chiave" });

  if (error) {
    console.error("[saveContenuti] upsert fallito:", error);
    throw new Error(error.message);
  }

  revalidatePath("/gestione/contenuti/testi");
  revalidatePath("/");
}

export interface SelezioneSlot {
  piatto_id: string;
  ordine: number;
}

/**
 * Sostituzione completa di piatti_in_evidenza e piatti_anteprima_home,
 * stesso principio di saveOrari/salvaCapienzaGiorno: la dashboard manda
 * lo stato completo di ciascuna lista (in ordine) invece di un
 * salvataggio per singolo slot. Le due liste sono indipendenti: uno
 * stesso piatto può comparire in entrambe, in nessuna delle due, o
 * solo in una.
 *
 * Nessuna funzione dedicata (a differenza di save_piatto): come
 * capienza_config, non c'è qui un'entità padre da aggiornare insieme
 * — solo due tabelle ponte indipendenti, delete+insert bastano.
 *
 * save_piatto scrive ANCORA in queste due tabelle quando si salva un
 * singolo piatto (i suoi parametri in_evidenza/anteprima_home restano
 * nel form, ma sono di sola lettura — vedi DishForm.tsx): questa
 * azione e quella restano entrambe fonti legittime di scrittura,
 * ognuna con l'istantanea più recente al momento in cui gira.
 */
export async function salvaSelezioneHome(
  evidenza: SelezioneSlot[],
  anteprima: SelezioneSlot[],
): Promise<void> {
  const supabase = await createClient();

  const { error: erroreEvidenzaDelete } = await supabase
    .from("piatti_in_evidenza")
    .delete()
    .not("piatto_id", "is", null);
  if (erroreEvidenzaDelete) {
    console.error("[salvaSelezioneHome] delete evidenza fallito:", erroreEvidenzaDelete);
    throw new Error(erroreEvidenzaDelete.message);
  }
  if (evidenza.length > 0) {
    const { error } = await supabase.from("piatti_in_evidenza").insert(evidenza);
    if (error) {
      console.error("[salvaSelezioneHome] insert evidenza fallito:", error);
      throw new Error(error.message);
    }
  }

  const { error: erroreAnteprimaDelete } = await supabase
    .from("piatti_anteprima_home")
    .delete()
    .not("piatto_id", "is", null);
  if (erroreAnteprimaDelete) {
    console.error("[salvaSelezioneHome] delete anteprima fallito:", erroreAnteprimaDelete);
    throw new Error(erroreAnteprimaDelete.message);
  }
  if (anteprima.length > 0) {
    const { error } = await supabase.from("piatti_anteprima_home").insert(anteprima);
    if (error) {
      console.error("[salvaSelezioneHome] insert anteprima fallito:", error);
      throw new Error(error.message);
    }
  }

  revalidatePath("/gestione/contenuti");
  revalidatePath("/gestione/menu");
  revalidatePath("/");
}

/**
 * Imposta o rimuove (url null) il media di uno slot di pagina — vedi
 * supabase/migrations/20260901000000_media_pagine.sql. Un solo slot
 * per pagina oggi ("hero", il default): non serve un parametro slot
 * finché non arriva davvero una seconda immagine sulla stessa pagina.
 */
export async function salvaMediaPagina(
  pagina: string,
  url: string | null,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("media_pagine")
    .upsert({ pagina, slot: "hero", url }, { onConflict: "pagina,slot" });

  if (error) {
    console.error("[salvaMediaPagina] upsert fallito:", error, { pagina });
    throw new Error(error.message);
  }

  revalidatePath("/gestione/contenuti/foto");
  revalidatePath("/gestione"); // il contatore sidebar vive nel layout
  const percorsoPubblico = PAGINE_MEDIA_SITO.find((p) => p.pagina === pagina)
    ? pagina === "home"
      ? "/"
      : `/${pagina}`
    : null;
  if (percorsoPubblico) revalidatePath(percorsoPubblico);
}
