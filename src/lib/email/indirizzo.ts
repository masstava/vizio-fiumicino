// Regola unica per un indirizzo email che arriva da un campo libero
// (prenotazione, newsletter): un SOLO indirizzo, senza spazi o a capo
// (\s), virgole, punti e virgola, < >, al massimo 254 caratteri.
//
// La stessa regola vive nel database (public.email_valida, migration
// 20260912000000): crea_prenotazione e iscriviti_newsletter sono
// eseguibili da anon direttamente via PostgREST, saltando le Server
// Action — il controllo qui serve al messaggio chiaro per l'utente,
// quello nel database a non dipendere dal fatto che si passi di qui.
// Se cambia una, va cambiata anche l'altra.
//
// Modulo puro (nessun import server): usabile ovunque.

export const INDIRIZZO = /^[^@\s<>,;]+@[^@\s<>,;]+\.[^@\s<>,;]+$/;

const LUNGHEZZA_MASSIMA = 254;

/** L'indirizzo ripulito dagli spazi attorno, se valido; altrimenti undefined. */
export function indirizzoSingolo(valore: string | null | undefined): string | undefined {
  const pulito = valore?.trim();
  if (!pulito || pulito.length > LUNGHEZZA_MASSIMA || !INDIRIZZO.test(pulito)) return undefined;
  return pulito;
}
