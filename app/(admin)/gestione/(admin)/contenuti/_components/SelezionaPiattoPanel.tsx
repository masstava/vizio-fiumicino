"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import type { PiattoCatalogo } from "./types";

// Pannello di ricerca/selezione per riempire uno slot piatto — stessa
// divulgazione non-modale già usata per il dettaglio prenotazione
// (passaggio 4/6): overlay che chiude al tocco, Esc che chiude e
// restituisce il focus al pulsante "+" che l'ha aperto, focus che
// entra nel pannello all'apertura, nessun focus trap.
export function SelezionaPiattoPanel({
  aperto,
  candidati,
  onSeleziona,
  onClose,
}: {
  aperto: boolean;
  candidati: PiattoCatalogo[];
  onSeleziona: (piatto: PiattoCatalogo) => void;
  onClose: () => void;
}) {
  const pannelloRef = useRef<HTMLDivElement>(null);
  const [ricerca, setRicerca] = useState("");

  useEffect(() => {
    if (aperto) setRicerca("");
  }, [aperto]);

  useEffect(() => {
    if (!aperto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aperto, onClose]);

  useEffect(() => {
    if (aperto) pannelloRef.current?.querySelector("input")?.focus();
  }, [aperto]);

  const filtrati = useMemo(() => {
    const q = ricerca.trim().toLowerCase();
    if (!q) return candidati;
    return candidati.filter((c) => c.nome.toLowerCase().includes(q));
  }, [candidati, ricerca]);

  return (
    <>
      {aperto && (
        <div aria-hidden="true" onClick={onClose} className="fixed inset-0 z-30 bg-admin-ink/40" />
      )}
      <div
        ref={pannelloRef}
        role="dialog"
        aria-modal="false"
        aria-label="Scegli un piatto"
        className={[
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col bg-admin-surface",
          "border-l border-admin-line transition-transform duration-200 motion-reduce:transition-none",
          aperto ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {aperto && (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-admin-line px-6 py-5">
              <h2 className="font-serif text-lg font-medium text-admin-text">
                Scegli un piatto
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi selezione piatto"
                className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[2px] text-admin-text-2 hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4 border-b border-admin-line">
              <label htmlFor="cerca-piatto-slot" className="sr-only">
                Cerca piatto
              </label>
              <input
                id="cerca-piatto-slot"
                type="search"
                value={ricerca}
                onChange={(e) => setRicerca(e.target.value)}
                placeholder="Cerca per nome…"
                className="min-h-11 w-full bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtrati.length === 0 ? (
                <p className="px-6 py-4 font-sans text-sm text-admin-text-2">
                  Nessun piatto trovato.
                </p>
              ) : (
                <div className="divide-y divide-admin-line">
                  {filtrati.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSeleziona(p)}
                      className="flex w-full items-center gap-3 px-6 py-3 text-left hover:bg-admin-canvas transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-brick/60"
                    >
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-[2px]">
                        {p.fotoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.fotoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <ImagePlaceholder seed={p.id} className="h-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-admin-text truncate">
                          {p.nome}
                        </p>
                        <p className="font-sans text-xs text-admin-text-2">{p.categoria}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
