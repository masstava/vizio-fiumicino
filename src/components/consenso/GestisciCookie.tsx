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
export function GestisciCookie({
  locale,
  tono = "scuro",
}: {
  locale: Locale;
  /** "scuro" per il footer, "chiaro" dentro le informative. */
  tono?: "scuro" | "chiaro";
}) {
  const t = getDizionario(locale);
  const consenso = useConsensoOpzionale();
  if (!consenso) return null;

  const colori =
    tono === "scuro"
      ? "text-muted-dark hover:text-cream-text focus-visible:ring-cream-text"
      : "text-bordeaux hover:opacity-80 focus-visible:ring-bordeaux";

  return (
    <button
      type="button"
      onClick={consenso.apriPreferenze}
      className={`inline-flex min-h-11 items-center font-sans text-sm underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 md:min-h-0 ${colori}`}
    >
      {t.consenso.gestisci}
    </button>
  );
}
