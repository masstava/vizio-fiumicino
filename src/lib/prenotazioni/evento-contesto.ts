import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/lib/database.types";
import { campoLocalizzato } from "@/src/lib/i18n/campi";
import type { Locale } from "@/src/lib/i18n/config";

export interface CampoExtraEvento {
  id: string;
  etichetta: string;
}

// Alias e non interface: serve l'index signature implicito per
// risultare assegnabile a Json, il tipo del parametro jsonb di
// crea_prenotazione (stesso motivo di BadgeInput/FasciaInput in
// dashboard). Dichiarato qui — accanto a CampoExtraEvento, di cui è
// la risposta — e non nella route: sia _actions.ts (form pubblico)
// sia email.ts (§21 passo 3) ne hanno bisogno, e src/lib non deve
// dipendere da app/.
export type RispostaExtra = {
  etichetta: string;
  valore: string;
};

export interface ContestoEvento {
  id: string;
  titolo: string;
  campiExtra: CampoExtraEvento[];
}

/**
 * Interpreta la colonna jsonb risposte_extra: un array di oggetti
 * {etichetta, valore}, o niente. Condivisa fra la dashboard
 * (/gestione/prenotazioni) e la pagina di auto-gestione (§21 passo 5)
 * per non ridefinire due volte la stessa guardia sulla forma del
 * Json.
 */
export function risposteExtraDaJson(valore: unknown): RispostaExtra[] {
  if (!Array.isArray(valore)) return [];
  return valore.filter(
    (v): v is RispostaExtra =>
      typeof v === "object" &&
      v !== null &&
      typeof (v as RispostaExtra).etichetta === "string" &&
      typeof (v as RispostaExtra).valore === "string",
  );
}

/**
 * Contesto di un evento passato via ?evento_id=, per il form di
 * prenotazione. Se l'id non esiste o l'evento non è più attivo, si
 * ritorna null e il form si comporta come se il parametro non ci
 * fosse — un link salvato o condiviso verso un evento nel frattempo
 * disattivato non deve rompere la pagina, solo perdere il contesto.
 *
 * LIMITE NOTO: campi_extra_evento.etichetta non ha una colonna EN
 * nello schema applicato (solo etichetta, ordine, evento_id). Le
 * etichette compaiono quindi identiche in IT e in EN — non è un bug
 * di questa lettura, è un limite dello schema del passo 1. Non
 * corretto qui: cambiare lo schema è una decisione a parte, non da
 * prendere di straforo in questo step.
 */
const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getContestoEvento(
  supabase: SupabaseClient<Database>,
  locale: Locale,
  eventoId: string,
): Promise<ContestoEvento | null> {
  // eventoId arriva da un query param, quindi può essere qualunque
  // stringa: un "?evento_id=ciao" manderebbe la query a Postgres, che
  // rifiuterebbe un uuid mal formato con un errore invece di uno zero
  // risultati — e la pagina esploderebbe per un link scritto a mano.
  if (!FORMATO_UUID.test(eventoId)) return null;

  // Due letture indipendenti (entrambe dipendono solo da eventoId, non
  // l'una dall'altra): partono insieme.
  const [{ data: evento }, { data: campi }] = await Promise.all([
    supabase
      .from("eventi")
      .select("id, titolo, titolo_en, attivo")
      .eq("id", eventoId)
      .eq("attivo", true)
      .maybeSingle(),
    supabase
      .from("campi_extra_evento")
      .select("id, etichetta, ordine")
      .eq("evento_id", eventoId)
      .order("ordine"),
  ]);

  if (!evento) return null;

  return {
    id: evento.id,
    titolo: campoLocalizzato(evento.titolo, evento.titolo_en, locale),
    campiExtra: (campi ?? []).map((c) => ({ id: c.id, etichetta: c.etichetta })),
  };
}
