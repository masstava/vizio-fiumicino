import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { Section } from "@/src/components/ui/Section";
import { CONTATTI } from "@/src/lib/contatti";
import { getCopyExperience } from "@/src/lib/copy/experience-eventi";
import { formatDataEvento, getEventiFuturi } from "@/src/lib/eventi-sito";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getMediaPagina } from "@/src/lib/media-pagine";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";

const PERCORSO = "/experience-eventi";

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
    title: t.pagine.experience.titolo,
    description: t.pagine.experience.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
  };
}

// §8, blocco 7: pagina volutamente minimale. Gli eventi privati si
// organizzano con un contatto diretto — NESSUN modulo, nessun flusso
// di prenotazione sala, nemmeno accennato nel testo.
//
// Gli eventi arrivano dalla tabella eventi, la stessa che alimenta
// l'evento datato in home e che si gestisce in dashboard: qui però si
// mostra l'elenco completo dei futuri, non solo il primo.
export default async function ExperienceEventiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  const copy = getCopyExperience(locale);
  const supabase = await createClient();

  // Tre letture indipendenti: partono insieme.
  const [eventi, orari, immagineHero] = await Promise.all([
    getEventiFuturi(supabase, locale),
    getOrariSito(supabase, locale),
    getMediaPagina(supabase, "experience-eventi"),
  ]);

  return (
    <main>
      <SiteHeader locale={locale} />
      <PaginaHero
        occhiello={copy.hero.occhiello}
        titolo={copy.hero.titolo}
        sottotitolo={copy.hero.sottotitolo}
        immagineUrl={immagineHero?.tipo === "immagine" ? immagineHero.url : null}
      />

      {/* Menu degustazione */}
      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.degustazione.titolo}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4">
            {copy.degustazione.paragrafi.map((p) => (
              <p key={p} className="font-sans text-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={CONTATTI.telefono.href}
              className="inline-flex min-h-11 items-center rounded-[2px] bg-bordeaux px-6 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              {CONTATTI.telefono.display}
            </a>
          </div>
        </Section>
      </Reveal>

      {/* Eventi in programma: dal database. Se non ce ne sono, il
          blocco resta con un testo che lo dice, invece di sparire:
          una pagina "Eventi" senza la parola eventi confonderebbe. */}
      <Reveal>
        <Section tone="dark" className="relative overflow-hidden" id="eventi">
          <DarkSectionAccent />
          <div className="relative z-10">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-widest text-muted-dark">
              {copy.eventi.occhiello}
            </p>
            <h2 className="max-w-2xl font-serif text-2xl font-medium text-cream-text md:text-3xl">
              {copy.eventi.titolo}
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-dark">
              {eventi.length > 0 ? copy.eventi.testo : copy.eventi.nessuno}
            </p>

            {eventi.length > 0 && (
              <ul className="mt-8 max-w-2xl">
                {eventi.map((evento) => (
                  <li
                    key={evento.id}
                    className="border-b border-cream-text/10 py-5 first:border-t"
                  >
                    {evento.data_evento && (
                      <p className="font-sans text-sm font-medium text-gold-brand">
                        <time dateTime={evento.data_evento}>
                          {formatDataEvento(evento.data_evento, locale)}
                        </time>
                      </p>
                    )}
                    <h3 className="mt-1 font-serif text-xl font-medium text-cream-text">
                      {evento.titolo}
                    </h3>
                    {evento.descrizione && (
                      <p className="mt-2 font-sans text-sm leading-relaxed text-muted-dark">
                        {evento.descrizione}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      </Reveal>

      {/* Eventi privati: SOLO contatto diretto. Nessun form. */}
      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.privati.titolo}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4">
            {copy.privati.paragrafi.map((p) => (
              <p key={p} className="font-sans text-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={CONTATTI.telefono.href}
              className="inline-flex min-h-11 items-center rounded-[2px] bg-bordeaux px-6 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              {CONTATTI.telefono.display}
            </a>
            <a
              href={CONTATTI.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-[2px] border border-ink/30 px-6 font-sans text-sm font-medium tracking-wide text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              {t.cta.scriviciWhatsapp}
            </a>
          </div>
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
