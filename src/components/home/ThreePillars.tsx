import { Section } from "@/src/components/ui/Section";

const PILLARS = [
  {
    title: "Carne alla brace",
    description:
      "Tagli selezionati, cotture lente sulla brace, contorni all'altezza. La sostanza al centro del piatto.",
  },
  {
    title: "Cocktail d'autore",
    description:
      "Spritz classici, twist di casa, drink pensati per accompagnare ogni portata — o bastare da soli.",
  },
  {
    title: "Da mezzogiorno a notte",
    description:
      "Aperitivo, cena, dopocena: lo stesso indirizzo cambia ritmo con l'orario, senza mai chiudere il servizio.",
  },
] as const;

// Tema chiaro. Contrasto: text-ink su bg-cream ≈ 15.6:1, text-muted
// su bg-cream ≈ 5.8:1 — entrambi oltre la soglia 4.5:1.
export function ThreePillars() {
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
