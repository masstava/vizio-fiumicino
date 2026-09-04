"use server";

import { createClient } from "@/src/lib/supabase/server";
import type { ArgomentiRpc, ArgomentiRpcStretti } from "@/src/lib/supabase/rpc";
import type { Locale } from "@/src/lib/i18n/config";
import { inviaEmailBenvenutoNewsletter } from "./email";

// Condivisa fra due punti di iscrizione (form newsletter in home e
// invito post-prenotazione in /prenota): non è un'action scoped a una
// singola rotta, per questo vive qui e non in un _actions.ts sotto
// app/ — stesso trattamento già dato alla logica di dominio
// riutilizzabile (src/lib/prenotazioni/*).

export interface IscrivitiNewsletterInput {
  email: string;
  /** Solo per personalizzare l'email di benvenuto — non persistito. */
  nome: string | null;
  locale: Locale;
  /**
   * Campo honeypot: stesso principio di CreaPrenotazioneInput.honeypot
   * in /prenota — invisibile a un utente reale, un valore non vuoto
   * significa quasi certamente un bot.
   */
  honeypot: string;
}

export type IscrivitiNewsletterEsito =
  | { ok: true; codice: string }
  | { ok: false; motivo: "RATE_LIMITED" | "GENERICO" };

/**
 * Unica via di iscrizione alla newsletter: chiama la RPC
 * iscriviti_newsletter, mai un insert diretto — coupon non ha
 * comunque una policy di insert pubblica, ma anche se l'avesse,
 * saltare la funzione vorrebbe dire saltare l'idempotenza per email e
 * la generazione del codice.
 *
 * Il limite di richieste per IP vive DENTRO iscriviti_newsletter
 * stessa (§ audit di sicurezza esterno, migration 20260904000000), non
 * più in un controllo separato fatto da questa action: altrimenti chi
 * chiamasse la RPC direttamente via PostgREST salterebbe il controllo.
 * L'IP non è più un parametro passato da qui — la funzione lo deriva
 * da sola lato server.
 */
export async function iscrivitiNewsletter(
  input: IscrivitiNewsletterInput,
): Promise<IscrivitiNewsletterEsito> {
  // Honeypot compilato: scarto silenzioso, nessuna chiamata al
  // database, ma un esito di successo con un codice fittizio — un
  // errore insegnerebbe al bot che il campo è stato notato. Nessun
  // coupon reale esiste dietro questo codice.
  if (input.honeypot) {
    console.warn("[iscrivitiNewsletter] richiesta scartata: campo honeypot compilato");
    return { ok: true, codice: codiceFittizio() };
  }

  const email = input.email.trim().toLowerCase();
  if (!email) {
    return { ok: false, motivo: "GENERICO" };
  }

  const supabase = await createClient();

  const argomenti: ArgomentiRpc<"iscriviti_newsletter"> = { p_email: email };
  const { data: codice, error } = await supabase.rpc(
    "iscriviti_newsletter",
    argomenti as ArgomentiRpcStretti<"iscriviti_newsletter">,
  );

  if (error) {
    if (error.message === "RATE_LIMITATO") {
      return { ok: false, motivo: "RATE_LIMITED" };
    }
    console.error("[iscrivitiNewsletter] rpc fallita:", error, { email });
    return { ok: false, motivo: "GENERICO" };
  }

  if (!codice) {
    console.error("[iscrivitiNewsletter] rpc senza codice restituito", { email });
    return { ok: false, motivo: "GENERICO" };
  }

  // Il coupon esiste ed è già valido a questo punto: l'email è una
  // notifica, non una condizione. Stesso principio di
  // inviaEmailPrenotazione — non propaga mai un errore.
  await inviaEmailBenvenutoNewsletter({
    email,
    nome: input.nome?.trim() || null,
    codice,
    locale: input.locale,
  });

  return { ok: true, codice };
}

const ALFABETO_FITTIZIO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function codiceFittizio(): string {
  let codice = "";
  for (let i = 0; i < 8; i++) {
    codice += ALFABETO_FITTIZIO[Math.floor(Math.random() * ALFABETO_FITTIZIO.length)];
  }
  return codice;
}
