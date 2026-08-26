import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import { Section } from "@/src/components/ui/Section";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";
import { leggiPrenotazioneDaToken } from "./_actions";
import { GestisciPrenotazioneClient } from "./_components/GestisciPrenotazioneClient";

const PERCORSO = "/gestisci-prenotazione";

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
    title: t.paginaGestisci.titolo,
    description: t.paginaGestisci.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
    // Pagina personale, raggiunta solo dal link nell'email: niente da
    // posizionare sui motori di ricerca, stesso trattamento di
    // /menu-online.
    robots: { index: false, follow: true },
  };
}

// Auto-gestione self-service — §21 passo 5.
//
// Visualizzazione + cancellazione, non modifica in-place: per
// cambiare data/orario/coperti il percorso è cancellare e riprenotare
// da /prenota. La modifica dei dati resta possibile solo dal pannello
// staff (passo 4) — decisione presa per non duplicare qui la logica
// di lucchetto/capienza già in crea_prenotazione, per un caso d'uso
// raro.
export default async function GestisciPrenotazionePage({
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
  // dalla prenotazione, e viceversa): partono insieme.
  const [orari, prenotazione] = await Promise.all([
    getOrariSito(supabase, locale),
    token ? leggiPrenotazioneDaToken(token, locale) : Promise.resolve(null),
  ]);

  const t = getDizionario(locale);

  return (
    <main>
      <SiteHeader locale={locale} />
      <PaginaHero
        occhiello={t.paginaGestisci.heroOcchiello}
        titolo={t.paginaGestisci.heroTitolo}
        sottotitolo={t.paginaGestisci.heroSottotitolo}
      />

      <Reveal>
        <Section tone="light">
          <GestisciPrenotazioneClient
            locale={locale}
            token={token ?? ""}
            prenotazione={prenotazione}
          />
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
