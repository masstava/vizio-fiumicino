import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { InformativaLegale } from "@/src/components/pagine/Informativa";
import { getPrivacy } from "@/src/lib/copy/privacy";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { AGGIORNAMENTO_INFORMATIVE } from "@/src/lib/legale";
import { getOrariSito } from "@/src/lib/orari-sito";
import { createClient } from "@/src/lib/supabase/server";

const PERCORSO = "/privacy";

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
    title: t.pagine.privacy.titolo,
    description: t.pagine.privacy.descrizione,
    alternates: alternatesPerPagina(PERCORSO, locale),
  };
}

// Il testo sta in src/lib/copy/privacy.ts come dati, non come markup:
// la resa è condivisa con la Cookie Policy (InformativaLegale), così
// le due non possono divergere nella presentazione.
//
// Nessuna lettura dal database oltre agli orari del footer.
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const supabase = await createClient();
  const orari = await getOrariSito(supabase, locale);

  return (
    <main>
      <SiteHeader locale={locale} />
      <InformativaLegale
        dati={getPrivacy(locale)}
        dataAggiornamento={AGGIORNAMENTO_INFORMATIVE}
        locale={locale}
      />
      <Footer
        orari={orari.settimana}
        apertoOra={orari.apertoOra}
        notaOrari={orari.nota}
        locale={locale}
      />
    </main>
  );
}
