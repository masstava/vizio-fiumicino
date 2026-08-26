"use server";

import { createClient } from "@/src/lib/supabase/server";
import { campoLocalizzato } from "@/src/lib/i18n/campi";
import type { Locale } from "@/src/lib/i18n/config";
import { risposteExtraDaJson, type RispostaExtra } from "@/src/lib/prenotazioni/evento-contesto";
import { inviaEmailNotificaStaffCancellazione } from "@/src/lib/prenotazioni/email";

export interface PrenotazioneToken {
  id: string;
  nome: string;
  /** "YYYY-MM-DD" */
  data: string;
  /** "HH:MM" */
  fascia: string;
  coperti: number;
  note: string | null;
  stato: string;
  eventoTitolo: string | null;
  risposteExtra: RispostaExtra[];
}

/**
 * Legge una prenotazione dal token del link di auto-gestione, tramite
 * la RPC prenotazione_da_token — mai un accesso diretto alla tabella,
 * che non ha lettura pubblica. Un token mancante, mal formato o che
 * non corrisponde a nessuna riga produce null: il chiamante non deve
 * distinguere questi casi, sono tutti "nessuna prenotazione da
 * mostrare" per chi visita il link.
 */
export async function leggiPrenotazioneDaToken(
  token: string,
  locale: Locale,
): Promise<PrenotazioneToken | null> {
  if (!token.trim()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("prenotazione_da_token", {
    p_token: token,
  });

  if (error) {
    console.error("[leggiPrenotazioneDaToken] RPC fallita:", error);
    return null;
  }

  const riga = data?.[0];
  if (!riga) return null;

  return {
    id: riga.id,
    nome: riga.nome,
    data: riga.data,
    fascia: riga.fascia.slice(0, 5),
    coperti: riga.coperti,
    note: riga.note,
    stato: riga.stato,
    eventoTitolo: riga.evento_id
      ? campoLocalizzato(riga.evento_titolo, riga.evento_titolo_en, locale)
      : null,
    risposteExtra: risposteExtraDaJson(riga.risposte_extra),
  };
}

export type AnnullaEsito = { ok: true } | { ok: false; messaggio: string };

/**
 * Cancella una prenotazione tramite la RPC annulla_prenotazione, MAI
 * un update diretto: la funzione garantisce che si possa cancellare
 * solo una prenotazione ancora "confermata" (un secondo tentativo
 * sullo stesso token, o su una già completata/no-show, torna zero
 * righe senza toccare nulla — non serve verificarlo qui prima).
 *
 * La funzione restituisce i dettagli della riga appena cancellata
 * (non solo un booleano): servono per avvisare lo staff via email che
 * il CLIENTE ha cancellato — completamento simmetrico del passo 5,
 * che finora avvisava solo nella direzione staff → cliente. La
 * cancellazione è già cosa fatta a questo punto (l'update è dentro la
 * RETURNING della RPC): l'email è una notifica in più, non una
 * condizione — se l'invio fallisce (vedi email.ts, non lancia mai)
 * l'esito resta comunque "cancellata con successo".
 */
export async function annullaPrenotazioneToken(token: string): Promise<AnnullaEsito> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("annulla_prenotazione", {
    p_token: token,
  });

  if (error) {
    console.error("[annullaPrenotazioneToken] RPC fallita:", error);
    return { ok: false, messaggio: error.message };
  }

  const riga = data?.[0];
  if (!riga) {
    return { ok: false, messaggio: "Non cancellabile: già gestita o token non valido." };
  }

  await inviaEmailNotificaStaffCancellazione({
    id: riga.id,
    nome: riga.nome,
    telefono: riga.telefono,
    email: riga.email,
    data: riga.data,
    fascia: riga.fascia.slice(0, 5),
    coperti: riga.coperti,
    note: riga.note,
    eventoTitolo: riga.evento_titolo,
    risposteExtra: risposteExtraDaJson(riga.risposte_extra),
  });

  return { ok: true };
}
