import type { Metadata } from "next";
import { createClient } from "@/src/lib/supabase/server";
import { BarCocktailPreview } from "@/src/components/home/BarCocktailPreview";
import { ExperienceEventi } from "@/src/components/home/ExperienceEventi";
import { FeaturedDishes } from "@/src/components/home/FeaturedDishes";
import type { GiornoOrario, PiattoAnteprima } from "@/src/lib/dominio";
import { Footer } from "@/src/components/home/Footer";
import { Hero } from "@/src/components/home/Hero";
import { MenuPreview } from "@/src/components/home/MenuPreview";
import { Newsletter } from "@/src/components/home/Newsletter";
import { Reveal } from "@/src/components/motion/Reveal";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { SocialProof } from "@/src/components/home/SocialProof";
import { ThreePillars } from "@/src/components/home/ThreePillars";
import { getAnteprimaHome } from "@/src/lib/anteprima-home";
import { getMediaPagina } from "@/src/lib/media-pagine";
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

type ClientSupabase = Awaited<ReturnType<typeof createClient>>;

// Piatti in evidenza: tre letture, di cui due dipendono dalla prima.
//
// Sta in una funzione a parte, e non in fila nel corpo della pagina,
// perché Promise.all è una BARRIERA: mettere le due dipendenti in un
// secondo Promise.all dopo il primo le farebbe aspettare anche la più
// lenta delle query indipendenti (la catena dell'anteprima home, che
// è profonda 4). Misurato: partivano a 170ms invece che a 40ms.
//
// Così invece l'intero ramo evidenza è UNA voce del Promise.all di
// primo livello e scorre in parallelo agli altri: la pagina paga la
// catena più lunga, non la somma.
async function leggiInEvidenza(supabase: ClientSupabase) {
  const { data: links } = await supabase
    .from("piatti_in_evidenza")
    .select("piatto_id, ordine")
    .order("ordine");

  const ids = (links ?? []).map((e) => e.piatto_id);
  if (ids.length === 0) return { links: [], piatti: [], badge: [] };

  // Dipendono entrambe dagli id, ma non l'una dall'altra.
  const [{ data: piatti }, { data: badge }] = await Promise.all([
    supabase
      .from("piatti")
      .select("id, nome, nome_en, descrizione, descrizione_en, foto_url")
      .in("id", ids)
      .eq("disponibile", true),
    // Un solo badge per piatto (se presente), stesso pattern già usato
    // per le anteprime menu/cocktail.
    supabase.from("badge").select("piatto_id, testo").in("piatto_id", ids),
  ]);

  return { links: links ?? [], piatti: piatti ?? [], badge: badge ?? [] };
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

  // Data di oggi a Roma, per il filtro sul prossimo evento. Calcolata
  // prima delle query perché serve a costruirne una.
  const oggiRoma = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  // Primo livello: sette letture che non dipendono l'una dall'altra,
  // quindi partono insieme (la settima, il video hero, si è aggiunta
  // qui nel passaggio 5b — mai attesa da sola in sequenza, per lo
  // stesso motivo per cui esiste questo Promise.all). Prima erano sei
  // await in fila e la pagina pagava la somma delle latenze invece
  // della più lenta: undici andate e ritorno in sequenza contando
  // anche le dipendenti sotto. La home è force-dynamic, quindi
  // succedeva a ogni richiesta.
  const [
    evidenza,
    anteprima,
    { data: orariRows },
    { data: orariConfig },
    { data: contenutiRows },
    { data: prossimoEvento },
    video,
  ] = await Promise.all([
    // Ramo completo (tre letture, profondità 2): vedi leggiInEvidenza.
    leggiInEvidenza(supabase),

    // Anteprima menu e cocktail: selezione curata dalla dashboard
    // (flag "Mostra nell'anteprima home"), nell'ordine impostato lì.
    // Prima si pescavano i primi N piatti per ordine di inserimento,
    // e la home finiva per mostrare solo aperitivi e taglieri.
    getAnteprimaHome(supabase, locale),

    // Orari per il footer: stessa fonte unica usata in
    // /gestione/orari e nella route del PDF orari.
    supabase
      .from("orari")
      .select("giorno_settimana, apertura, chiusura")
      .order("giorno_settimana")
      .order("ordine"),

    // Nota orari temporanei (es. orario estivo): mostrata accanto agli
    // orari, così un orario stagionale non passa per definitivo. La
    // data di validità è solo un promemoria per la dashboard.
    supabase.from("orari_config").select("nota").maybeSingle(),

    // Testi editabili dalla dashboard. Chiave vuota o assente → resta
    // il testo scritto nel codice, così la home non mostra mai un
    // vuoto (vedi src/lib/contenuti.ts).
    supabase.from("contenuti_sito").select("chiave, valore, valore_en"),

    // Prossimo evento datato: un appuntamento reale crea urgenza, il
    // testo generico no. Solo eventi attivi con data da oggi in poi;
    // se non ce ne sono, la sezione resta com'era.
    supabase
      .from("eventi")
      .select("id, titolo, titolo_en, descrizione, descrizione_en, data_evento")
      .eq("attivo", true)
      .not("data_evento", "is", null)
      .gte("data_evento", oggiRoma)
      .order("data_evento")
      .limit(1)
      .maybeSingle(),

    // Video hero impostato da /gestione/contenuti. Assente → Hero
    // ricade sul video fisso di sempre (vedi Hero.tsx).
    getMediaPagina(supabase, "home"),
  ]);

  const evidenzaBadgeByPiatto = new Map<string, string>();
  evidenza.badge.forEach((b) => {
    if (!evidenzaBadgeByPiatto.has(b.piatto_id)) {
      evidenzaBadgeByPiatto.set(b.piatto_id, b.testo);
    }
  });

  const piattoById = new Map(evidenza.piatti.map((p) => [p.id, p]));
  const featuredDishes: PiattoAnteprima[] = evidenza.links
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

  const menuPreviewDishes = anteprima.menu;
  const cocktailDishes = anteprima.cocktail;

  // Da qui in giù solo calcoli sui dati già letti: nessuna altra
  // andata e ritorno verso il database.
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

  const testi = risolviContenuti(contenutiRows, locale);

  return (
    <main>
      {/* Header ed hero non sono avvolti in Reveal di proposito: sono
          sopra la piega, e farli partire invisibili sposterebbe l'LCP. */}
      <SiteHeader locale={locale} />
      <Hero headline={testi["hero.headline"]} locale={locale} video={video} />

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
        <Newsletter locale={locale} offerta={testi["newsletter.offerta"]} />
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
