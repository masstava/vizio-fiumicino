import { CONTATTI } from "@/src/lib/contatti";
import { isLocale, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { DESCRIZIONE_SITO, NOME_SITO } from "@/src/lib/i18n/metadata";

// Testi delle anteprime social per pagina: gli STESSI titolo e
// descrizione che la pagina dichiara nel proprio metadata (dizionario),
// non una seconda versione da tenere allineata.
type Dizionario = ReturnType<typeof getDizionario>;

const TESTI = {
  home: () => ({ titolo: NOME_SITO, descrizione: null }),
  menu: (t: Dizionario) => ({ titolo: t.menu.titoloPagina, descrizione: t.menu.descrizionePagina }),
  menuOnline: (t: Dizionario) => ({ titolo: t.menuOperativo.titoloPagina, descrizione: t.menuOperativo.descrizionePagina }),
  laCarne: (t: Dizionario) => t.pagine.laCarne,
  cocktailBar: (t: Dizionario) => t.pagine.cocktailBar,
  experience: (t: Dizionario) => t.pagine.experience,
  contatti: (t: Dizionario) => t.pagine.contatti,
  prenota: (t: Dizionario) => t.paginaPrenota,
  privacy: (t: Dizionario) => t.pagine.privacy,
  cookiePolicy: (t: Dizionario) => t.pagine.cookiePolicy,
} satisfies Record<string, (t: Dizionario) => { titolo: string; descrizione: string | null }>;

export type PaginaSocial = keyof typeof TESTI;

export async function testiAnteprima(pagina: PaginaSocial, params: Promise<{ locale: string }>) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "it";
  const { titolo, descrizione } = TESTI[pagina](getDizionario(locale));
  return {
    titolo,
    descrizione: descrizione ?? DESCRIZIONE_SITO[locale],
    luogo: `${CONTATTI.indirizzo.citta} · ${CONTATTI.indirizzo.via}`,
  };
}
