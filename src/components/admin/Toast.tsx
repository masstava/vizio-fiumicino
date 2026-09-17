"use client";

// Notifica discreta a comparsa, in basso a destra — per ora usata solo
// dalla dashboard Prenotazioni (nuova prenotazione via Realtime), ma
// generica di proposito: nessun riferimento a prenotazioni qui dentro.
//
// Componente puramente controllato: non gestisce da solo un timer di
// auto-chiusura né una coda di più notifiche — chi lo usa possiede lo
// stato (un singolo toast alla volta basta al volume di eventi di
// questa dashboard) e decide quando richiamare onClose. Stesso
// principio dei pannelli di dettaglio già in uso: leggero, controllato
// dal chiamante, niente stato nascosto da sincronizzare.
export function Toast({
  titolo,
  descrizione,
  onClose,
}: {
  titolo: string;
  descrizione: string;
  onClose: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 left-4 z-50 ml-auto flex w-[calc(100%-2rem)] max-w-sm items-start gap-2 rounded-[2px] border border-admin-line border-l-[3px] border-l-admin-brick bg-admin-surface px-4 py-3 shadow-lg"
    >
      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm font-medium text-admin-text">{titolo}</p>
        <p className="mt-0.5 font-sans text-xs text-admin-text-2">{descrizione}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi notifica"
        className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[2px] text-admin-text-2 hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
