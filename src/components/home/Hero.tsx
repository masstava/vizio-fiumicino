import { Button } from "@/src/components/ui/Button";
import { FlameMark } from "@/src/components/ui/FlameMark";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { RECENSIONI } from "@/src/lib/contatti";

// Video reale del locale, ospitato su Supabase Storage (bucket
// pubblico "sito-media", non è un piatto quindi non passa dalla
// tabella piatti/foto_url). Mostrato solo da md in su: su mobile,
// dove la banda 4G è il vincolo, resta solo l'ImagePlaceholder così
// non si scarica il video.
const HERO_VIDEO_URL =
  "https://efqytltwyruxmszxilca.supabase.co/storage/v1/object/public/sito-media/video-home.mp4";

// Tema scuro, come da wireframe. L'ImagePlaceholder resta sempre come
// livello di base (mobile e fallback finché il video non è pronto);
// il video si sovrappone solo da md in su, stessa struttura (overlay
// + contenuto sovrapposto).
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
      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/10" />

      <div className="relative z-10 max-w-3xl px-6 pb-16 pt-32 md:px-12 md:pb-24 lg:px-16">
        <p className="mb-4 flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-muted-dark">
          <FlameMark className="h-4 w-4 text-gold/80" />
          Fiumicino
        </p>
        <h1 className="mb-8 font-serif text-4xl font-medium leading-[1.1] md:text-6xl">
          Carne alla brace, cocktail d&apos;autore, aperitivo fino a notte
          fonda.
        </h1>
        <Button type="button" variant="primary">
          Prenota un tavolo
        </Button>

        {/* Valori statici letti dalla fonte unica: diventeranno un
            fetch reale quando arriverà l'integrazione con l'API
            Google (step dedicato successivo). Volutamente discreto:
            non deve competere con la CTA sopra. Contrasto: text-gold
            su bg-dark ≈ 8.7:1, text-muted-dark su bg-dark ≈ 12.2:1. */}
        <p className="mt-4 font-sans text-xs text-muted-dark">
          {RECENSIONI.rating}
          <span className="text-gold" aria-hidden="true">★</span>
          {" · "}
          {RECENSIONI.totale} recensioni Google
        </p>
      </div>
    </section>
  );
}
