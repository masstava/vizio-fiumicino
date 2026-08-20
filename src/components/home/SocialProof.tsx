import { Section } from "@/src/components/ui/Section";
import { CONTATTI, RECENSIONI } from "@/src/lib/contatti";

// Il rating è un dato reale (Google), le stelle lo rappresentano
// visivamente: la quinta è parziale, riempita in proporzione al voto.
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        // Quota di questa stella coperta dal voto (0 → vuota, 1 → piena)
        const fill = Math.max(0, Math.min(1, rating - i));
        const id = `star-fill-${i}`;
        return (
          <svg key={i} viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
            <defs>
              <linearGradient id={id}>
                <stop offset={`${fill * 100}%`} stopColor="var(--color-gold)" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z"
              fill={`url(#${id})`}
              stroke="var(--color-gold)"
              strokeWidth="0.75"
            />
          </svg>
        );
      })}
    </div>
  );
}

// Tema chiaro. Contrasto: text-ink su bg-cream ≈ 15.6:1, text-muted
// su bg-cream ≈ 5.8:1 — entrambi oltre la soglia 4.5:1.
//
// Nessun testo di recensione mostrato: finché non c'è una citazione
// reale (editabile o importata da Google) è meglio mostrare solo i
// numeri veri che un segnaposto scambiabile per contenuto autentico.
export function SocialProof({
  citazione,
  autore,
}: {
  /** Frase da una recensione reale, inserita in dashboard. Vuota → non si mostra nulla. */
  citazione?: string;
  autore?: string;
}) {
  const ratingNumerico = Number(RECENSIONI.rating.replace(",", "."));
  const testoCitazione = citazione?.trim();

  return (
    <Section tone="light">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        Cosa dicono di noi
      </p>
      <div className="max-w-2xl">
        <Stars rating={ratingNumerico} />

        {testoCitazione ? (
          <blockquote className="mt-4">
            <p className="font-serif text-2xl leading-snug text-ink md:text-3xl">
              «{testoCitazione}»
            </p>
            <footer className="mt-3 font-sans text-sm text-muted">
              {autore?.trim() && <span>{autore.trim()} · </span>}
              {RECENSIONI.rating} su 5, media di {RECENSIONI.totale} recensioni
              su Google
            </footer>
          </blockquote>
        ) : (
          <>
            <p className="mt-4 font-serif text-3xl leading-snug text-ink md:text-4xl">
              {RECENSIONI.rating} su 5
            </p>
            <p className="mt-2 font-sans text-sm text-muted">
              Media di {RECENSIONI.totale} recensioni su Google
            </p>
          </>
        )}
        <a
          href={CONTATTI.google.recensione}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-[2px] bg-bordeaux px-6 py-2.5 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
        >
          Lascia una recensione
        </a>
      </div>
    </Section>
  );
}
