"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { formatDataLeggibile } from "@/src/lib/prenotazioni/disponibilita";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { annullaPrenotazioneToken, type PrenotazioneToken } from "../_actions";

type StatoTerminale = "cancellata" | "completata" | "no-show";

function eTerminale(stato: string): stato is StatoTerminale {
  return stato === "cancellata" || stato === "completata" || stato === "no-show";
}

export function GestisciPrenotazioneClient({
  locale,
  token,
  prenotazione,
}: {
  locale: Locale;
  token: string;
  prenotazione: PrenotazioneToken | null;
}) {
  const t = getDizionario(locale);
  const linkPrenota = localizedPath("/prenota", locale);

  const [stato, setStato] = useState(prenotazione?.stato ?? null);
  const [dialogoAperto, setDialogoAperto] = useState(false);
  const [cancellando, setCancellando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function handleCancella() {
    setCancellando(true);
    setErrore(null);
    try {
      const esito = await annullaPrenotazioneToken(token);
      if (esito.ok) {
        setStato("cancellata");
        setDialogoAperto(false);
      } else {
        setErrore(t.paginaGestisci.erroreCancellazione);
        setDialogoAperto(false);
      }
    } catch {
      setErrore(t.paginaGestisci.erroreCancellazione);
      setDialogoAperto(false);
    } finally {
      setCancellando(false);
    }
  }

  const invitoRiprenota = (
    <div className="mt-8 pt-6 border-t border-ink/10">
      <p className="font-sans text-sm text-ink mb-2">{t.paginaGestisci.riprenotaTesto}</p>
      <Link
        href={linkPrenota}
        className="inline-flex min-h-11 items-center font-sans text-sm text-bordeaux underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux md:min-h-0"
      >
        {t.paginaGestisci.riprenotaLink}
      </Link>
    </div>
  );

  if (!prenotazione || !stato) {
    return (
      <div className="max-w-xl">
        <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
          {t.paginaGestisci.linkNonValidoTitolo}
        </h2>
        <p className="mt-3 font-sans text-base leading-relaxed text-muted">
          {t.paginaGestisci.linkNonValidoTesto}
        </p>
        {invitoRiprenota}
      </div>
    );
  }

  const banner = eTerminale(stato) ? t.paginaGestisci.stati[stato] : null;

  return (
    <div className="max-w-xl">
      {banner && (
        <div className="mb-6 rounded-[2px] border border-ink/15 bg-cream-text/40 px-4 py-3">
          <p className="font-serif text-lg font-medium text-ink">{banner.titolo}</p>
          <p className="mt-1 font-sans text-sm text-muted">{banner.testo}</p>
        </div>
      )}

      <div className="rounded-[2px] border border-ink/15 p-5">
        <dl className="space-y-1">
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoNome}</dt>
            <dd className="font-sans text-sm text-ink">{prenotazione.nome}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoData}</dt>
            <dd className="font-sans text-sm text-ink">
              {formatDataLeggibile(prenotazione.data, locale)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoFascia}</dt>
            <dd className="font-sans text-sm text-ink">{prenotazione.fascia}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="font-sans text-sm text-muted">{t.paginaPrenota.campoCoperti}</dt>
            <dd className="font-sans text-sm text-ink">{prenotazione.coperti}</dd>
          </div>
          {prenotazione.eventoTitolo && (
            <div className="flex justify-between gap-4">
              <dt className="font-sans text-sm text-muted">{t.emailPrenotazione.labelEvento}</dt>
              <dd className="font-sans text-sm text-ink">{prenotazione.eventoTitolo}</dd>
            </div>
          )}
        </dl>

        {prenotazione.note && (
          <p className="mt-4 font-sans text-sm text-ink border-t border-ink/10 pt-3">
            {prenotazione.note}
          </p>
        )}

        {prenotazione.risposteExtra.length > 0 && (
          <div className="mt-4 border-t border-ink/10 pt-3">
            <p className="font-sans text-[10px] uppercase tracking-widest text-muted mb-1">
              {t.paginaGestisci.labelAltreInformazioni}
            </p>
            {prenotazione.risposteExtra.map((r, i) => (
              <p key={i} className="font-sans text-sm text-ink">
                {r.etichetta}: {r.valore}
              </p>
            ))}
          </div>
        )}
      </div>

      {stato === "confermata" && (
        <div className="mt-6">
          <Dialog open={dialogoAperto} onOpenChange={setDialogoAperto}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-[2px] border border-bordeaux px-6 font-sans text-sm font-medium tracking-wide text-bordeaux transition-colors hover:bg-bordeaux/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
              >
                {t.paginaGestisci.cancellaBottone}
              </button>
            </DialogTrigger>
            <DialogContent closeLabel={t.paginaGestisci.chiudiDialogo} className="p-5 md:p-6">
              <DialogHeader className="pr-12 md:pr-10">
                <DialogTitle>{t.paginaGestisci.cancellaConfermaTitolo}</DialogTitle>
                <DialogDescription>{t.paginaGestisci.cancellaConfermaTesto}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-5">
                <button
                  type="button"
                  onClick={() => setDialogoAperto(false)}
                  disabled={cancellando}
                  className="inline-flex min-h-11 items-center justify-center rounded-[2px] px-6 font-sans text-sm text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux disabled:opacity-50"
                >
                  {t.paginaGestisci.cancellaAnnullaBottone}
                </button>
                <Button type="button" variant="primary" onClick={handleCancella} disabled={cancellando}>
                  {cancellando ? t.paginaGestisci.cancellandoInCorso : t.paginaGestisci.cancellaConfermaBottone}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {errore && <p className="mt-3 font-sans text-sm text-bordeaux">{errore}</p>}
        </div>
      )}

      {invitoRiprenota}
    </div>
  );
}
