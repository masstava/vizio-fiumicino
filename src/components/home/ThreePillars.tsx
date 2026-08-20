import { FlameAccent } from "@/src/components/ui/FlameAccent";
import { Section } from "@/src/components/ui/Section";
import type { ContenutiMap } from "@/src/lib/contenuti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Tema chiaro. Contrasto: text-ink su bg-cream ≈ 15.6:1, text-muted
// su bg-cream ≈ 5.8:1 — entrambi oltre la soglia 4.5:1.
//
// Titoli e testi sono editabili dalla dashboard; i valori di ricaduta
// (usati se un campo è vuoto) stanno in src/lib/contenuti.ts, non
// qui, così esiste un solo posto da guardare.
export function ThreePillars({
  testi,
  locale,
}: {
  testi: ContenutiMap;
  locale: Locale;
}) {
  const t = getDizionario(locale);
  const PILLARS = [1, 2, 3].map((n) => ({
    title: testi[`pilastro${n}.titolo`],
    description: testi[`pilastro${n}.testo`],
  }));

  return (
    <Section tone="light" className="relative isolate overflow-hidden">
      {/* Richiamo di brand sulle sezioni chiare: qui il logo con
          lettering non è utilizzabile (oro su crema = 1,46:1), quindi
          si usa la sola fiamma in versione scura come filigrana. A
          questa opacità non altera il contrasto del testo sopra. */}
      <FlameAccent
        variante="scura"
        className="pointer-events-none absolute -right-10 -top-8 -z-10 h-64 opacity-[0.05] md:h-80"
      />
      <p className="mb-8 font-sans text-[10px] tracking-widest uppercase text-muted">
        {t.sezioni.cosaTrovi}
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
