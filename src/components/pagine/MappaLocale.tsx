"use client";

import { useState } from "react";
import { CONTATTI } from "@/src/lib/contatti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Mappa incorporata di Google, caricata SOLO dopo un clic esplicito.
//
// Un iframe di Google messo direttamente in pagina contatta Google al
// primo caricamento e può impostare cookie prima che l'utente abbia
// scelto alcunché. Finché non c'è una gestione del consenso, l'unico
// modo per non far partire nulla a sua insaputa è non caricare
// l'iframe finché non lo chiede.
//
// Questo NON sostituisce la CMP: quando arriverà, questo componente
// potrà leggere il consenso già dato e saltare il passaggio manuale.
//
// L'indirizzo arriva dalla fonte unica: scriverlo qui creerebbe un
// secondo posto da aggiornare, che è ciò che il principio NAP vieta.
export function MappaLocale({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const [caricata, setCaricata] = useState(false);

  const query = encodeURIComponent(
    `${CONTATTI.nome}, ${CONTATTI.indirizzo.completo}`,
  );

  // Stessa altezza del segnaposto e della mappa: al clic il contenuto
  // sottostante non si sposta.
  const altezza = "h-64 md:h-80";

  if (caricata) {
    return (
      <div className={`overflow-hidden rounded-[2px] border border-ink/10 ${altezza}`}>
        <iframe
          title={t.paginaContatti.mappaTitolo}
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-[2px] border border-ink/10 bg-ink/[0.04] px-6 py-8 text-center ${altezza}`}
    >
      <SegnaPosto />
      <p className="font-sans text-sm text-ink">
        {CONTATTI.indirizzo.completo}
      </p>
      <button
        type="button"
        onClick={() => setCaricata(true)}
        className="inline-flex min-h-11 items-center rounded-[2px] border border-ink/30 px-5 font-sans text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
      >
        {t.paginaContatti.caricaMappa}
      </button>
      <p className="max-w-sm font-sans text-xs leading-relaxed text-muted">
        {t.paginaContatti.notaMappa}
      </p>
    </div>
  );
}

// Glifo decorativo: l'informazione sta nel testo accanto.
function SegnaPosto() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-7 w-7 text-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"
      />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
