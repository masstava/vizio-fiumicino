"use client";

import { usePathname } from "next/navigation";
import { useOverlayAttivo } from "@/src/components/overlay/OverlayContext";
import { stripLocale } from "@/src/lib/i18n/config";
import { CONTATTI } from "@/src/lib/contatti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { tracciaEvento } from "@/src/lib/analytics";

// Contatto rapido per domande su menu e allergeni.
//
// NON è un'alternativa a "Prenota": quella resta nell'header e porta
// al sistema di prenotazione nativo (/prenota, §21 passo 6/6). Qui si
// risponde a chi ha una domanda prima di decidere, non a chi ha già
// deciso.
export function WhatsAppFab({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const overlayAttivo = useOverlayAttivo();

  // Sulla vista al tavolo il bottone non compare. È la stessa ragione
  // per cui lì non ci sono header e footer: chi legge il menu ha il
  // personale di sala a due passi, e un bollo verde fisso sopra i
  // piatti è l'opposto dell'esperienza immersiva richiesta.
  const percorso = stripLocale(usePathname() || "/");
  const vistaAlTavolo = percorso === "/menu-online";

  // Nascosto quando un overlay occupa lo schermo: popup newsletter e
  // banner cookie non esistono ancora, ma quando arriveranno basterà
  // che si registrino nel contesto (vedi OverlayContext) perché questo
  // bottone si tolga di mezzo da solo.
  if (overlayAttivo || vistaAlTavolo) return null;

  const href = `${CONTATTI.whatsapp.href}?text=${encodeURIComponent(t.whatsapp.messaggio)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => tracciaEvento("click_whatsapp", { lingua: locale })}
      aria-label={t.whatsapp.etichettaAccessibile}
      className={[
        // bottom-right, sopra il contenuto ma sotto header e dialoghi
        // (header z-50, overlay dei dialoghi z-50): z-40 evita che
        // resti appeso sopra un dialogo aperto.
        "fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6",
        "inline-flex items-center gap-2 rounded-full",
        "bg-[#25D366] py-3 pl-3 pr-4 shadow-lg",
        // Testo scuro sul verde WhatsApp: su quel verde il bianco dà
        // circa 2,1:1, il nero circa 10:1. Il colore è del marchio
        // WhatsApp e non si tocca, quindi si adegua il testo.
        "font-sans text-sm font-medium text-[#0a0705]",
        "transition-transform duration-200 hover:scale-[1.03]",
        "motion-reduce:transition-none motion-reduce:hover:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.29-.76.95-.94 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.29-.02-.45.13-.6.13-.13.3-.35.44-.52.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.29-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2.5c-5.24 0-9.5 4.26-9.5 9.5 0 1.68.44 3.32 1.28 4.77L2.5 21.5l4.86-1.27a9.46 9.46 0 004.68 1.22h.01c5.23 0 9.49-4.26 9.5-9.5 0-2.54-.99-4.92-2.78-6.71a9.42 9.42 0 00-6.73-2.74zm0 17.4h-.01a7.9 7.9 0 01-4.02-1.1l-.29-.17-2.98.78.79-2.9-.19-.3a7.86 7.86 0 01-1.21-4.21c0-4.35 3.55-7.9 7.91-7.9 2.11 0 4.09.83 5.58 2.32a7.84 7.84 0 012.31 5.59c0 4.36-3.54 7.9-7.89 7.9z" />
      </svg>
      {/* L'etichetta accompagna l'icona invece di lasciarla sola: da
          sola non direbbe di cosa si può chiedere. */}
      <span>{t.whatsapp.etichetta}</span>
    </a>
  );
}
