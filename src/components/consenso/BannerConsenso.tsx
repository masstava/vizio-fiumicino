"use client";

import Link from "next/link";
import { useRegistraOverlay } from "@/src/components/overlay/OverlayContext";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
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
//
// Scuro su chiaro: fondo crema PIENO (non semitrasparente: il
// contrasto non deve dipendere da cosa c'è sotto), testo inchiostro.
// Contrasti misurati sul crema (#f7f2e9):
//   titolo ink 15,6:1 · testo muted 5,8:1 · bordo pulsanti ink/60
//   4,4:1 · anello di focus bordeaux 8,3:1.
// Stacco dalla pagina: bordo superiore ink/50 (3,3:1 su una sezione
// crema) e ombra verso l'alto dal token dark; sopra le sezioni scure
// lo stacco è il fondo stesso (crema su dark 18:1).
export function BannerConsenso({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const { bannerVisibile, accettaTutti, rifiutaTutti, apriPreferenze } =
    useConsenso();

  useRegistraOverlay(bannerVisibile);

  if (!bannerVisibile) return null;

  // Identica per tutti e tre: è la garanzia di parità visiva.
  const pulsante =
    "inline-flex min-h-11 flex-1 items-center justify-center rounded-[2px] border border-ink/60 px-4 font-sans text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:flex-none sm:px-5";

  return (
    <div
      role="region"
      aria-label={t.consenso.etichettaBanner}
      className="fixed inset-x-0 bottom-0 z-[45] border-t border-ink/50 bg-cream shadow-[0_-8px_24px_-8px_color-mix(in_srgb,var(--color-dark)_35%,transparent)]"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:gap-8 md:px-8">
        <div className="md:flex-1">
          <p className="font-sans text-sm font-medium text-ink">
            {t.consenso.titolo}
          </p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
            {t.consenso.testo}
          </p>
          {/* L'informativa completa a un clic dal banner (Linee guida
              del Garante 10/06/2021). Stesso stile dei link su fondo
              chiaro del sito: bordeaux sottolineato, 8,3:1 sul crema.
              Area di tocco 44px, ridotta solo con mouse/trackpad. */}
          <Link
            href={localizedPath("/cookie-policy", locale)}
            className="mt-1 inline-flex min-h-11 items-center rounded-[2px] font-sans text-xs text-bordeaux underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream md:pointer-fine:min-h-0"
          >
            {t.consenso.linkCookiePolicy}
          </Link>
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
