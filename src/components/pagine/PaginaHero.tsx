import Image from "next/image";
import { FlameAccent } from "@/src/components/ui/FlameAccent";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";

// Apertura delle pagine editoriali. Scura come l'hero della home e
// come chiede §16, ma più bassa: qui non c'è un video, e un primo
// schermo pieno di solo testo respingerebbe invece di invitare.
//
// Niente logo: sta già nell'header sticky, che su queste pagine è
// sempre visibile sopra l'hero. Ripeterlo a due centimetri di
// distanza non aggiunge marchio, aggiunge rumore. Il richiamo di
// identità è la fiamma nell'occhiello, come in home.
//
// Non avvolto in Reveal da chi lo usa: è sopra la piega e partire da
// opacità 0 sposterebbe l'LCP.
//
// Contrasto su bg-dark: cream-text 17,6:1, muted-dark 12,2:1. Con
// un'immagine impostata il testo sta sullo stesso gradiente scuro già
// verificato per l'hero della home (from-dark via-dark/70), non più su
// bg-dark piatto — stesso margine di contrasto, cambia solo cosa c'è
// dietro al gradiente.
export function PaginaHero({
  occhiello,
  titolo,
  sottotitolo,
  immagineUrl,
}: {
  occhiello: string;
  titolo: string;
  sottotitolo: string;
  /**
   * Impostata da /gestione/contenuti (scheda "Foto delle pagine").
   * Assente o nulla → nessuna immagine, la sezione resta esattamente
   * come oggi (bg-dark + DarkSectionAccent): introdurre un'immagine è
   * una funzionalità nuova, non deve cambiare l'aspetto delle pagine
   * che non ne hanno ancora impostata una.
   */
  immagineUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-dark text-cream-text">
      {immagineUrl ? (
        <>
          <Image
            src={immagineUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/30" />
        </>
      ) : (
        <DarkSectionAccent />
      )}
      <div className="relative z-10 max-w-3xl px-6 pb-14 pt-16 md:px-12 md:pb-20 md:pt-24 lg:px-16">
        <p className="mb-4 flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-dark">
          <FlameAccent className="h-4" />
          {occhiello}
        </p>
        <h1 className="font-serif text-3xl font-medium leading-[1.15] md:text-5xl">
          {titolo}
        </h1>
        <p className="mt-5 max-w-2xl font-sans text-base leading-relaxed text-muted-dark md:text-lg">
          {sottotitolo}
        </p>
      </div>
    </section>
  );
}
