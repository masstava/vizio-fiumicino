import { Button } from "@/src/components/ui/Button";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";

// Tema scuro, come da wireframe. Sfondo con ImagePlaceholder finché
// non ci sono foto reali del locale — basta sostituire questo blocco
// con un <Image> quando arriva l'asset, la struttura (overlay +
// contenuto sovrapposto) resta identica.
//
// Contrasto verificato: cream-text (#f5efe4) su bg-dark (#0a0705) ≈
// 17.6:1, muted-dark (#d8c7b0) su bg-dark ≈ 12.2:1 — entrambi ben
// oltre la soglia minima 4.5:1 per testo normale.
export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-dark text-cream-text md:min-h-[92vh]">
      <ImagePlaceholder
        seed="hero-vizio-bistrot"
        aspectRatio="auto"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/10" />

      <div className="relative z-10 max-w-3xl px-6 pb-16 pt-32 md:px-12 md:pb-24 lg:px-16">
        <p className="mb-4 font-sans text-xs tracking-[0.2em] uppercase text-muted-dark">
          Fiumicino
        </p>
        <h1 className="mb-8 font-serif text-4xl font-medium leading-[1.1] md:text-6xl">
          Carne alla brace, cocktail d&apos;autore, aperitivo fino a notte
          fonda.
        </h1>
        <Button type="button" variant="primary">
          Prenota un tavolo
        </Button>
      </div>
    </section>
  );
}
