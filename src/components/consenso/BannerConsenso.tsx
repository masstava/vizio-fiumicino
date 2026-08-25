"use client";

import { useRegistraOverlay } from "@/src/components/overlay/OverlayContext";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { useConsenso } from "./ConsensoContext";

// Barra discreta in fondo allo schermo, non un modale a tutta pagina:
// il sito resta leggibile e navigabile mentre l'utente decide.
//
// NESSUN DARK PATTERN, ed è un vincolo di forma preciso: i tre
// pulsanti hanno la stessa classe, quindi stessa dimensione, stesso
// colore, stesso peso tipografico e stesso ordine di lettura. Non c'è
// un "Accetta" grande e colorato accanto a un "Rifiuta" grigio e
// piccolo, e "Rifiuta tutti" sta allo stesso livello di "Accetta
// tutti" — non nascosto dentro "Personalizza".
//
// Si registra nel registro degli overlay finché è visibile, così il
// bottone WhatsApp non gli finisce sopra coprendo un pulsante.
export function BannerConsenso({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const { bannerVisibile, accettaTutti, rifiutaTutti, apriPreferenze } =
    useConsenso();

  useRegistraOverlay(bannerVisibile);

  if (!bannerVisibile) return null;

  // Identica per tutti e tre: è la garanzia di parità visiva.
  const pulsante =
    "inline-flex min-h-11 flex-1 items-center justify-center rounded-[2px] border border-cream-text/40 px-4 font-sans text-sm font-medium text-cream-text transition-colors hover:bg-cream-text/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text focus-visible:ring-offset-2 focus-visible:ring-offset-dark sm:flex-none sm:px-5";

  return (
    <div
      role="region"
      aria-label={t.consenso.etichettaBanner}
      className="fixed inset-x-0 bottom-0 z-[45] border-t border-cream-text/15 bg-dark/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:gap-8 md:px-8">
        <div className="md:flex-1">
          <p className="font-sans text-sm font-medium text-cream-text">
            {t.consenso.titolo}
          </p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-muted-dark">
            {t.consenso.testo}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:flex-shrink-0">
          <button type="button" onClick={accettaTutti} className={pulsante}>
            {t.consenso.accettaTutti}
          </button>
          <button type="button" onClick={rifiutaTutti} className={pulsante}>
            {t.consenso.rifiutaTutti}
          </button>
          <button type="button" onClick={apriPreferenze} className={pulsante}>
            {t.consenso.personalizza}
          </button>
        </div>
      </div>
    </div>
  );
}
