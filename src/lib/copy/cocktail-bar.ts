import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// COPY DELLA PAGINA "COCKTAIL & BAR"
// =============================================================
// Stesso registro editoriale della pagina "La carne", tema bancone.
// Scritto sul posizionamento di progetto: "qualità, gusto e libertà
// senza compromessi", dall'aperitivo al dopocena.
//
// "icona" è testo definitivo: sostituisce il vecchio segnaposto
// "firma della casa da raccontare" — carta stagionale e nome del bar
// manager non erano confermati come reali, quindi non si menzionano
// più. Il drink stesso (nome, descrizione, badge) arriva dal
// database, stesso pattern del Filetto alla Rossini su "La carne"
// (vedi PiattoIcona in page.tsx): la pagina non può descrivere un
// drink diverso da quello servito. Le altre sezioni di questo file
// restano bozza fino a una correzione separata.
//
// Gli altri drink citati in pagina (sezione "selezione") arrivano dal
// database, uno per categoria diversa (vedi src/lib/selezione-bar.ts).
// Elencarli a mano avrebbe rischiato di riprodurre il difetto già
// corretto in home (§18): quattro varianti quasi identiche della
// stessa cosa.
//
// Nessuna affermazione operativa non verificabile: gli orari sono
// unici per il locale, non separati fra cucina e bancone, quindi qui
// non si dice che "il bar apre prima e chiude dopo".
// =============================================================

const it = {
  hero: {
    occhiello: "Cocktail & Bar",
    titolo: "Una serata intera, allo stesso bancone.",
    sottotitolo:
      "Aperitivo, cena, dopocena: tre momenti diversi e un solo posto. Non devi spostarti a metà serata.",
  },
  filo: {
    titolo: "Il bar non è il dopo",
    paragrafi: [
      "In molti locali il bancone è un'anticamera: serve a farti aspettare il tavolo. Qui è il contrario — è il filo che tiene insieme la serata.",
      "Si comincia con qualcosa di secco e sveglio prima di sedersi. Si continua con un drink che regge la brace invece di spegnerla. Si chiude con un amaro, un distillato o un ultimo cocktail che non ha fretta.",
      "Qualità, gusto e libertà senza compromessi vale anche qui: nessuno deve spiegarti che dopo l'antipasto si beve soltanto vino.",
    ],
  },
  selezione: {
    occhiello: "Dal bancone",
    titolo: "Qualche esempio di cosa trovi adesso",
    testo:
      "La carta cambia. Questi arrivano direttamente dal menu di oggi, presi da parti diverse del bancone.",
  },
  analcolici: {
    titolo: "Analcolico non vuol dire di ripiego",
    paragrafi: [
      "Chi guida, chi quella sera non beve, chi semplicemente non ne ha voglia: merita qualcosa di costruito, non una bibita versata nel bicchiere.",
      "Gli analcolici hanno una loro parte della carta e la stessa cura degli altri. Stessa attenzione alle proporzioni, stessi bicchieri, stesso tempo.",
    ],
  },
  icona: {
    occhiello: "Il drink icona",
    titolo: "Cocktail Vizio",
    testo:
      "Se dovessimo scegliere un solo drink per raccontare il bancone, sarebbe questo. Porta il nome del locale, con la stessa cura di ogni altro cocktail in carta.",
  },
  chiusura: {
    titolo: "Il bancone è lì.",
    testo: "Guarda cosa c'è in carta, oppure tieni il posto per stasera.",
  },
};

type CopyCocktailBar = typeof it;

const en: CopyCocktailBar = {
  hero: {
    occhiello: "Cocktails & Bar",
    titolo: "A whole evening, at the same bar.",
    sottotitolo:
      "Aperitivo, dinner, after dinner: three different moments and one place. No need to move halfway through the night.",
  },
  filo: {
    titolo: "The bar isn't an afterthought",
    paragrafi: [
      "In a lot of places the bar is a waiting room: somewhere to stand until your table is ready. Here it's the opposite — it's the thread that holds the evening together.",
      "You start with something dry and wide awake before sitting down. You carry on with a drink that stands up to the grill instead of putting it out. You finish with an amaro, a spirit, or one last cocktail that isn't in a hurry.",
      "Quality, flavour and freedom without compromise applies here too: nobody needs to tell you that after the starter you only drink wine.",
    ],
  },
  selezione: {
    occhiello: "From the bar",
    titolo: "A few examples of what's pouring now",
    testo:
      "The list changes. These come straight from today's menu, picked from different corners of the bar.",
  },
  analcolici: {
    titolo: "Alcohol-free isn't second best",
    paragrafi: [
      "Whoever is driving, whoever isn't drinking tonight, whoever simply doesn't feel like it: they deserve something built, not a soft drink poured into a glass.",
      "Alcohol-free drinks have their own part of the list and the same care as the rest. Same attention to proportions, same glassware, same time.",
    ],
  },
  icona: {
    occhiello: "The signature drink",
    titolo: "Cocktail Vizio",
    testo:
      "If we had to pick one drink to sum up the bar, this would be it. It carries the name of the restaurant, with the same care as every other cocktail on the list.",
  },
  chiusura: {
    titolo: "The bar is right there.",
    testo: "Have a look at the list, or hold a spot for tonight.",
  },
};

const COPY: Record<Locale, CopyCocktailBar> = { it, en };

export function getCopyCocktailBar(locale: Locale): CopyCocktailBar {
  return COPY[locale];
}
