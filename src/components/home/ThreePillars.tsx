import { Section } from "@/src/components/ui/Section";
import type { ContenutiMap } from "@/src/lib/contenuti";

// Tema chiaro. Contrasto: text-ink su bg-cream ≈ 15.6:1, text-muted
// su bg-cream ≈ 5.8:1 — entrambi oltre la soglia 4.5:1.
//
// Titoli e testi sono editabili dalla dashboard; i valori di ricaduta
// (usati se un campo è vuoto) stanno in src/lib/contenuti.ts, non
// qui, così esiste un solo posto da guardare.
export function ThreePillars({ testi }: { testi: ContenutiMap }) {
  const PILLARS = [1, 2, 3].map((n) => ({
    title: testi[`pilastro${n}.titolo`],
    description: testi[`pilastro${n}.testo`],
  }));

  return (
    <Section tone="light">
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        Cosa trovi da Vizio
      </p>
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {PILLARS.map((pillar) => (
          <div key={pillar.title}>
            <h3 className="mb-2 font-serif text-2xl font-medium text-ink">
              {pillar.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-muted">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
