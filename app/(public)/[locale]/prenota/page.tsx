import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { Reveal } from "@/src/components/motion/Reveal";
import { PaginaHero } from "@/src/components/pagine/PaginaHero";
import { Section } from "@/src/components/ui/Section";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { oggiEOraRoma } from "@/src/lib/prenotazioni/disponibilita";
import { getContestoEvento } from "@/src/lib/prenotazioni/evento-contesto";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";
import { PrenotaForm } from "./_components/PrenotaForm";

const PERCORSO = "/prenota";

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
    title: t.paginaPrenota.titolo,
    description: t.paginaPrenota.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
  };
}

// Form pubblico di prenotazione — §21, passo 2.
//
// "evento_id" nella query string collega la prenotazione a un evento
// di Experience & Eventi: se presente e valido, il form mostra anche
// gli eventuali campi extra di quell'evento. Un id mancante, mal
// formato o di un evento non più attivo non rompe la pagina — il form
// si comporta come se il parametro non ci fosse (vedi
// getContestoEvento).
//
// Le due letture sono indipendenti (orari del locale, contesto
// dell'evento) e partono insieme.
export default async function PrenotaPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ evento_id?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const { evento_id: eventoIdParam } = await searchParams;
  const supabase = await createClient();

  const [orari, contestoEvento] = await Promise.all([
    getOrariSito(supabase, locale),
    eventoIdParam
      ? getContestoEvento(supabase, locale, eventoIdParam)
      : Promise.resolve(null),
  ]);

  const { data: dataOdierna, ora: oraAttuale } = oggiEOraRoma();

  return (
    <main>
      <SiteHeader locale={locale} />
      <PaginaHero
        occhiello={getDizionario(locale).paginaPrenota.heroOcchiello}
        titolo={getDizionario(locale).paginaPrenota.heroTitolo}
        sottotitolo={getDizionario(locale).paginaPrenota.heroSottotitolo}
      />

      <Reveal>
        <Section tone="light">
          <PrenotaForm
            locale={locale}
            settimana={orari.settimana}
            dataOdierna={dataOdierna}
            oraAttuale={oraAttuale}
            contestoEvento={contestoEvento}
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
