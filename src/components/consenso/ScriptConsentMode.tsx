import { scriptConsentMode } from "@/src/lib/consenso/consent-mode";
import { CHIAVE_LOCALSTORAGE, VERSIONE_CONSENSO } from "@/src/lib/consenso/tipi";

// Va reso come PRIMO figlio di <head>, prima di qualunque altro tag.
//
// Volutamente un <script> inline e non next/script: le strategie di
// next/script (afterInteractive, beforeInteractive) non garantiscono
// di stare davanti a tutto dentro <head>, e qui l'ordine è il
// requisito. Un tag inline scritto per primo nel markup viene
// eseguito per primo, senza intermediari.
//
// Non fa richieste di rete e non imposta cookie: dichiara soltanto lo
// stato di default e riapplica un consenso già dato.
export function ScriptConsentMode() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: scriptConsentMode(CHIAVE_LOCALSTORAGE, VERSIONE_CONSENSO),
      }}
    />
  );
}
