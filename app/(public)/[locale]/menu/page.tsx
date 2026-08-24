import type { Metadata } from "next";
import { Footer } from "@/src/components/home/Footer";
import { SiteHeader } from "@/src/components/home/SiteHeader";
import { LegendaAllergeni, type VoceAllergene } from "@/src/components/menu/LegendaAllergeni";
import { MenuCompleto, type MacroMenu } from "@/src/components/menu/MenuCompleto";
import { Section } from "@/src/components/ui/Section";
import type { GiornoOrario, PiattoRiga } from "@/src/lib/dominio";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { alternatesPerPagina } from "@/src/lib/i18n/metadata";
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

  // Fetch espliciti e join lato JS con Map, come nel resto del
  // progetto: mai join annidati di PostgREST.
  const [
    { data: macroRows },
    { data: categorieRows },
    { data: piattiRows },
    { data: allergeniRows },
  ] = await Promise.all([
    // Niente nome_en qui: la colonna esiste su "categorie" ma NON su
    // "categorie_macro" — la migration delle traduzioni copriva solo
    // le categorie di secondo livello. Chiederla faceva fallire la
    // query con un 400 di PostgREST, e siccome l'errore non veniva
    // letto il risultato era null: l'intera pagina menu si svuotava.
    // I titoli delle macro restano quindi in italiano anche in EN
    // finché la colonna non c'è (vedi supabase/migrations).
    supabase
      .from("categorie_macro")
      .select("id, nome, ordine")
      .order("ordine"),
    supabase
      .from("categorie")
      .select("id, nome, nome_en, ordine, categoria_macro_id")
      .order("ordine"),
    supabase
      .from("piatti")
      .select(
        "id, categoria_id, nome, nome_en, descrizione, descrizione_en, prezzo, prezzo_variabile, foto_url, ordine",
      )
      .eq("disponibile", true)
      .order("ordine"),
    supabase.from("allergeni").select("id, nome_it, nome_en").order("id"),
  ]);

  const piattoIds = (piattiRows ?? []).map((p) => p.id);

  const [{ data: allergeniLinks }, { data: badgeLinks }] = await Promise.all([
    piattoIds.length
      ? supabase
          .from("piatti_allergeni")
          .select("piatto_id, allergene_id")
          .in("piatto_id", piattoIds)
      : Promise.resolve({
          data: [] as { piatto_id: string; allergene_id: number }[],
        }),
    piattoIds.length
      ? supabase
          .from("badge")
          .select("piatto_id, testo, testo_en")
          .in("piatto_id", piattoIds)
      : Promise.resolve({
          data: [] as {
            piatto_id: string;
            testo: string;
            testo_en: string | null;
          }[],
        }),
  ]);

  const allergeniByPiatto = new Map<string, number[]>();
  (allergeniLinks ?? []).forEach((l) => {
    const arr = allergeniByPiatto.get(l.piatto_id) ?? [];
    arr.push(l.allergene_id);
    allergeniByPiatto.set(l.piatto_id, arr);
  });

  const badgeByPiatto = new Map<string, string[]>();
  (badgeLinks ?? []).forEach((b) => {
    const arr = badgeByPiatto.get(b.piatto_id) ?? [];
    arr.push(campoLocalizzato(b.testo, b.testo_en, locale));
    badgeByPiatto.set(b.piatto_id, arr);
  });

  const piattiByCategoria = new Map<string, PiattoRiga[]>();
  (piattiRows ?? []).forEach((p) => {
    const arr = piattiByCategoria.get(p.categoria_id) ?? [];
    arr.push({
      id: p.id,
      nome: campoLocalizzato(p.nome, p.nome_en, locale),
      descrizione: campoLocalizzatoOpzionale(
        p.descrizione,
        p.descrizione_en,
        locale,
      ),
      // Il prezzo qui è SEMPRE visibile: è la differenza voluta
      // rispetto alle anteprime in home, che non lo mostrano mai.
      prezzo: p.prezzo,
      prezzo_variabile: p.prezzo_variabile,
      foto_url: p.foto_url,
      allergeni: allergeniByPiatto.get(p.id) ?? [],
      badges: badgeByPiatto.get(p.id) ?? [],
    });
    piattiByCategoria.set(p.categoria_id, arr);
  });

  // Categorie e macro senza piatti disponibili non compaiono: una
  // sezione vuota sul menu è peggio di una sezione assente.
  const macro: MacroMenu[] = (macroRows ?? [])
    .map((m) => ({
      id: m.id,
      nome: m.nome,
      categorie: (categorieRows ?? [])
        .filter((c) => c.categoria_macro_id === m.id)
        .map((c) => ({
          id: c.id,
          nome: campoLocalizzato(c.nome, c.nome_en, locale),
          piatti: piattiByCategoria.get(c.id) ?? [],
        }))
        .filter((c) => c.piatti.length > 0),
    }))
    .filter((m) => m.categorie.length > 0);

  // Solo gli allergeni davvero usati da almeno un piatto: la legenda
  // completa a 14 voci elencherebbe codici che nel menu non compaiono.
  const usati = new Set<number>();
  allergeniByPiatto.forEach((codici) => codici.forEach((c) => usati.add(c)));
  const legenda: VoceAllergene[] = (allergeniRows ?? [])
    .filter((a) => usati.has(a.id))
    .map((a) => ({
      id: a.id,
      nome: campoLocalizzato(a.nome_it, a.nome_en, locale),
    }));

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
