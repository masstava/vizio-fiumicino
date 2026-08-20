// URL pubblico del sito, per canonical e URL assoluti delle immagini
// Open Graph (le anteprime social non accettano percorsi relativi).
//
// Ordine di risoluzione:
//   1. SITE_URL — variabile solo lato server, letta a runtime. È la
//      più affidabile: si può cambiare senza ricostruire il progetto.
//   2. NEXT_PUBLIC_SITE_URL — attenzione: Next sostituisce le
//      NEXT_PUBLIC_* con il loro valore al momento della BUILD, anche
//      nel codice server. Se la si imposta solo a runtime non ha
//      effetto. Su Vercel va definita prima del deploy.
//   3. VERCEL_URL — l'indirizzo del deploy corrente, usato nelle
//      anteprime, dove il dominio finale serve ancora il vecchio sito
//      WordPress e punterebbe a immagini inesistenti.
//   4. localhost, per lo sviluppo in locale.
export const SITE_URL = (() => {
  const runtime = process.env.SITE_URL?.trim();
  if (runtime) return runtime.replace(/\/$/, "");

  const pubblico = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (pubblico) return pubblico.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
})();
