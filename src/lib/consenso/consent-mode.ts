import type { Scelte } from "./tipi";

// =============================================================
// Consent Mode v2 di Google
// =============================================================
// Corrispondenza fra le nostre quattro categorie e i segnali che
// Google si aspetta. Non è una scelta estetica: usare nomi diversi
// significherebbe che i tag Google non vedono mai il consenso.
//
// security_storage resta sempre "granted": copre antifrode e
// sicurezza, che non richiedono consenso.
type Segnale = "granted" | "denied";

export function segnaliDa(scelte: Scelte): Record<string, Segnale> {
  const si = (ok: boolean): Segnale => (ok ? "granted" : "denied");
  return {
    ad_storage: si(scelte.marketing),
    ad_user_data: si(scelte.marketing),
    ad_personalization: si(scelte.marketing),
    analytics_storage: si(scelte.analytics),
    functionality_storage: si(scelte.functional),
    personalization_storage: si(scelte.functional),
    security_storage: "granted",
  };
}

// Script inline da mettere per PRIMO in <head>, prima di qualunque
// altro tag.
//
// Perché adesso, con GA4 non ancora integrato: Consent Mode funziona
// solo se lo stato di default è già dichiarato QUANDO un tag Google
// si carica. Aggiungerlo insieme a GA4, in un secondo momento, lascia
// una finestra in cui il tag parte senza default — cioè raccoglie
// prima del consenso. Metterlo ora costa qualche riga e chiude il
// problema in anticipo.
//
// Fa tre cose, in ordine:
//   1. dichiara tutto negato tranne security_storage;
//   2. rilegge il consenso già dato (localStorage) e, se valido, lo
//      applica subito con un "update" — senza questo, chi torna sul
//      sito verrebbe trattato come se avesse rifiutato finché React
//      non si è idratato;
//   3. non lancia mai: un'eccezione qui bloccherebbe il resto di
//      <head>.
export function scriptConsentMode(
  chiave: string,
  versione: number,
): string {
  return `
(function(){
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  var NEGATO = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500
  };
  gtag('consent', 'default', NEGATO);

  try {
    var grezzo = localStorage.getItem(${JSON.stringify(chiave)});
    if (!grezzo) return;
    var salvato = JSON.parse(grezzo);
    if (!salvato || salvato.versione !== ${versione}) return;
    if (salvato.scadeIl && new Date(salvato.scadeIl) <= new Date()) return;
    var s = salvato.scelte || {};
    var si = function(v){ return v ? 'granted' : 'denied'; };
    gtag('consent', 'update', {
      ad_storage: si(s.marketing),
      ad_user_data: si(s.marketing),
      ad_personalization: si(s.marketing),
      analytics_storage: si(s.analytics),
      functionality_storage: si(s.functional),
      personalization_storage: si(s.functional),
      security_storage: 'granted'
    });
  } catch (e) {
    /* localStorage negato o JSON corrotto: si resta sul default negato. */
  }
})();`.trim();
}

// Aggiornamento a caldo, dopo una scelta dell'utente.
//
// Passa da window.gtag, definita dallo script inline. Se quella
// mancasse (script bloccato da un'estensione, CSP), si ricrea la
// stessa forma: gtag.js si aspetta sul dataLayer un oggetto
// "arguments", NON un array normale — i due non sono equivalenti e
// spingere un array farebbe ignorare silenziosamente l'aggiornamento.
type FunzioneGtag = (...argomenti: unknown[]) => void;

interface FinestraConGtag extends Window {
  dataLayer?: unknown[];
  gtag?: FunzioneGtag;
}

export function aggiornaConsentMode(scelte: Scelte): void {
  if (typeof window === "undefined") return;
  const w = window as FinestraConGtag;

  if (typeof w.gtag !== "function") {
    w.dataLayer = w.dataLayer || [];
    const coda = w.dataLayer;
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      coda.push(arguments);
    };
  }

  w.gtag("consent", "update", segnaliDa(scelte));
}
