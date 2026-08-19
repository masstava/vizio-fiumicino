import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";

// PLACEHOLDER in attesa dell'integrazione Google Places (step
// dedicato successivo): stelle, citazione e nome cliente sono
// volutamente segnati come contenuto non reale — non vanno mai
// scambiati per una recensione vera. Quando arriva l'integrazione,
// questi tre valori diventeranno un fetch reale; la struttura visiva
// (stelle + citazione + CTA) resta la stessa.
const PLACEHOLDER_QUOTE =
  "«Qui comparirà una recensione reale, importata da Google.»";
const PLACEHOLDER_AUTHOR = "— recensione in arrivo, non ancora collegata";

function PlaceholderStars() {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-5 w-5 fill-muted/40">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

// Tema chiaro. Contrasto: text-ink su bg-cream ≈ 15.6:1, text-muted
// su bg-cream ≈ 5.8:1 — entrambi oltre la soglia 4.5:1. Le stelle
// sono decorative (aria-hidden), nessun valore reale da comunicare.
export function SocialProof() {
  return (
    <Section tone="light">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        Cosa dicono di noi
      </p>
      <div className="max-w-2xl">
        <PlaceholderStars />
        <p className="mt-4 font-serif text-2xl leading-snug text-ink md:text-3xl">
          {PLACEHOLDER_QUOTE}
        </p>
        <p className="mt-3 font-sans text-sm text-muted">{PLACEHOLDER_AUTHOR}</p>
        <Button type="button" variant="primary" className="mt-8">
          Lascia una recensione
        </Button>
      </div>
    </Section>
  );
}
