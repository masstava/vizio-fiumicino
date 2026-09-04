import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import { Section } from "@/src/components/ui/Section";
import { isLocale, localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";
import { disiscrivitiNewsletter } from "./_actions";

const PERCORSO = "/disiscrivi-newsletter";

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
    title: t.paginaDisiscrizione.titolo,
    description: t.paginaDisiscrizione.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
    // Pagina personale, raggiunta solo dal link nell'email: stesso
    // trattamento di /gestisci-prenotazione.
    robots: { index: false, follow: true },
  };
}

// Disiscrizione — §4 dell'audit sui testi legali (2026-09-04): la
// Privacy Policy prometteva un link che non esisteva, questa pagina
// lo rende vero.
//
// Un solo clic, nessun secondo passaggio di conferma: a differenza
// della cancellazione di una prenotazione (dialogo di conferma in
// GestisciPrenotazioneClient), qui non c'è nulla da perdere in modo
// difficilmente reversibile — chi si disiscrive per errore può
// re-iscriversi da capo, e riattiva la stessa riga (vedi la migration
// 20260905000000). La RPC gira automaticamente al caricamento della
// pagina, stesso principio dei link "un clic" usati da qualunque
// piattaforma di invio email.
export default async function DisiscriviNewsletterPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const { token } = await searchParams;
  const supabase = await createClient();

  // Due letture indipendenti (gli orari del footer non dipendono
  // dall'esito della disiscrizione): partono insieme.
  const [orari, esito] = await Promise.all([
    getOrariSito(supabase, locale),
    disiscrivitiNewsletter(token ?? ""),
  ]);

  const t = getDizionario(locale);

  const contenuto = esito.ok
    ? { titolo: t.paginaDisiscrizione.fattoTitolo, testo: t.paginaDisiscrizione.fattoTesto }
    : esito.motivo === "gia_disiscritto"
      ? {
          titolo: t.paginaDisiscrizione.giaFattoTitolo,
          testo: t.paginaDisiscrizione.giaFattoTesto,
        }
      : esito.motivo === "token_non_valido"
        ? {
            titolo: t.paginaDisiscrizione.linkNonValidoTitolo,
            testo: t.paginaDisiscrizione.linkNonValidoTesto,
          }
        : {
            // "sconosciuto": un problema nostro (RPC/rete), non del
            // link — distinto apposta da "link non valido", che
            // implicherebbe un errore di chi lo ha seguito.
            titolo: t.paginaDisiscrizione.erroreTitolo,
            testo: t.paginaDisiscrizione.erroreTesto,
          };

  return (
    <main>
      <SiteHeader locale={locale} />
      <PaginaHero
        occhiello={t.paginaDisiscrizione.heroOcchiello}
        titolo={t.paginaDisiscrizione.heroTitolo}
        sottotitolo={t.paginaDisiscrizione.heroSottotitolo}
      />

      <Reveal>
        <Section tone="light">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-medium text-ink md:text-3xl">
              {contenuto.titolo}
            </h2>
            <p className="mt-3 font-sans text-base leading-relaxed text-muted">
              {contenuto.testo}
            </p>
            <Link
              href={localizedPath("/", locale)}
              className="mt-6 inline-flex min-h-11 items-center font-sans text-sm text-bordeaux underline underline-offset-4 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux md:min-h-0"
            >
              {t.paginaDisiscrizione.tornaHome}
            </Link>
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
