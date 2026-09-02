import type { Metadata } from "next";
import Link from "next/link";
import { CompactDishCard } from "@/src/components/home/CompactDishCard";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import {
  PiattoIcona,
  type PiattoIconaDati,
} from "@/src/components/pagine/PiattoIcona";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { Section } from "@/src/components/ui/Section";
import { CONTATTI } from "@/src/lib/contatti";
import { getCopyCocktailBar } from "@/src/lib/copy/cocktail-bar";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import { isLocale, localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getMediaPagina } from "@/src/lib/media-pagine";
import { getOrariSito } from "@/src/lib/orari-sito";
import { getSelezioneBar } from "@/src/lib/selezione-bar";
import { createClient } from "@/src/lib/supabase/server";

const PERCORSO = "/cocktail-bar";

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
    title: t.pagine.cocktailBar.titolo,
    description: t.pagine.cocktailBar.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
  };
}

// Seconda pagina editoriale di Strato 1, stessa impalcatura della
// pagina "La carne": copy in src/lib/copy/, dati dal database.
//
// I drink mostrati NON sono scritti nel copy: arrivano dal menu, uno
// per categoria diversa (src/lib/selezione-bar.ts). Elencarli a mano
// avrebbe rischiato di ripetere il difetto già corretto in home
// (§18), quattro varianti quasi identiche della stessa cosa; così la
// varietà è garantita dalla struttura, non dall'attenzione di chi
// scrive.
export default async function CocktailBarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  const copy = getCopyCocktailBar(locale);
  const supabase = await createClient();

  const [selezione, orari, { data: drinkRow }, immagineHero] = await Promise.all([
    getSelezioneBar(supabase, locale),
    getOrariSito(supabase, locale),
    supabase
      .from("piatti")
      .select("id, nome, nome_en, descrizione, descrizione_en, foto_url")
      .ilike("nome", "%vizio%")
      .eq("disponibile", true)
      .order("ordine")
      .limit(1)
      .maybeSingle(),
    getMediaPagina(supabase, "cocktail-bar"),
  ]);

  let drinkIcona: PiattoIconaDati | null = null;
  if (drinkRow) {
    const { data: badgeRows } = await supabase
      .from("badge")
      .select("testo, testo_en")
      .eq("piatto_id", drinkRow.id);

    drinkIcona = {
      id: drinkRow.id,
      nome: campoLocalizzato(drinkRow.nome, drinkRow.nome_en, locale),
      descrizione: campoLocalizzatoOpzionale(
        drinkRow.descrizione,
        drinkRow.descrizione_en,
        locale,
      ),
      foto_url: drinkRow.foto_url,
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
        immagineUrl={immagineHero?.tipo === "immagine" ? immagineHero.url : null}
      />

      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.filo.titolo}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4">
            {copy.filo.paragrafi.map((p) => (
              <p key={p} className="font-sans text-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </Section>
      </Reveal>

      {/* Il drink icona: nome, descrizione, foto e badge letti dal
          database (stesso pattern del Filetto alla Rossini su "La
          carne", vedi PiattoIcona). Se il drink non c'è (rinominato,
          non disponibile), restano occhiello/titolo/testo e basta —
          niente scheda sopra il nulla. */}
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
            {drinkIcona && (
              <div className="mt-8">
                <PiattoIcona piatto={drinkIcona} />
              </div>
            )}
          </div>
        </Section>
      </Reveal>

      {/* Vetrina dal database. Se la carta del bancone è vuota o non
          raggiungibile la sezione sparisce invece di lasciare un
          titolo sopra il nulla. */}
      {selezione.length > 0 && (
        <Reveal>
          <Section tone="dark" className="relative overflow-hidden" id="cocktail">
            <DarkSectionAccent />
            <div className="relative z-10">
              <p className="mb-3 font-sans text-[10px] uppercase tracking-widest text-muted-dark">
                {copy.selezione.occhiello}
              </p>
              <h2 className="max-w-2xl font-serif text-2xl font-medium text-cream-text md:text-3xl">
                {copy.selezione.titolo}
              </h2>
              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-dark">
                {copy.selezione.testo}
              </p>
              {/* Quattro colonne solo da lg. A md i quattro drink
                  stavano in 156px l'uno e il nome si riduceva a 80px:
                  troncato sempre, anche quelli corti. */}
              <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                {selezione.map((drink) => (
                  <CompactDishCard
                    key={drink.id}
                    dish={drink}
                    tone="dark"
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          </Section>
        </Reveal>
      )}

      <Reveal>
        <Section tone="light">
          <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink md:text-3xl">
            {copy.analcolici.titolo}
          </h2>
          <div className="mt-5 max-w-2xl space-y-4">
            {copy.analcolici.paragrafi.map((p) => (
              <p key={p} className="font-sans text-base leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
        </Section>
      </Reveal>

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
