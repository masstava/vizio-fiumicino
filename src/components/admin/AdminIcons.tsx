// Icone della sidebar di gestione — 20x20, tratto (stroke), non
// riempimento: nessuna libreria di icone è tra le dipendenze del
// progetto, e aggiungerne una per sei simboli sarebbe sproporzionato.
// Disegnate a mano nello stesso stile (stroke-width 1.5, currentColor
// così ereditano il colore del testo del link che le contiene).
//
// Non decorative: ogni icona accompagna sempre un'etichetta di testo
// nel link che la usa (mai icona da sola), quindi restano aria-hidden
// — il testo del link è già il nome accessibile.

type IconProps = { className?: string };

const BASE = "h-5 w-5 flex-shrink-0";

export function IconDashboard({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <rect x="2.75" y="2.75" width="6.5" height="6.5" rx="1" />
      <rect x="10.75" y="2.75" width="6.5" height="9.5" rx="1" />
      <rect x="2.75" y="11.75" width="6.5" height="5.5" rx="1" />
      <rect x="10.75" y="14.75" width="6.5" height="2.5" rx="1" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <path strokeLinecap="round" d="M4 5.5h12M4 10h12M4 14.5h8" />
    </svg>
  );
}

export function IconTesti({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 3.5l4 4L7 17H3v-4l9.5-9.5z" />
      <path strokeLinecap="round" d="M10.5 5.5l4 4" />
    </svg>
  );
}

export function IconOrari({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <circle cx="10" cy="10" r="7.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 5.75V10l3 2" />
    </svg>
  );
}

export function IconEventi({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <rect x="2.75" y="4" width="14.5" height="13.25" rx="1.25" />
      <path strokeLinecap="round" d="M2.75 8h14.5M6.25 2.25V5M13.75 2.25V5" />
    </svg>
  );
}

export function IconPrenotazioni({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <rect x="3.25" y="3.25" width="13.5" height="13.5" rx="1.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 10.25l2 2 4.5-4.5" />
    </svg>
  );
}

export function IconCoupon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className ?? BASE} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.75 8.25a1.5 1.5 0 0 0 0 3.5v2a1 1 0 0 0 1 1h12.5a1 1 0 0 0 1-1v-2a1.5 1.5 0 0 1 0-3.5v-2a1 1 0 0 0-1-1H3.75a1 1 0 0 0-1 1v2z" />
      <path strokeLinecap="round" d="M8 5.25v9.5" strokeDasharray="1.6 1.6" />
    </svg>
  );
}
