// Punto unico da cui passano gli eventi di analytics.
//
// GA4 NON è ancora integrato: arriva in uno step dedicato, insieme al
// Consent Mode. Finché non c'è, questa funzione spinge l'evento nel
// dataLayer se esiste e non fa nulla se non esiste — così i punti di
// tracciamento sono già al loro posto nel codice e l'integrazione si
// riduce a caricare lo script, senza rincorrere i singoli componenti.
//
// Nessun dato personale negli eventi: solo il nome e parametri non
// identificativi. Quando arriverà il CMP, il consenso sarà gestito da
// GA4 stesso via Consent Mode, non qui.

type ParametriEvento = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function tracciaEvento(nome: string, parametri?: ParametriEvento): void {
  if (typeof window === "undefined") return;
  window.dataLayer?.push({ event: nome, ...parametri });
}
