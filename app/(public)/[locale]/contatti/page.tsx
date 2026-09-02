import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { IndicatoreApertura } from "@/src/components/pagine/IndicatoreApertura";
import { MappaLocale } from "@/src/components/pagine/MappaLocale";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { Section } from "@/src/components/ui/Section";
import { SocialIcon } from "@/src/components/ui/SocialIcon";
import { CONTATTI } from "@/src/lib/contatti";
import { getCopyContatti } from "@/src/lib/copy/contatti";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getMediaPagina } from "@/src/lib/media-pagine";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";

const PERCORSO = "/contatti";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  return {
    title: t.pagine.contatti.titolo,
    description: t.pagine.contatti.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
  };
}

// Nessun dato di contatto è scritto in questa pagina: indirizzo,
// telefono, WhatsApp e social vengono da src/lib/contatti.ts, gli
// orari dalla stessa lettura usata dal footer (getOrariSito). Duplicare
// anche solo il numero di telefono qui violerebbe il principio NAP.
//
// Due letture indipendenti (orari e l'immagine hero): partono insieme.
export default async function ContattiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  const copy = getCopyContatti(locale);
  const supabase = await createClient();

  const [orari, immagineHero] = await Promise.all([
    getOrariSito(supabase, locale),
    getMediaPagina(supabase, "contatti"),
  ]);
  const orariDefiniti = orari.settimana.some((g) => !g.chiuso);

  return (
    <main>
      <SiteHeader locale={locale} />
      <PaginaHero
        occhiello={copy.hero.occhiello}
        titolo={copy.hero.titolo}
        sottotitolo={copy.hero.sottotitolo}
        immagineUrl={immagineHero?.tipo === "immagine" ? immagineHero.url : null}
      />

      {/* Dove siamo: mappa e indicazioni */}
      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.dove.titolo}
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted">
            {copy.dove.testo}
          </p>

          <address className="mt-6 font-sans text-base not-italic leading-relaxed text-ink">
            {CONTATTI.indirizzo.completo}
          </address>

          <div className="mt-4">
            <a
              href={CONTATTI.google.scheda}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-[2px] bg-bordeaux px-6 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              {t.paginaContatti.indicazioni}
            </a>
          </div>

          <div className="mt-8 max-w-3xl">
            <MappaLocale locale={locale} />
          </div>

          <h3 className="mt-10 font-sans text-[10px] uppercase tracking-widest text-muted">
            {t.paginaContatti.parcheggio}
          </h3>
          <p className="mt-2 max-w-2xl font-sans text-base leading-relaxed text-muted">
            {copy.parcheggio}
          </p>
        </Section>
      </Reveal>

      {/* Orari: stessa fonte del footer, mostrati giorno per giorno
          perché in una pagina dedicata l'elenco esteso si legge meglio
          dei raggruppamenti compatti usati in fondo alle altre. */}
      <Reveal>
        <Section tone="dark" className="relative overflow-hidden">
          <DarkSectionAccent />
          <div className="relative z-10">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <h2 className="font-serif text-2xl font-medium text-cream-text md:text-3xl">
                {copy.quando.titolo}
              </h2>
              <IndicatoreApertura aperto={orari.apertoOra} locale={locale} />
            </div>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-dark">
              {copy.quando.testo}
            </p>

            {orariDefiniti ? (
              <dl className="mt-6 max-w-md">
                {orari.settimana.map((giorno) => (
                  <div
                    key={giorno.nome}
                    className="flex flex-wrap justify-between gap-x-6 gap-y-1 border-b border-cream-text/10 py-2.5"
                  >
                    <dt className="font-sans text-sm text-cream-text">
                      {giorno.nome}
                    </dt>
                    <dd className="font-sans text-sm text-muted-dark">
                      {giorno.chiuso
                        ? t.footer.chiuso
                        : giorno.fasce
                            .map((f) => `${f.apertura}–${f.chiusura}`)
                            .join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-6 font-sans text-sm text-muted-dark">
                {t.footer.orariDaDefinire}
              </p>
            )}

            {orari.nota && (
              <p className="mt-4 max-w-md font-sans text-xs italic text-muted-dark">
                {orari.nota}
              </p>
            )}
          </div>
        </Section>
      </Reveal>

      {/* Parlaci: telefono, WhatsApp, social */}
      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.parlaci.titolo}
          </h2>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted">
            {copy.parlaci.testo}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-6">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted">
                {t.paginaContatti.telefono}
              </p>
              <a
                href={CONTATTI.telefono.href}
                className="inline-flex min-h-11 items-center font-sans text-lg text-bordeaux underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux md:min-h-0"
              >
                {CONTATTI.telefono.display}
              </a>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted">
                {t.paginaContatti.whatsapp}
              </p>
              <a
                href={CONTATTI.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center font-sans text-lg text-bordeaux underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux md:min-h-0"
              >
                {CONTATTI.whatsapp.display}
              </a>
            </div>
          </div>

          <h3 className="mt-10 font-sans text-[10px] uppercase tracking-widest text-muted">
            {t.paginaContatti.seguici}
          </h3>
          <ul className="mt-3 flex flex-wrap items-center gap-1 md:gap-4">
            {CONTATTI.social.map((s) => (
              <li key={s.nome}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t.paginaContatti.apriSu(s.nome)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] text-muted transition-colors hover:text-bordeaux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux"
                >
                  <SocialIcon nome={s.nome} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </Reveal>

      <Footer
        orari={orari.settimana}
        apertoOra={orari.apertoOra}
        notaOrari={orari.nota}
        locale={locale}
      />
    </main>
  );
}
