import { Resend } from "resend";

// Mittente: un indirizzo sul dominio del locale, non un segreto — ma
// perché l'invio riesca deve essere verificato lato Resend (dominio
// aggiunto e DNS configurato). Non è qualcosa che questa sessione può
// fare al posto vostro: va predisposto nel pannello Resend.
export const MITTENTE_PRENOTAZIONI = "Vizio Bistrot <prenotazioni@vizio-fiumicino.it>";

// Chi riceve le notifiche operative sulle prenotazioni (nuova
// prenotazione, cancellazione self-service) — un dato nuovo si
// aggiunge QUI, mai ripetuto nei singoli punti di invio, stesso
// principio già in uso per i dati di contatto (src/lib/contatti.ts).
// Resend accetta un array in "to" nativamente: nessun invio multiplo
// da orchestrare a mano.
export const DESTINATARI_NOTIFICA_STAFF = [
  "info@vizio-fiumicino.it",
  "m.tavaroli@easydigitalgroup.it",
];

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
