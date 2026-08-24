import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { NotaBozza } from "@/src/components/pagine/NotaBozza";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import {
  PiattoIcona,
  type PiattoIconaDati,
} from "@/src/components/pagine/PiattoIcona";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { Section } from "@/src/components/ui/Section";
import { CONTATTI } from "@/src/lib/contatti";
import { getCopyLaCarne } from "@/src/lib/copy/la-carne";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import { isLocale, localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";

const PERCORSO = "/la-carne";

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
    title: t.pagine.laCarne.titolo,
    description: t.pagine.laCarne.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
  };
}

// Pagina editoriale, "Strato 1 — fisso" (§4): il copy sta nel codice
// (src/lib/copy/la-carne.ts), non in contenuti_sito, che resta il CMS
// leggero delle stringhe della home.
//
// L'unica cosa che arriva dal database è il piatto-icona: nome,
// descrizione, foto e badge del Filetto alla Rossini vengono dal
// menu, così la pagina non può descrivere un piatto diverso da quello
// servito. Se il piatto non c'è (rinominato, non disponibile), la
// sezione mostra il solo testo invece di rompersi.
export default async function LaCarnePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  const copy = getCopyLaCarne(locale);
  const supabase = await createClient();

  const [{ data: piattoRow }, orari] = await Promise.all([
    supabase
      .from("piatti")
      .select("id, nome, nome_en, descrizione, descrizione_en, foto_url")
      .ilike("nome", "%rossini%")
      .eq("disponibile", true)
      .order("ordine")
      .limit(1)
      .maybeSingle(),
    getOrariSito(supabase, locale),
  ]);

  let piattoIcona: PiattoIconaDati | null = null;
  if (piattoRow) {
    const { data: badgeRows } = await supabase
      .from("badge")
      .select("testo, testo_en")
      .eq("piatto_id", piattoRow.id);

    piattoIcona = {
      id: piattoRow.id,
      nome: campoLocalizzato(piattoRow.nome, piattoRow.nome_en, locale),
      descrizione: campoLocalizzatoOpzionale(
        piattoRow.descrizione,
        piattoRow.descrizione_en,
        locale,
      ),
      foto_url: piattoRow.foto_url,
      badges: (badgeRows ?? []).map((b) =>
        campoLocalizzato(b.testo, b.testo_en, locale),
      ),
    };
  }

  return (
    <main>
      <SiteHeader locale={locale} />
      <PaginaHero
        occhiello={copy.hero.occhiello}
        titolo={copy.hero.titolo}
        sottotitolo={copy.hero.sottotitolo}
      />

      {/* Il racconto della nicchia su fondo chiaro: dopo due blocchi
          scuri di fila (header + hero) il testo lungo si legge
          meglio, e lo stacco segna il passaggio dal claim al
          discorso. */}
      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.nicchia.titolo}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4">
            {copy.nicchia.paragrafi.map((p) => (
              <p key={p} className="font-sans text-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Piatto-icona su fondo scuro: è il punto più "da rivista"
          della pagina e la foto stacca molto meglio sul buio. */}
      <Reveal>
        <Section tone="dark" className="relative overflow-hidden">
          <DarkSectionAccent />
          <div className="relative z-10">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-widest text-muted-dark">
              {copy.icona.occhiello}
            </p>
            <h2 className="max-w-2xl font-serif text-2xl font-medium text-cream-text md:text-3xl">
              {copy.icona.titolo}
            </h2>
            <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-dark">
              {copy.icona.testo}
            </p>
            {piattoIcona && (
              <div className="mt-8">
                <PiattoIcona piatto={piattoIcona} />
              </div>
            )}
          </div>
        </Section>
      </Reveal>

      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.fuoco.titolo}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4">
            {copy.fuoco.paragrafi.map((p) => (
              <p key={p} className="font-sans text-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <NotaBozza testo={copy.daConfermare} locale={locale} />
        </Section>
      </Reveal>

      {/* Chiusura: la CTA verso il menu completo sta qui e non a metà
          pagina, dopo che il racconto ha fatto il suo lavoro. */}
      <Reveal>
        <Section tone="dark" className="relative overflow-hidden">
          <DarkSectionAccent />
          <div className="relative z-10">
            <h2 className="font-serif text-2xl font-medium text-cream-text md:text-3xl">
              {copy.chiusura.titolo}
            </h2>
            <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-muted-dark">
              {copy.chiusura.testo}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={localizedPath("/menu", locale)}
                className="inline-flex min-h-11 items-center rounded-[2px] bg-bordeaux px-6 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                {t.cta.menuCompleto}
              </Link>
              {/* Prenotazione per telefono: il pulsante "Prenota"
                  dell'header è ancora inerte in attesa
                  dell'integrazione, mentre il numero è reale e
                  funziona già oggi. */}
              <a
                href={CONTATTI.telefono.href}
                className="inline-flex min-h-11 items-center rounded-[2px] border border-cream-text px-6 font-sans text-sm font-medium tracking-wide text-cream-text transition-colors hover:bg-cream-text/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
              >
                {t.cta.prenotaTavolo}
              </a>
            </div>
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
