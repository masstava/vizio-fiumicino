import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { FlameAccent } from "@/src/components/ui/FlameAccent";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { RECENSIONI } from "@/src/lib/contatti";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import type { MediaPagina } from "@/src/lib/media-pagine";

// Video reale del locale, ospitato su Supabase Storage (bucket
// pubblico "sito-media", non è un piatto quindi non passa dalla
// tabella piatti/foto_url). Valore di riserva: usato quando
// /gestione/contenuti non ha (ancora) impostato un video per
// pagina="home" — vedi la prop "video" sotto.
//
// Mostrato su TUTTE le dimensioni, mobile compreso: inizialmente era
// limitato al desktop per non far scaricare un file pesante su 4G, ma
// il file è stato compresso a sufficienza e su mobile restava un
// gradiente segnaposto al posto del locale vero — che è il contenuto
// che più conta nel primo schermo.
//
// preload="metadata" scarica solo l'intestazione del file, non il
// video intero: la riproduzione parte quando il browser decide, senza
// contendere banda al primo contenuto utile.
//
// Costruito da NEXT_PUBLIC_SUPABASE_URL invece che scritto per
// intero: un URL letterale con il project ref dentro (Audit tecnico
// #2, punto 2) si sarebbe rotto in silenzio a un cambio di progetto
// Supabase, mentre il resto del sito — che legge quella variabile —
// avrebbe continuato a funzionare.
const HERO_VIDEO_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/sito-media/video-home.mp4`;

// Tema scuro, come da wireframe. L'ImagePlaceholder resta come livello
// di base sotto al video: copre l'attesa prima che il primo fotogramma
// sia pronto, e resta visibile se il video non parte (dati risparmiati,
// rete assente, formato non supportato). Senza, ci sarebbe un rettangolo
// nero.
//
// Contrasto verificato: cream-text (#f5efe4) su bg-dark (#0a0705) ≈
// 17.6:1, muted-dark (#d8c7b0) su bg-dark ≈ 12.2:1 — entrambi ben
// oltre la soglia minima 4.5:1 per testo normale.
export function Hero({
  headline,
  locale,
  video,
}: {
  headline: string;
  locale: Locale;
  /**
   * Video impostato da /gestione/contenuti (scheda "Foto delle
   * pagine"). Assente o di tipo diverso da "video" → ricade sul video
   * fisso di sempre (HERO_VIDEO_URL): un dato mancante o sbagliato non
   * deve mai rompere l'hero, solo farlo tornare a come era prima.
   */
  video?: MediaPagina | null;
}) {
  const t = getDizionario(locale);
  const videoSrc = video?.tipo === "video" ? video.url : HERO_VIDEO_URL;
  return (
    <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-dark text-cream-text md:min-h-[92vh]">
      <ImagePlaceholder
        seed="hero-vizio-bistrot"
        aspectRatio="auto"
        className="absolute inset-0 h-full w-full"
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/10" />

      <div className="relative z-10 max-w-3xl px-6 pb-16 pt-32 md:px-12 md:pb-24 lg:px-16">
        <p className="mb-4 flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-muted-dark">
          <FlameAccent className="h-4" />
          Fiumicino
        </p>
        <h1 className="mb-8 font-serif text-4xl font-medium leading-[1.1] md:text-6xl">
          {headline}
        </h1>
        <Link href={localizedPath("/prenota", locale)}>
          <Button type="button" variant="primary">
            {t.cta.prenotaTavolo}
          </Button>
        </Link>

        {/* Valori statici letti dalla fonte unica: diventeranno un
            fetch reale quando arriverà l'integrazione con l'API
            Google (step dedicato successivo). Volutamente discreto:
            non deve competere con la CTA sopra. Contrasto: text-gold
            su bg-dark ≈ 8.7:1, text-muted-dark su bg-dark ≈ 12.2:1. */}
        <p className="mt-4 font-sans text-xs text-muted-dark">
          {RECENSIONI.rating}
          <span className="text-gold" aria-hidden="true">★</span>
          {" · "}
          {RECENSIONI.totale} {locale === "en" ? "Google reviews" : "recensioni Google"}
        </p>
      </div>
    </section>
  );
}
