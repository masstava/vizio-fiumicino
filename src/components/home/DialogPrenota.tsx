"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { CONTATTI } from "@/src/lib/contatti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// =============================================================
// TEMPORANEO — DA RIMUOVERE CON §21
// =============================================================
// Tappabuchi per il pulsante "Prenota" finché non esiste il sistema
// di prenotazione nativo. Il pulsante era già in pagina ovunque e non
// faceva nulla: un pulsante primario che non risponde è peggio di un
// pulsante assente, perché chi lo preme pensa di aver sbagliato.
//
// Invece di nasconderlo si dice la verità e si offre ciò che
// funziona già oggi: telefono e WhatsApp.
//
// QUANDO ARRIVA IL SISTEMA NATIVO, per rimuoverlo:
//   1. cancellare questo file;
//   2. in SiteHeader.tsx togliere <DialogPrenota> attorno al Button;
//   3. in dizionari.ts togliere la voce "prenotaPlaceholder" (IT ed EN).
// Non c'è altro: nessun altro file lo importa.
//
// I recapiti NON sono scritti qui: arrivano da src/lib/contatti.ts,
// come ovunque nel progetto.
// =============================================================
export function DialogPrenota({
  locale,
  children,
}: {
  locale: Locale;
  /** Il pulsante che apre il dialogo: passa invariato, stile compreso. */
  children: React.ReactNode;
}) {
  const t = getDizionario(locale);

  const azione =
    "inline-flex min-h-11 w-full items-center justify-center rounded-[2px] px-6 font-sans text-sm font-medium tracking-wide transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:w-auto";

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        closeLabel={t.prenotaPlaceholder.chiudi}
        className="p-5 md:p-6"
      >
        <DialogHeader className="pr-12 md:pr-10">
          <DialogTitle>{t.prenotaPlaceholder.titolo}</DialogTitle>
          <DialogDescription>{t.prenotaPlaceholder.testo}</DialogDescription>
        </DialogHeader>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={CONTATTI.telefono.href}
            className={`${azione} bg-bordeaux text-cream-text focus-visible:ring-bordeaux`}
          >
            {CONTATTI.telefono.display}
          </a>
          <a
            href={CONTATTI.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${azione} border border-ink/30 text-ink hover:bg-ink/5 focus-visible:ring-bordeaux`}
          >
            {t.cta.scriviciWhatsapp}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
