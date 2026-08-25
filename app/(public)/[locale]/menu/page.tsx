import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { LegendaAllergeni } from "@/src/components/menu/LegendaAllergeni";
import { MenuCompleto } from "@/src/components/menu/MenuCompleto";
import { Section } from "@/src/components/ui/Section";
import type { GiornoOrario } from "@/src/lib/dominio";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { getMenuCompleto } from "@/src/lib/menu-completo";
import { isApertoOra } from "@/src/lib/orari";
import { createClient } from "@/src/lib/supabase/server";

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
    title: t.menu.titoloPagina,
    description: t.menu.descrizionePagina,
    alternates: alternatesPerPagina("/menu", locale),
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  const supabase = await createClient();

  // Lettura condivisa con /menu-online: vedi src/lib/menu-completo.ts.
  const { macro, legenda } = await getMenuCompleto(supabase, locale);

  // Footer: stessa fonte unica del resto del sito.
  const { data: orariRows } = await supabase
    .from("orari")
    .select("giorno_settimana, apertura, chiusura")
    .order("giorno_settimana")
    .order("ordine");

  const fasceByGiorno = new Map<number, { apertura: string; chiusura: string }[]>();
  (orariRows ?? []).forEach((r) => {
    if (!r.apertura || !r.chiusura) return;
    const arr = fasceByGiorno.get(r.giorno_settimana) ?? [];
    arr.push({ apertura: r.apertura.slice(0, 5), chiusura: r.chiusura.slice(0, 5) });
    fasceByGiorno.set(r.giorno_settimana, arr);
  });

  const orariSettimana: GiornoOrario[] = t.giorni.map((nome, giorno) => {
    const fasce = fasceByGiorno.get(giorno) ?? [];
    return { nome, chiuso: fasce.length === 0, fasce };
  });

  const apertoOra = isApertoOra(
    Array.from(fasceByGiorno.entries()).map(([giorno_settimana, fasce]) => ({
      giorno_settimana,
      fasce,
    })),
  );

  const { data: orariConfig } = await supabase
    .from("orari_config")
    .select("nota")
    .maybeSingle();

  return (
    <main>
      <SiteHeader locale={locale} />

      <Section tone="light">
        <h1 className="font-serif text-4xl font-medium text-ink md:text-5xl">
          {t.menu.titoloPagina}
        </h1>
        <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-muted">
          {t.menu.descrizionePagina}
        </p>
      </Section>

      <Section tone="light" className="pt-0">
        <MenuCompleto macro={macro} />
      </Section>

      <LegendaAllergeni
        voci={legenda}
        titolo={t.menu.legendaTitolo}
        nota={t.menu.legendaNota}
      />

      <Footer
        orari={orariSettimana}
        apertoOra={apertoOra}
        notaOrari={orariConfig?.nota ?? null}
        locale={locale}
      />
    </main>
  );
}
