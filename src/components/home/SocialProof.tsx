import { Section } from "@/src/components/ui/Section";
import { CONTATTI, RECENSIONI } from "@/src/lib/contatti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

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
// Senza una citazione reale (inserita in dashboard) si mostrano solo
// i numeri: un segnaposto scambiabile per contenuto autentico sarebbe
// peggio del silenzio.
export function SocialProof({
  citazione,
  autore,
  locale,
}: {
  /** Frase da una recensione reale, inserita in dashboard. Vuota → non si mostra nulla. */
  citazione?: string;
  autore?: string;
  locale: Locale;
}) {
  const t = getDizionario(locale);
  const ratingNumerico = Number(RECENSIONI.rating.replace(",", "."));
  const testoCitazione = citazione?.trim();

  return (
    <Section tone="light">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        {t.sezioni.cosaDicono}
      </p>
      <div className="max-w-2xl">
        <Stars rating={ratingNumerico} />

        {testoCitazione ? (
          <blockquote className="mt-4">
            {/* Corsivo sulla sola citazione, non sull'attribuzione:
                distingue a colpo d'occhio le parole di chi ha scritto
                la recensione dai dati che ci mettiamo noi. Fraunces
                carica un corsivo vero (vedi src/lib/fonts.ts), quindi
                non è l'obliquo sintetico del browser. */}
            <p className="font-serif text-2xl italic leading-snug text-ink md:text-3xl">
              «{testoCitazione}»
            </p>
            <footer className="mt-3 font-sans text-sm text-muted">
              {autore?.trim() && <span>{autore.trim()} · </span>}
              {t.recensioni.mediaInline(RECENSIONI.rating, RECENSIONI.totale)}
            </footer>
          </blockquote>
        ) : (
          <>
            <p className="mt-4 font-serif text-3xl leading-snug text-ink md:text-4xl">
              {RECENSIONI.rating} {t.recensioni.suCinque}
            </p>
            <p className="mt-2 font-sans text-sm text-muted">
              {t.recensioni.media(RECENSIONI.totale)}
            </p>
          </>
        )}
        <a
          href={CONTATTI.google.recensione}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-[2px] bg-bordeaux px-6 py-2.5 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity duration-150 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
        >
          {t.cta.lasciaRecensione}
        </a>
      </div>
    </Section>
  );
}
