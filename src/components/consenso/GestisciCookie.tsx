"use client";

import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { useConsensoOpzionale } from "./ConsensoContext";

// Riapre il modale delle preferenze in qualsiasi momento — requisito
// esplicito: il consenso deve essere revocabile con la stessa facilità
// con cui è stato dato.
//
// useConsensoOpzionale e non useConsenso: il Footer è montato anche
// dove il provider potrebbe non esserci (pagine di errore, prove
// isolate). Senza provider il pulsante semplicemente non compare,
// invece di far esplodere il footer.
export function GestisciCookie({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const consenso = useConsensoOpzionale();
  if (!consenso) return null;

  return (
    <button
      type="button"
      onClick={consenso.apriPreferenze}
      className="inline-flex min-h-11 items-center font-sans text-xs text-muted-dark underline underline-offset-4 transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:min-h-0"
    >
      {t.consenso.gestisci}
    </button>
  );
}
