"use client";

import { useEffect, useRef, useState } from "react";
import { StatusSelect } from "@/src/components/admin/StatusSelect";
import type { StatoPrenotazione } from "../_actions";
import type { PrenotazioneRiga } from "./PrenotazioniListClient";
import { STATI } from "./stati";

// Pannello laterale (slide-over) coi dettagli di una prenotazione —
// § "2) PANNELLO DI DETTAGLIO" dell'istruzione del passaggio 4/6, dal
// prototipo approvato. Stessa filosofia di divulgazione non-modale già
// usata per il pannello di navigazione mobile (AdminShell): Esc chiude
// e restituisce il focus a chi ha aperto il pannello, il focus entra
// nel pannello all'apertura, nessun focus trap di proposito — qui
// l'utente può sempre tornare alla lista sottostante senza essere
// "intrappolato" nel dettaglio.
export function DettaglioPrenotazionePanel({
  riga,
  data,
  onClose,
  onCambiaStato,
  isPending,
}: {
  riga: PrenotazioneRiga | null;
  data: string;
  onClose: () => void;
  onCambiaStato: (id: string, nuovo: StatoPrenotazione) => void;
  isPending: boolean;
}) {
  const pannelloRef = useRef<HTMLDivElement>(null);
  const aperto = riga != null;

  // Il contenuto resta quello dell'ultima riga aperta anche mentre
  // "riga" torna a null: senza, la chiusura smonterebbe il contenuto
  // nello stesso istante in cui parte l'animazione — il pannello
  // scivolerebbe via vuoto invece di mostrare la scheda che si sta
  // chiudendo.
  const [rigaVisualizzata, setRigaVisualizzata] = useState(riga);
  useEffect(() => {
    if (riga) setRigaVisualizzata(riga);
  }, [riga]);

  useEffect(() => {
    if (!aperto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aperto, onClose]);

  // Dipende da rigaVisualizzata, non solo da aperto: sul render in cui
  // "riga" passa da null a un valore, questo effetto e quello sopra
  // (che aggiorna rigaVisualizzata) partono nello stesso commit, ma gli
  // effetti di un commit girano tutti PRIMA che React applichi gli
  // state update programmati al loro interno — qui, quindi, prima che
  // rigaVisualizzata (e il pulsante di chiusura che dipende da essa)
  // esista ancora nel DOM. Con "aperto" da solo come unica dipendenza,
  // il focus veniva cercato un render troppo presto e non trovava
  // nulla da mettere a fuoco. Aggiungendo rigaVisualizzata l'effetto
  // rigira al render successivo, quando il pulsante è già nel DOM.
  useEffect(() => {
    if (aperto && rigaVisualizzata) {
      pannelloRef.current?.querySelector("button")?.focus();
    }
  }, [aperto, rigaVisualizzata]);

  const dataLabel = new Date(`${data}T00:00:00`).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      {aperto && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-admin-ink/40"
        />
      )}
      <div
        ref={pannelloRef}
        role="dialog"
        aria-modal="false"
        aria-label={
          rigaVisualizzata
            ? `Dettaglio prenotazione di ${rigaVisualizzata.nome}`
            : "Dettaglio prenotazione"
        }
        className={[
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col bg-admin-surface shadow-none",
          "border-l border-admin-line transition-transform duration-200 motion-reduce:transition-none",
          aperto ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {rigaVisualizzata && (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-admin-line px-6 py-5">
              <div className="min-w-0">
                <p className="font-sans text-[10px] tracking-widest uppercase text-admin-text-3 mb-1">
                  {dataLabel} · {rigaVisualizzata.fascia}
                </p>
                <h2 className="font-serif text-xl font-medium text-admin-text truncate">
                  {rigaVisualizzata.nome}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi dettaglio prenotazione"
                className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[2px] text-admin-text-2 hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-admin-text-3 mb-1.5">
                  Stato
                </p>
                <StatusSelect
                  value={rigaVisualizzata.stato}
                  options={STATI}
                  onChange={(nuovo) => onCambiaStato(rigaVisualizzata.id, nuovo)}
                  disabled={isPending}
                  ariaLabel={`Stato prenotazione di ${rigaVisualizzata.nome}`}
                />
              </div>

              <dl className="space-y-4">
                <Campo etichetta="Telefono" valore={rigaVisualizzata.telefono} />
                <Campo etichetta="Coperti" valore={String(rigaVisualizzata.coperti)} />
                {rigaVisualizzata.note && <Campo etichetta="Note" valore={rigaVisualizzata.note} />}
                {rigaVisualizzata.risposteExtra.map((r, i) => (
                  <Campo key={i} etichetta={r.etichetta} valore={r.valore} />
                ))}
              </dl>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Campo({ etichetta, valore }: { etichetta: string; valore: string }) {
  return (
    <div>
      <dt className="font-sans text-[10px] tracking-widest uppercase text-admin-text-3 mb-0.5">
        {etichetta}
      </dt>
      <dd className="font-sans text-sm text-admin-text">{valore}</dd>
    </div>
  );
}
