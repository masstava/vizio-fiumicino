import { headers } from "next/headers";
import Link from "next/link";
import { FlameAccent } from "@/src/components/ui/FlameAccent";
import { Logo } from "@/src/components/ui/Logo";
import { HEADER_LINGUA } from "@/middleware";
import { isLocale, localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Pagina 404 del sito pubblico.
//
// Il middleware riscrive OGNI percorso pubblico dentro l'albero
// [locale], quindi anche un URL che non corrisponde a nulla finisce
// qui: questa pagina copre tutto il sito, non solo le rotte sotto
// /it e /en.
//
// I file not-found di Next non ricevono i parametri di rotta, perciò
// la lingua arriva dall'header impostato dal middleware. Se manca —
// caso che non dovrebbe verificarsi — si ricade sull'italiano.
export default async function NonTrovata() {
  const intestazioni = await headers();
  const grezza = intestazioni.get(HEADER_LINGUA) ?? "it";
  const locale: Locale = isLocale(grezza) ? grezza : "it";
  const t = getDizionario(locale);

  return (
    // Fondo scuro: è una delle superfici dove il marchio con lettering
    // si può usare (su crema l'oro darebbe 1,46:1).
    <main className="flex min-h-dvh flex-col items-center justify-center bg-dark px-6 text-center text-cream-text">
      <Logo className="mb-10 h-9" />

      <p
        aria-hidden="true"
        className="flex items-center gap-3 font-sans text-xs tracking-[0.3em] text-muted-dark"
      >
        <FlameAccent className="h-4" />
        {t.nonTrovata.codice}
      </p>

      <h1 className="mt-5 max-w-xl font-serif text-3xl font-medium leading-tight md:text-4xl">
        {t.nonTrovata.titolo}
      </h1>
      <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-muted-dark">
        {t.nonTrovata.testo}
      </p>

      <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href={localizedPath("/", locale)}
          className="inline-flex items-center justify-center rounded-[2px] bg-bordeaux px-6 py-2.5 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
        >
          {t.nonTrovata.tornaHome}
        </Link>
        <Link
          href={localizedPath("/menu", locale)}
          className="font-sans text-sm text-muted-dark underline underline-offset-4 transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
        >
          {t.nonTrovata.vaiAlMenu}
        </Link>
      </div>
    </main>
  );
}
