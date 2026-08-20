// URL pubblico del sito, per canonical e URL assoluti delle immagini
// Open Graph (le anteprime social non accettano percorsi relativi).
//
// Ordine di risoluzione:
//   1. NEXT_PUBLIC_SITE_URL — impostata a mano per ambiente su Vercel.
//      In produzione vale https://vizio-fiumicino.it.
//   2. VERCEL_URL — l'indirizzo del deploy corrente, usato nelle
//      anteprime, dove il dominio finale serve ancora il vecchio sito
//      WordPress e punterebbe a immagini inesistenti.
//   3. localhost, per lo sviluppo in locale.
export const SITE_URL = (() => {
  const esplicito = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (esplicito) return esplicito.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
})();
