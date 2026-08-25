"use client";

import { useEffect, useState } from "react";
import { GestisciCookie } from "@/src/components/consenso/GestisciCookie";
import { useConsensoOpzionale } from "@/src/components/consenso/ConsensoContext";
import { CONTATTI } from "@/src/lib/contatti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Mappa incorporata di Google. Si carica da sola se i cookie
// funzionali sono già stati accettati; altrimenti resta un segnaposto
// finché non è l'utente a chiederlo.
//
// Perché il caricamento manuale NON viene salvato come consenso alla
// categoria: il pulsante dice "carica la mappa", non "attivo i cookie
// funzionali". Trasformare quel clic nel consenso a un'intera
// categoria sarebbe più ampio di quanto l'utente ha chiesto — e i
// cookie funzionali coprono anche cose diverse dalla mappa. Chi vuole
// che si carichi sempre ha, nel segnaposto, il collegamento al
// pannello delle preferenze.
//
// Finché il consenso non è stato LETTO dal browser il segnaposto
// resta: il server non sa cosa ci sia in localStorage, e caricare
// l'iframe prima di saperlo significherebbe contattare Google senza
// permesso proprio nel caso in cui il permesso non c'è.
//
// L'indirizzo arriva dalla fonte unica: scriverlo qui creerebbe un
// secondo posto da aggiornare, che è ciò che il principio NAP vieta.
export function MappaLocale({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const consenso = useConsensoOpzionale();

  // Vero solo dopo la lettura dello storage, e solo se la categoria
  // funzionale è attiva.
  const consentito = consenso?.letto === true && consenso.scelte.functional;

  const [caricataAMano, setCaricataAMano] = useState(false);

  // Se il consenso funzionale viene revocato mentre la pagina è
  // aperta, la mappa deve sparire anche se era stata caricata a mano:
  // una revoca che non ha effetto immediato non è una revoca.
  useEffect(() => {
    if (consenso?.letto && !consenso.scelte.functional) setCaricataAMano(false);
  }, [consenso?.letto, consenso?.scelte.functional]);

  const query = encodeURIComponent(
    `${CONTATTI.nome}, ${CONTATTI.indirizzo.completo}`,
  );

  // Stessa altezza nei due stati: passando dall'uno all'altro il
  // contenuto sotto non si sposta.
  const altezza = "h-64 md:h-80";

  if (consentito || caricataAMano) {
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
      className={`flex flex-col items-center justify-center gap-3 rounded-[2px] border border-ink/10 bg-ink/[0.04] px-6 py-8 text-center ${altezza}`}
    >
      <SegnaPosto />
      <p className="font-sans text-sm text-ink">{CONTATTI.indirizzo.completo}</p>
      <button
        type="button"
        onClick={() => setCaricataAMano(true)}
        className="inline-flex min-h-11 items-center rounded-[2px] border border-ink/30 px-5 font-sans text-sm font-medium text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
      >
        {t.paginaContatti.caricaMappa}
      </button>
      <p className="max-w-sm font-sans text-xs leading-relaxed text-muted">
        {t.paginaContatti.notaMappa}
      </p>
      {/* Solo se il pannello del consenso è disponibile: senza
          provider, GestisciCookie non renderizza nulla e la riga
          resterebbe una frase senza seguito. */}
      {consenso && (
        <p className="max-w-sm font-sans text-xs leading-relaxed text-muted">
          {t.paginaContatti.mappaSempre}{" "}
          <GestisciCookie locale={locale} tono="chiaro" />
        </p>
      )}
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
