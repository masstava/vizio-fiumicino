import type { Metadata } from "next";
import { createClient } from "@/src/lib/supabase/server";
import { BarCocktailPreview } from "@/src/components/home/BarCocktailPreview";
import { ExperienceEventi } from "@/src/components/home/ExperienceEventi";
import { FeaturedDishes } from "@/src/components/home/FeaturedDishes";
import type { FeaturedDish } from "@/src/components/home/FeaturedDishSlide";
import { Footer, type GiornoOrario } from "@/src/components/home/Footer";
import { Hero } from "@/src/components/home/Hero";
import { MenuPreview } from "@/src/components/home/MenuPreview";
import { Newsletter } from "@/src/components/home/Newsletter";
import { Reveal } from "@/src/components/motion/Reveal";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { SocialProof } from "@/src/components/home/SocialProof";
import { ThreePillars } from "@/src/components/home/ThreePillars";
import { getAnteprimaHome } from "@/src/lib/anteprima-home";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
import { risolviContenuti } from "@/src/lib/contenuti";
import { isApertoOra } from "@/src/lib/orari";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  return { alternates: alternatesPerPagina("/", locale) };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const t = getDizionario(locale);
  const supabase = await createClient();

  const { data: evidenzaLinks } = await supabase
    .from("piatti_in_evidenza")
    .select("piatto_id, ordine")
    .order("ordine");

  const evidenzaIds = (evidenzaLinks ?? []).map((e) => e.piatto_id);

  const { data: evidenzaPiatti } = evidenzaIds.length
    ? await supabase
        .from("piatti")
        .select("id, nome, nome_en, descrizione, descrizione_en, foto_url")
        .in("id", evidenzaIds)
        .eq("disponibile", true)
    : {
        data: [] as {
          id: string;
          nome: string;
          nome_en: string | null;
          descrizione: string | null;
          descrizione_en: string | null;
          foto_url: string | null;
        }[],
      };

  // Un solo badge per piatto (se presente), stesso pattern già usato
  // per le anteprime menu/cocktail.
  const { data: evidenzaBadgeLinks } = evidenzaIds.length
    ? await supabase
        .from("badge")
        .select("piatto_id, testo")
        .in("piatto_id", evidenzaIds)
    : { data: [] as { piatto_id: string; testo: string }[] };

  const evidenzaBadgeByPiatto = new Map<string, string>();
  (evidenzaBadgeLinks ?? []).forEach((b) => {
    if (!evidenzaBadgeByPiatto.has(b.piatto_id)) {
      evidenzaBadgeByPiatto.set(b.piatto_id, b.testo);
    }
  });

  const piattoById = new Map((evidenzaPiatti ?? []).map((p) => [p.id, p]));
  const featuredDishes: FeaturedDish[] = (evidenzaLinks ?? [])
    .map((e) => piattoById.get(e.piatto_id))
    .filter((p): p is NonNullable<typeof p> => p != null)
    .map((p) => ({
      id: p.id,
      nome: campoLocalizzato(p.nome, p.nome_en, locale),
      descrizione: campoLocalizzatoOpzionale(
        p.descrizione,
        p.descrizione_en,
        locale,
      ),
      foto_url: p.foto_url,
      badge: evidenzaBadgeByPiatto.get(p.id) ?? null,
    }));

  // Anteprima menu e cocktail: selezione curata dalla dashboard
  // (flag "Mostra nell'anteprima home"), nell'ordine impostato lì.
  // Prima si pescavano i primi N piatti per ordine di inserimento,
  // e la home finiva per mostrare solo aperitivi e taglieri.
  const anteprima = await getAnteprimaHome(supabase, locale);
  const menuPreviewDishes = anteprima.menu;
  const cocktailDishes = anteprima.cocktail;

  // Orari per il footer: stessa fonte unica usata in /gestione/orari
  // e nella route del PDF orari.
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

  // Nota orari temporanei (es. orario estivo): mostrata sul sito
  // accanto agli orari, così un orario stagionale non passa per
  // definitivo. La data di validità è solo un promemoria per la
  // dashboard, qui non serve.
  const { data: orariConfig } = await supabase
    .from("orari_config")
    .select("nota")
    .maybeSingle();

  const apertoOra = isApertoOra(
    Array.from(fasceByGiorno.entries()).map(([giorno_settimana, fasce]) => ({
      giorno_settimana,
      fasce,
    })),
  );

  // Testi editabili dalla dashboard. Chiave vuota o assente → resta
  // il testo scritto nel codice, così la home non mostra mai un
  // vuoto (vedi src/lib/contenuti.ts).
  const { data: contenutiRows } = await supabase
    .from("contenuti_sito")
    .select("chiave, valore, valore_en");
  const testi = risolviContenuti(contenutiRows, locale);

  // Prossimo evento datato: un appuntamento reale crea urgenza, il
  // testo generico no. Solo eventi attivi con data da oggi in poi;
  // se non ce ne sono, la sezione resta com'era.
  const oggiRoma = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const { data: prossimoEvento } = await supabase
    .from("eventi")
    .select("id, titolo, titolo_en, descrizione, descrizione_en, data_evento")
    .eq("attivo", true)
    .not("data_evento", "is", null)
    .gte("data_evento", oggiRoma)
    .order("data_evento")
    .limit(1)
    .maybeSingle();

  return (
    <main>
      {/* Header ed hero non sono avvolti in Reveal di proposito: sono
          sopra la piega, e farli partire invisibili sposterebbe l'LCP. */}
      <SiteHeader locale={locale} />
      <Hero headline={testi["hero.headline"]} locale={locale} />

      <Reveal>
        <ThreePillars testi={testi} locale={locale} />
      </Reveal>
      <Reveal>
        <FeaturedDishes dishes={featuredDishes} locale={locale} />
      </Reveal>
      <Reveal>
        <SocialProof
          citazione={testi["recensione.testo"]}
          autore={testi["recensione.autore"]}
          locale={locale}
        />
      </Reveal>
      <Reveal>
        <MenuPreview dishes={menuPreviewDishes} locale={locale} />
      </Reveal>
      <Reveal>
        <BarCocktailPreview dishes={cocktailDishes} locale={locale} />
      </Reveal>
      <Reveal>
        <ExperienceEventi
          evento={
            prossimoEvento
              ? {
                  id: prossimoEvento.id,
                  titolo: campoLocalizzato(
                    prossimoEvento.titolo,
                    prossimoEvento.titolo_en,
                    locale,
                  ),
                  descrizione: campoLocalizzatoOpzionale(
                    prossimoEvento.descrizione,
                    prossimoEvento.descrizione_en,
                    locale,
                  ),
                  data_evento: prossimoEvento.data_evento,
                }
              : null
          }
          locale={locale}
        />
      </Reveal>
      <Reveal>
        <Newsletter locale={locale} />
      </Reveal>

      <Footer
        orari={orariSettimana}
        apertoOra={apertoOra}
        notaOrari={orariConfig?.nota ?? null}
        locale={locale}
      />
    </main>
  );
}
