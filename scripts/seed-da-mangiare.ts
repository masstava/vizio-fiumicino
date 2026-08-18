/**
 * Seeding una tantum dei piatti reali della macro-categoria "Da mangiare".
 *
 * Usa la service_role key di Supabase (bypassa le RLS) — MAI committarla,
 * MAI usarla lato client. Va passata solo come variabile d'ambiente
 * al momento dell'esecuzione:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     npx tsx scripts/seed-da-mangiare.ts
 *
 * Script pensato per essere eseguito UNA VOLTA e poi eliminato dal
 * repository (non deve restare come codice permanente).
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY nelle variabili d'ambiente.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

interface SeedPiatto {
  nome: string;
  descrizione: string | null;
  prezzo: number;
  prezzo_variabile?: boolean;
  allergeni?: number[];
  badges?: string[];
}

interface SeedCategoria {
  categoriaNome: string;
  piatti: SeedPiatto[];
}

const DATA: SeedCategoria[] = [
  {
    categoriaNome: "Aperitivo",
    piatti: [
      {
        nome: "AperiSpritz",
        descrizione: "Cocktail a scelta accompagnato da chips homemade e fritto a scelta",
        prezzo: 13.0,
      },
      {
        nome: "AperiVizio",
        descrizione:
          "Cocktail, calice o bevanda a scelta, accompagnato da un tagliere con varie specialità selezionate dallo chef (salumi di alta qualità, formaggi ricercati, fritti croccanti)",
        prezzo: 14.9,
      },
      {
        nome: "All You Can Drink (solo il Giovedì)",
        descrizione:
          "Cocktail, calice o bevanda a scelta, accompagnato da un tagliere con varie specialità selezionate dallo chef (salumi di alta qualità, formaggi ricercati, fritti croccanti)",
        prezzo: 19.9,
      },
      {
        nome: "Vegetariano",
        descrizione:
          "Cocktail, calice o bevanda a scelta, accompagnato da un tagliere con varie specialità dallo chef (verdure, formaggi ricercati, fritti croccanti)",
        prezzo: 19.9,
      },
      {
        nome: "Norcineria",
        descrizione:
          "Deliziosi salumi e formaggi di alta qualità e fritti selezionati dallo chef accompagnati da cocktail, calice o bevanda a scelta",
        prezzo: 22.9,
      },
    ],
  },
  {
    categoriaNome: "Fritti",
    piatti: [
      {
        nome: "Supplì di zucchine",
        descrizione: "Due supplì da circa 50gr l'uno con zucchine, fiori di zucca e provola affumicata",
        prezzo: 6.0,
        allergeni: [8, 10, 14],
      },
      {
        nome: "Supplì di pollo alla cacciatora",
        descrizione: "Due supplì da circa 50gr l'uno con pollo alla cacciatora",
        prezzo: 6.0,
        allergeni: [8, 10, 14],
      },
      {
        nome: "Supplì Genovese",
        descrizione: "Due supplì da circa 50gr l'uno",
        prezzo: 6.0,
        allergeni: [8, 10, 14],
      },
      {
        nome: "Chips alla romana",
        descrizione: "Chips insaporite cacio e pepe",
        prezzo: 6.0,
        allergeni: [8, 14],
      },
      {
        nome: "Patatine Steak House",
        descrizione: "Patatine taglio Steak House",
        prezzo: 6.0,
        allergeni: [8],
      },
      {
        nome: "Stick di Pollo",
        descrizione: "Croccanti stick di pollo panati e fritti",
        prezzo: 6.0,
        allergeni: [3, 8, 10],
      },
      {
        nome: "Polpette di Bollito",
        descrizione: "Morbide e croccanti polpette fritte di bollito",
        prezzo: 8.0,
        allergeni: [3, 8, 10],
      },
    ],
  },
  {
    categoriaNome: "Pinse",
    piatti: [
      { nome: "Focaccia", descrizione: null, prezzo: 5.0, allergeni: [] },
      {
        nome: "Pinsa con Prosciutto e Bufala",
        descrizione: null,
        prezzo: 14.0,
        allergeni: [8, 14],
      },
      {
        nome: "Pinsa con Caponata Siciliana, bufala e basilico",
        descrizione: null,
        prezzo: 10.0,
        allergeni: [8, 14],
      },
    ],
  },
  {
    categoriaNome: "Special",
    piatti: [
      {
        nome: "Pasta dello Chef",
        descrizione: null,
        prezzo: 15.0,
        allergeni: [8, 10, 14],
      },
    ],
  },
  {
    categoriaNome: "Vizi Caldi",
    piatti: [
      {
        nome: "Crostini con Chevre Chaud",
        descrizione: "Due crostini di pane con formaggio crudo di capra accompagnato da miele e mosto d'uva",
        prezzo: 5.0,
        allergeni: [8, 14],
      },
      {
        nome: "Soufflè con ricotta di pecora",
        descrizione: "Souffle con ricotta di pecora, crema di piselli e asparagi",
        prezzo: 10.0,
        allergeni: [14],
      },
      {
        nome: "Spuma di Bufala",
        descrizione: "Spuma di bufala con crumble di pomodori secchi, datterino, pomodoro confit, olio e basilico",
        prezzo: 10.0,
        allergeni: [8, 10],
      },
      {
        nome: "Terrina di carne",
        descrizione: "Terrina di carne tiepida con pistacchi e senape antica",
        prezzo: 13.0,
        allergeni: [1],
      },
    ],
  },
  {
    categoriaNome: "Burger",
    piatti: [
      {
        nome: "Classic Burger",
        descrizione: "Manzo, original cheddar, senape, pomodoro, insalata",
        prezzo: 12.9,
        allergeni: [3, 8, 10, 14],
      },
      {
        nome: "Chicken Burger",
        descrizione: "Burger con sovracoscio di pollo cotto cbt e fritto con mayo e cipolla caramellata",
        prezzo: 15.0,
        allergeni: [3, 8, 10, 14],
      },
      {
        nome: "Il Vizioso",
        descrizione: "Panino con stracotto di guancia di manzo da 200g, cotta per 7 ore guarnito con insalata coleslaw",
        prezzo: 18.0,
        allergeni: [2, 3, 8, 10, 14],
      },
      {
        nome: "Pulled Pork",
        descrizione: "Panino con pulled pork e cavolo cappuccio rosso marinato",
        prezzo: 17.0,
        allergeni: [2, 3, 8, 10],
      },
    ],
  },
  {
    categoriaNome: "Taglieri",
    piatti: [
      {
        nome: "Selezione Salumi",
        descrizione: "5 salumi di alta qualità selezionati dallo chef",
        prezzo: 17.0,
        allergeni: [3, 5, 8, 14],
      },
      {
        nome: "Tagliere di prosciutto al coltello",
        descrizione: "100g di prosciutto selezionato tagliato al coltello",
        prezzo: 17.0,
        allergeni: [],
      },
      {
        nome: "Selezione Formaggi",
        descrizione: "5 formaggi di alta qualità selezionati dallo chef",
        prezzo: 17.0,
        allergeni: [], // NOTA (dal committente): probabilmente manca "7 — Latte", da verificare manualmente
      },
      {
        nome: "Tagliere misto",
        descrizione: "Tagliere con due salumi, due formaggi, un fritto e una composta",
        prezzo: 17.0,
        allergeni: [3, 5, 8, 10, 14],
      },
      {
        nome: "Tagliere Patanegra",
        descrizione: "70g di prosciutto patanegra a coltello",
        prezzo: 19.0,
        allergeni: [],
      },
      {
        nome: "Gran Selezione",
        descrizione: "Deliziosi salumi e formaggi di alta qualità e fritti selezionati dallo chef",
        prezzo: 25.0,
        allergeni: [],
      },
    ],
  },
  {
    categoriaNome: "Crudi",
    piatti: [
      {
        nome: "Tartare di Chianina",
        descrizione: "Tartare di Chianina di osso con midollo, mayo alla rucola e scalogno croccante",
        prezzo: 17.0,
      },
      {
        nome: "Tartare di Fassona",
        descrizione: "Tartare di fassona da 80 gr circa con sfera di tartufo, tuorlo marinato e germogli freschi",
        prezzo: 13.0,
      },
      {
        nome: "Tartare di Black Angus",
        descrizione: "Tartare di Black Angus di circa 80 g con stracciatella e pomodori confit",
        prezzo: 14.0,
      },
      {
        nome: "Tartare di bisonte",
        descrizione: "Delicata tartare di bisonte da 50 g circa condita con olio evo e fiocchi di sale",
        prezzo: 18.0,
      },
      {
        nome: "Carpaccio di manzo",
        descrizione: "Tenero e saporito carpaccio di manzo da 100 con salsa tonnata e fior di capperi",
        prezzo: 17.0,
      },
      {
        nome: "Carpaccio al tartufo",
        descrizione: "Tenero manzo e petali di tartufo, con misticanza",
        prezzo: 18.0,
      },
      {
        nome: "Tartare Experience",
        descrizione:
          "Tre deliziose tartare di Chianina, Fassona e Black Angus (240 gr in totale), accompagnate da un cocktail a scelta Flower, Gin Sea, Negroni",
        prezzo: 49.0,
      },
    ],
  },
  {
    categoriaNome: "Carne",
    piatti: [
      {
        nome: "Tagliata di Chianina",
        descrizione: "Tagliata di chianina condita con olio evo e fiocchi di sale, con contorno",
        prezzo: 19.9,
      },
      {
        nome: "Tagliata di Black Angus",
        descrizione:
          "Deliziosa tagliata di Black Angus da 300g, dal gusto deciso, condita con olio e fiocchi di sale. Con contorno a scelta",
        prezzo: 25.0,
      },
      {
        nome: "Tagliata di Pollo",
        descrizione: "Deliziosa tagliata di Pollo da circa 300g, cotto in CBT. Con contorno a scelta",
        prezzo: 18.0,
      },
      {
        nome: "Picanha",
        descrizione: "300g circa sottofesa di manzo condita con olio evo e fiocchi di sale accompagnato da contorno",
        prezzo: 29.0,
      },
      {
        nome: "Costata di manzo",
        descrizione: "Costata di manzo peso variabile",
        prezzo: 8.0,
        prezzo_variabile: true,
      },
      {
        nome: "Fiorentina",
        descrizione: "Taglio fiorentina peso variabile",
        prezzo: 10.0,
        prezzo_variabile: true,
      },
      {
        nome: "Filetto Classic",
        descrizione: "Filetto di Black Angus condito con olio evo e fiocchi di sale, accompagnato da contorno",
        prezzo: 34.0,
      },
      {
        nome: "Ribs di maiale aromatizzate BBQ e spezie",
        descrizione: "Ribs di maiale taglio ST LOUIS cotto cbt aromatizzate in salsa BBQ",
        prezzo: 26.0,
      },
      {
        nome: "Maialino con BBQ di carote",
        descrizione: "Tenero maialino in salsa bbq di carote, ananas caramellata e bietolina salata",
        prezzo: 27.0,
      },
      {
        nome: "Petto di anatra",
        descrizione: "Petto di anatra con prugna susina e agretti",
        prezzo: 27.0,
      },
      {
        nome: "Guancia di manzo",
        descrizione: "Guancia di manzo CBT condita con spuma di crema di sedano rapa, zafferano",
        prezzo: 33.0,
      },
      {
        nome: "Filetto alla Rossini",
        descrizione:
          "Tenero e gustoso filetto di Black Angus da 300g circa con foie gras e tartufo fresco adagiato su pan brioche fatto in casa",
        prezzo: 40.0,
        badges: ["Il nostro classico"],
      },
    ],
  },
  {
    categoriaNome: "Contorni",
    piatti: [
      {
        nome: "Patata al forno",
        descrizione: "Patata al forno aromatizzata al rosmarino",
        prezzo: 5.0,
      },
      {
        nome: "Verdure di stagione",
        descrizione: "Verdura di stagione ripassata o agro",
        prezzo: 5.0,
      },
      {
        nome: "Verdura griglia",
        descrizione: "Verdure cotte in griglia",
        prezzo: 5.0,
      },
    ],
  },
  {
    categoriaNome: "Dolci",
    piatti: [
      {
        nome: "Crostata",
        descrizione: "Chiedere al cameriere il gusto disponibile",
        prezzo: 6.0,
        allergeni: [1, 8, 10, 14],
      },
      {
        nome: "Cheesecake",
        descrizione: "Chiedere al cameriere il gusto disponibile",
        prezzo: 6.0,
        allergeni: [1, 8, 10, 14],
      },
      {
        nome: "Tiramisù",
        descrizione: "Classico",
        prezzo: 6.0,
        allergeni: [1, 8, 10, 14],
      },
      {
        nome: "Dolce dello chef",
        descrizione: "Creme Brulè, Fava Tonka, Gelato Fior di Latte",
        prezzo: 6.0,
        allergeni: [1, 8, 10, 14],
      },
      {
        nome: "Dolce Artigianale",
        descrizione: null,
        prezzo: 6.0,
        allergeni: [1, 8, 10, 14],
      },
    ],
  },
];

async function main() {
  const { data: macro, error: macroErr } = await supabase
    .from("categorie_macro")
    .select("id")
    .eq("nome", "Da mangiare")
    .maybeSingle();

  if (macroErr || !macro) {
    throw new Error(`Macro-categoria "Da mangiare" non trovata: ${macroErr?.message ?? "nessun risultato"}`);
  }

  const { data: categorieRows, error: catErr } = await supabase
    .from("categorie")
    .select("id, nome")
    .eq("categoria_macro_id", macro.id);

  if (catErr) throw new Error(catErr.message);

  const categoriaIdByNome = new Map<string, string>();
  (categorieRows ?? []).forEach((c) => categoriaIdByNome.set(c.nome, c.id));

  const counts: Record<string, number> = {};

  for (const cat of DATA) {
    const categoriaId = categoriaIdByNome.get(cat.categoriaNome);
    counts[cat.categoriaNome] = 0;

    if (!categoriaId) {
      console.error(
        `⚠️  Categoria non trovata: "${cat.categoriaNome}" — salto i suoi ${cat.piatti.length} piatti.`,
      );
      continue;
    }

    for (let i = 0; i < cat.piatti.length; i++) {
      const piatto = cat.piatti[i];

      const { data: inserted, error: insertErr } = await supabase
        .from("piatti")
        .insert({
          categoria_id: categoriaId,
          nome: piatto.nome,
          descrizione: piatto.descrizione,
          prezzo: piatto.prezzo,
          prezzo_variabile: piatto.prezzo_variabile ?? false,
          disponibile: true,
          foto_url: null,
          ordine: i,
        })
        .select("id")
        .single();

      if (insertErr || !inserted) {
        console.error(
          `❌ Errore inserendo "${piatto.nome}" (${cat.categoriaNome}): ${insertErr?.message}`,
        );
        continue;
      }

      const piattoId = inserted.id as string;

      if (piatto.allergeni && piatto.allergeni.length > 0) {
        const { error: allergErr } = await supabase.from("piatti_allergeni").insert(
          piatto.allergeni.map((allergeneId) => ({
            piatto_id: piattoId,
            allergene_id: allergeneId,
          })),
        );
        if (allergErr) {
          console.error(`  ⚠️  Allergeni non salvati per "${piatto.nome}": ${allergErr.message}`);
        }
      }

      if (piatto.badges && piatto.badges.length > 0) {
        const { error: badgeErr } = await supabase.from("badge").insert(
          piatto.badges.map((testo) => ({ piatto_id: piattoId, testo })),
        );
        if (badgeErr) {
          console.error(`  ⚠️  Badge non salvato per "${piatto.nome}": ${badgeErr.message}`);
        }
      }

      counts[cat.categoriaNome]++;
      console.log(`✓ ${cat.categoriaNome} — ${piatto.nome}`);
    }
  }

  console.log('\n=== Riepilogo seeding "Da mangiare" ===');
  let total = 0;
  for (const cat of DATA) {
    const n = counts[cat.categoriaNome] ?? 0;
    total += n;
    console.log(`${cat.categoriaNome}: ${n}/${cat.piatti.length}`);
  }
  console.log(`TOTALE: ${total} piatti inseriti`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
