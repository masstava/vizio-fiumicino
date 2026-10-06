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
//   3. Solo in produzione (VERCEL_ENV=production):
//      VERCEL_PROJECT_PRODUCTION_URL, il dominio di produzione del
//      progetto, STABILE. VERCEL_URL in produzione è invece l'indirizzo
//      univoco di quel singolo deploy: un link di gestione prenotazione
//      inviato per email ci resterebbe legato anche dopo i deploy
//      successivi.
//      ATTENZIONE: Vercel sceglie qui il dominio personalizzato più
//      corto del progetto, se ce n'è uno. Se vizio-fiumicino.it venisse
//      aggiunto al progetto Vercel PRIMA del cambio DNS, i link nelle
//      email punterebbero al vecchio WordPress fino al cutover.
//   4. VERCEL_URL — l'indirizzo del deploy corrente: preview, e
//      produzione se manca la variabile sopra.
//   5. localhost, per lo sviluppo in locale.
//
// L'interruttore dell'indicizzazione NON passa di qui: legge solo
// SITE_URL (src/lib/indicizzazione.ts).
export const SITE_URL = (() => {
  const runtime = process.env.SITE_URL?.trim();
  if (runtime) return runtime.replace(/\/$/, "");

  const pubblico = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (pubblico) return pubblico.replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production") {
    const produzione = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (produzione) return `https://${produzione.replace(/\/$/, "")}`;
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
})();
