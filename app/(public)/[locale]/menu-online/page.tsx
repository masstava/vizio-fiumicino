import type { Metadata } from "next";
import { MenuOperativo } from "@/src/components/menu/MenuOperativo";
import { conSezioneSuggerita, ruoloDaMostrarePerPrimo } from "@/src/lib/fascia-oraria";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { metadatiPagina } from "@/src/lib/i18n/metadata";
import { getMenuCompleto } from "@/src/lib/menu-completo";
import { createClient } from "@/src/lib/supabase/server";

const PERCORSO = "/menu-online";

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
    ...metadatiPagina({
      percorso: PERCORSO,
      locale,
      titolo: t.menuOperativo.titoloPagina,
      descrizione: t.menuOperativo.descrizionePagina,
    }),
    // Vista di servizio, non una pagina da posizionare: la vetrina
    // indicizzabile è /menu, che mostra gli stessi piatti con
    // l'impaginazione editoriale. Due pagine con lo stesso menu in
    // concorrenza fra loro sui motori di ricerca sarebbero un danno,
    // non un vantaggio — e questa non ha nemmeno la navigazione.
    robots: { index: false, follow: true },
  };
}

// Vista operativa del menu: è l'URL stampato sui QR ai tavoli.
//
// Niente header e niente footer: non è una scelta estetica ma il
// requisito. Chi arriva qui ha già il locale intorno; una barra di
// navigazione verso "Chi siamo" durante il servizio è rumore, e
// mangia lo spazio verticale che serve al menu.
//
// I dati sono quelli di /menu, letti dalla stessa funzione
// (getMenuCompleto): stessi piatti, stessi prezzi, stessi allergeni.
// Cambia solo l'impaginazione.
export default async function MenuOnlinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const supabase = await createClient();

  const { macro, legenda } = await getMenuCompleto(supabase, locale);

  // Calcolata QUI, una volta sola, al momento della richiesta: il
  // client non la ricalcola mai. Se il cliente resta sulla pagina
  // mentre scatta l'ora dell'aperitivo, l'ordine delle sezioni non
  // cambia sotto le sue dita.
  const ruoloSuggerito = ruoloDaMostrarePerPrimo();
  const ordinate = conSezioneSuggerita(macro, ruoloSuggerito);

  return (
    <main className="min-h-dvh bg-cream">
      <MenuOperativo
        macro={ordinate}
        legenda={legenda}
        locale={locale}
        ruoloSuggerito={ruoloSuggerito}
      />
    </main>
  );
}
