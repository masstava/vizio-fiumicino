import { Resend } from "resend";

// Mittente e destinatari staff: variabili d'ambiente, con i valori
// storici come ricaduta — così un cambio di dominio o sottodominio
// (es. il giorno del cutover, o un mittente su un sottodominio
// dedicato alle email) si fa da Vercel + redeploy, senza commit.
//
// Il mittente deve comunque stare su un dominio verificato nel
// pannello Resend: è un passaggio da fare lì, non qui.
//
// Una variabile impostata ma malformata NON blocca le email: si usa la
// ricaduta e l'errore finisce nei log. Un refuso in una variabile non
// deve far perdere le conferme di prenotazione.
const MITTENTE_PREDEFINITO = "Vizio Bistrot <prenotazioni@vizio-fiumicino.it>";
const DESTINATARI_STAFF_PREDEFINITI = [
  "info@vizio-fiumicino.it",
  "m.tavaroli@easydigitalgroup.it",
];

const INDIRIZZO = /^[^@\s<>,;]+@[^@\s<>,;]+\.[^@\s<>,;]+$/;

/** Accetta "Nome <indirizzo>" oppure l'indirizzo da solo. */
function mittenteValido(valore: string): boolean {
  const traParentesi = valore.match(/<([^<>]+)>$/);
  return INDIRIZZO.test((traParentesi ? traParentesi[1] : valore).trim());
}

export const MITTENTE_PRENOTAZIONI = (() => {
  const valore = process.env.EMAIL_MITTENTE?.trim();
  if (!valore) return MITTENTE_PREDEFINITO;
  if (mittenteValido(valore)) return valore;
  console.error("[email] EMAIL_MITTENTE non valida, uso il mittente predefinito:", valore);
  return MITTENTE_PREDEFINITO;
})();

// Chi riceve le notifiche operative sulle prenotazioni (nuova
// prenotazione, cancellazione self-service). Resend accetta un array in
// "to" nativamente: nessun invio multiplo da orchestrare a mano.
// EMAIL_DESTINATARI_STAFF: indirizzi separati da virgola.
export const DESTINATARI_NOTIFICA_STAFF = (() => {
  const valore = process.env.EMAIL_DESTINATARI_STAFF?.trim();
  if (!valore) return DESTINATARI_STAFF_PREDEFINITI;
  const voci = valore.split(",").map((v) => v.trim()).filter(Boolean);
  const validi = voci.filter((v) => INDIRIZZO.test(v));
  const scartati = voci.filter((v) => !INDIRIZZO.test(v));
  if (scartati.length > 0) {
    console.error("[email] EMAIL_DESTINATARI_STAFF: indirizzi non validi ignorati:", scartati);
  }
  if (validi.length === 0) {
    console.error("[email] EMAIL_DESTINATARI_STAFF senza indirizzi validi, uso i destinatari predefiniti");
    return DESTINATARI_STAFF_PREDEFINITI;
  }
  return validi;
})();

let client: Resend | null | undefined;

/**
 * Client Resend costruito alla prima chiamata utile, non a ogni
 * import: così un ambiente senza RESEND_API_KEY (es. preview non
 * ancora configurato) non fa esplodere nulla al caricamento del
 * modulo — l'assenza della chiave si scopre solo quando si tenta
 * davvero di inviare, e lì viene loggata (vedi email.ts).
 */
export function clientResend(): Resend | null {
  if (client !== undefined) return client;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  client = apiKey ? new Resend(apiKey) : null;
  return client;
}
