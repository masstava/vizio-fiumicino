"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRegistraOverlay } from "@/src/components/overlay/OverlayContext";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { cn } from "@/src/lib/utils";
import { useConsenso } from "./ConsensoContext";
import { focusSulContenuto, ID_PERSONALIZZA } from "./focus";

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
// Tastiera (WCAG 2.4.11): il banner è montato PRIMA del contenuto
// nel layout, quindi è il primo stop del Tab e si può chiudere
// subito; finché è aperto scrive la propria altezza in
// --altezza-banner-consenso, che app/globals.css usa per lasciare
// spazio in fondo alla pagina e per non far finire sotto il banner
// l'elemento che riceve il focus. Dopo Accetta/Rifiuta il focus va
// su <main> invece di ricadere su <body>.
//
// Scuro su chiaro: fondo crema PIENO (non semitrasparente: il
// contrasto non deve dipendere da cosa c'è sotto), testo inchiostro.
// Contrasti misurati sul crema (#f7f2e9):
//   titolo ink 15,6:1 · testo muted 5,8:1 · bordo pulsanti ink/60
//   4,4:1 · anello di focus bordeaux 8,3:1.
// Stacco dalla pagina: bordo superiore ink/50 (3,3:1 su una sezione
// crema) e ombra verso l'alto dal token dark; sopra le sezioni scure
// lo stacco è il fondo stesso (crema su dark 18:1).
/** Durata dell'uscita del banner, uguale alla transizione in app/globals.css. */
const DURATA_USCITA = 200;

export function BannerConsenso({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const { bannerVisibile, preferenzeAperte, accettaTutti, rifiutaTutti, apriPreferenze } =
    useConsenso();
  const [nodo, setNodo] = useState<HTMLDivElement | null>(null);

  // Uscita dopo una scelta (Accetta, Rifiuta, Salva): il banner resta
  // montato DURATA_USCITA ms mentre scivola giù, nello stesso tempo e
  // con la stessa curva con cui si richiude lo spazio in fondo alla
  // pagina (app/globals.css). Così chi è in fondo vede il footer
  // scendere attaccato al banner che esce, senza la striscia vuota
  // che si vedrebbe smontandolo di colpo. Aprendo il modale invece
  // il banner sparisce subito: lì lo spazio resta.
  const [eraVisibile, setEraVisibile] = useState(bannerVisibile);
  const [inUscita, setInUscita] = useState(false);
  if (bannerVisibile !== eraVisibile) {
    setEraVisibile(bannerVisibile);
    setInUscita(!bannerVisibile && !preferenzeAperte);
  }
  useEffect(() => {
    if (!inUscita) return;
    const timer = window.setTimeout(() => setInUscita(false), DURATA_USCITA);
    return () => window.clearTimeout(timer);
  }, [inUscita]);

  useRegistraOverlay(bannerVisibile);

  // Layout effect: variabile scritta e tolta prima del paint, nessun
  // frame con il banner sopra un footer senza spazio. Mentre il
  // modale delle preferenze è aperto il banner è smontato ma la scelta
  // non è ancora fatta: lo spazio resta, così chiudendo il modale
  // senza salvare la pagina non si allunga e accorcia di nuovo.
  useLayoutEffect(() => {
    const radice = document.documentElement;
    if (!nodo || inUscita) {
      if (!preferenzeAperte) radice.style.removeProperty("--altezza-banner-consenso");
      return;
    }
    const aggiorna = () => {
      // Quando il banner viene smontato l'osservatore fa in tempo a
      // segnalare altezza 0: ignorarla, o lo spazio sparirebbe mentre
      // il modale è aperto.
      if (!nodo.isConnected) return;
      radice.style.setProperty(
        "--altezza-banner-consenso",
        `${Math.ceil(nodo.getBoundingClientRect().height)}px`,
      );
    };
    aggiorna();
    const osservatore = new ResizeObserver(aggiorna);
    osservatore.observe(nodo);
    return () => osservatore.disconnect();
  }, [nodo, preferenzeAperte, inUscita]);

  if (!bannerVisibile && !inUscita) return null;

  // Identica per tutti e tre: è la garanzia di parità visiva.
  const pulsante =
    "inline-flex min-h-11 flex-1 items-center justify-center rounded-[2px] border border-ink/60 px-4 font-sans text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:flex-none sm:px-5";

  return (
    <div
      ref={setNodo}
      role="region"
      aria-label={t.consenso.etichettaBanner}
      // In uscita è solo un'immagine che scivola via: fuori dal Tab e
      // dai lettori di schermo (il focus è già su <main>).
      inert={inUscita}
      className={cn(
        "fixed inset-x-0 bottom-0 z-[45] border-t border-ink/50 bg-cream shadow-[0_-8px_24px_-8px_color-mix(in_srgb,var(--color-dark)_35%,transparent)]",
        // Stessa durata e curva della transizione di padding-bottom
        // del body in app/globals.css: vanno cambiate insieme.
        "transition-transform duration-200 ease-out motion-reduce:transition-none",
        inUscita && "translate-y-full",
      )}
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
          <button
            type="button"
            onClick={() => {
              accettaTutti();
              focusSulContenuto();
            }}
            className={pulsante}
          >
            {t.consenso.accettaTutti}
          </button>
          <button
            type="button"
            onClick={() => {
              rifiutaTutti();
              focusSulContenuto();
            }}
            className={pulsante}
          >
            {t.consenso.rifiutaTutti}
          </button>
          <button
            id={ID_PERSONALIZZA}
            type="button"
            onClick={apriPreferenze}
            className={pulsante}
          >
            {t.consenso.personalizza}
          </button>
        </div>
      </div>
    </div>
  );
}
