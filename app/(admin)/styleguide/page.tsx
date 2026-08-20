import { Section } from "@/src/components/ui/Section";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import { PriceTag } from "@/src/components/ui/PriceTag";
import { AllergenCodes } from "@/src/components/ui/AllergenCodes";
import { DishRow } from "@/src/components/ui/DishRow";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import type { PiattoRiga } from "@/src/lib/dominio";

const DISHES_LIGHT: PiattoRiga[] = [
  {
    id: "dish-001",
    nome: "Tagliata di Manzo",
    descrizione:
      "Frisona italiana, rucola selvatica, grana padano 24 mesi, aceto balsamico di Modena",
    prezzo: 24.0,
    prezzo_variabile: false,
    foto_url: null,
    allergeni: [3, 7, 12],
    badges: ["Signature", "Stagionale"],
  },
  {
    id: "dish-002",
    nome: "Crudo di Spigola",
    descrizione:
      "Spigola del Mediterraneo, limone di Amalfi, bottarga di muggine, olio EVO Sicilia",
    prezzo: 18.5,
    prezzo_variabile: false,
    foto_url: null,
    allergeni: [4, 14],
    badges: ["Crudo"],
  },
  {
    id: "dish-003",
    nome: "Tagliere Misto",
    descrizione: "Selezione di salumi stagionati e formaggi del Lazio",
    prezzo: 8.0,
    prezzo_variabile: true,
    foto_url: null,
    allergeni: [1, 7],
    badges: [],
  },
];

const DISHES_DARK: PiattoRiga[] = [
  {
    id: "dish-004",
    nome: "Negroni Sbagliato",
    descrizione: "Campari, vermouth rosso, Prosecco, scorza d'arancia",
    prezzo: 12.0,
    prezzo_variabile: false,
    foto_url: null,
    allergeni: [],
    badges: ["House Cocktail"],
  },
  {
    id: "dish-005",
    nome: "Experience Omakase",
    descrizione:
      "Un percorso di 7 portate a mani del nostro chef — il menù cambia ogni settimana",
    prezzo: 75.0,
    prezzo_variabile: false,
    foto_url: null,
    allergeni: [1, 2, 3, 4, 7, 8, 12, 14],
    badges: ["Experience", "Solo su prenotazione"],
  },
];

const PALETTE = [
  { token: "ink", hex: "#1a1a1a", label: "Ink", bg: "bg-ink", dark: true },
  { token: "cream", hex: "#f7f2e9", label: "Cream", bg: "bg-cream", dark: false },
  { token: "dark", hex: "#0a0705", label: "Dark", bg: "bg-dark", dark: true },
  { token: "bordeaux", hex: "#8b1a1a", label: "Bordeaux", bg: "bg-bordeaux", dark: true },
  { token: "gold", hex: "#d9a05b", label: "Gold", bg: "bg-gold", dark: false },
  { token: "cream-text", hex: "#f5efe4", label: "Cream Text", bg: "bg-cream-text", dark: false },
  { token: "muted", hex: "#5f5e5a", label: "Muted", bg: "bg-muted", dark: true },
  { token: "muted-dark", hex: "#d8c7b0", label: "Muted Dark", bg: "bg-muted-dark", dark: false },
];

const PLACEHOLDER_SEEDS = [
  "antipasto",
  "primo",
  "secondo",
  "dolce",
  "vino",
  "cocktail",
];

export default function StyleguidePage() {
  return (
    <div>
      {/* Header */}
      <Section tone="dark">
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-muted-dark mb-3">
          Design System
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-medium text-cream-text">
          Vizio Bistrot
        </h1>
        <p className="font-sans text-base text-muted-dark mt-2">
          Fiumicino — styleguide interna, non pubblicata
        </p>
      </Section>

      {/* ── PALETTE ── */}
      <Section tone="light">
        <h2 className="font-serif text-2xl font-medium text-ink mb-6">
          Palette colori
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PALETTE.map((c) => (
            <div key={c.token}>
              <div
                className={`${c.bg} h-14 rounded-[2px] border border-ink/10`}
              />
              <p className="font-sans text-xs font-medium text-ink mt-1.5">
                {c.label}
              </p>
              <p className="font-sans text-[10px] text-muted">{c.hex}</p>
              <p className="font-sans text-[10px] text-muted font-mono">
                --color-{c.token}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── TIPOGRAFIA ── */}
      <Section tone="light" className="border-t border-ink/10">
        <h2 className="font-serif text-2xl font-medium text-ink mb-8">
          Tipografia
        </h2>

        <div className="space-y-8">
          {/* Fraunces */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
              Fraunces — font-serif
            </p>
            <div className="space-y-2">
              <p className="font-serif font-medium text-6xl text-ink leading-none">
                Aa
              </p>
              <p className="font-serif text-4xl text-ink">
                Da mangiare
              </p>
              <p className="font-serif text-2xl text-ink">
                Carne · Crudi · Taglieri
              </p>
              <p className="font-serif text-xl italic text-muted">
                Cucina di territorio, con un&apos;anima
              </p>
            </div>
          </div>

          {/* Inter */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
              Inter — font-sans
            </p>
            <div className="space-y-1.5">
              <p className="font-sans text-base font-normal text-ink">
                Testo normale — Spigola del Mediterraneo, limone di Amalfi,
                bottarga di muggine
              </p>
              <p className="font-sans text-base font-medium text-ink">
                Testo medium — Cucina di territorio con ingredienti selezionati
              </p>
              <p className="font-sans text-base font-semibold text-ink">
                Testo semibold — Vizio Bistrot, Fiumicino
              </p>
              <p className="font-sans text-sm text-muted">
                Testo piccolo muted — descrizioni, dettagli secondari
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-muted">
                Label uppercase — Antipasti · Primi · Secondi
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── COMPONENTI SU CHIARO ── */}
      <Section tone="light">
        <h2 className="font-serif text-2xl font-medium text-ink mb-6">
          Componenti — sfondo chiaro
        </h2>

        <div className="space-y-8">
          {/* Bottoni */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
              Button
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Prenota un tavolo</Button>
              <Button variant="primary" disabled>
                Non disponibile
              </Button>
            </div>
            <p className="font-sans text-xs text-muted mt-2">
              <code className="font-mono">variant=&quot;primary&quot;</code> —
              bordeaux su cream-text
            </p>
          </div>

          {/* Badge */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
              Badge — variant light
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="light">Signature</Badge>
              <Badge variant="light">Stagionale</Badge>
              <Badge variant="light">Crudo</Badge>
              <Badge variant="light">Senza glutine</Badge>
              <Badge variant="light">House Cocktail</Badge>
            </div>
          </div>

          {/* PriceTag */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
              PriceTag
            </p>
            <div className="flex flex-wrap gap-6">
              <PriceTag price={24.0} tone="light" />
              <PriceTag price={8.5} variable={true} tone="light" />
              <PriceTag price={125.0} tone="light" />
            </div>
          </div>

          {/* AllergenCodes */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
              AllergenCodes
            </p>
            <div className="flex flex-col gap-1.5">
              <AllergenCodes codes={[1, 3, 7]} tone="light" />
              <AllergenCodes codes={[2, 4, 8, 10, 14]} tone="light" />
              <AllergenCodes codes={[]} tone="light" />
            </div>
            <p className="font-sans text-xs text-muted mt-2">
              Valori 1–14 secondo il Reg. UE 1169/2011
            </p>
          </div>
        </div>
      </Section>

      {/* ── COMPONENTI SU SCURO ── */}
      <Section tone="dark">
        <h2 className="font-serif text-2xl font-medium text-cream-text mb-6">
          Componenti — sfondo scuro
        </h2>

        <div className="space-y-8">
          {/* Bottoni */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted-dark mb-3">
              Button
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Scopri l&apos;experience</Button>
              <Button variant="outline" disabled>
                Esaurito
              </Button>
            </div>
            <p className="font-sans text-xs text-muted-dark mt-2">
              <code className="font-mono">variant=&quot;outline&quot;</code> —
              bordo e testo cream-text, sfondo trasparente
            </p>
          </div>

          {/* Badge */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted-dark mb-3">
              Badge — variant dark
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="dark">Experience</Badge>
              <Badge variant="dark">Solo su prenotazione</Badge>
              <Badge variant="dark">House Cocktail</Badge>
            </div>
          </div>

          {/* PriceTag */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted-dark mb-3">
              PriceTag — tone dark
            </p>
            <div className="flex flex-wrap gap-6">
              <PriceTag price={75.0} tone="dark" />
              <PriceTag price={12.5} tone="dark" />
            </div>
          </div>

          {/* AllergenCodes */}
          <div>
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted-dark mb-3">
              AllergenCodes — tone dark
            </p>
            <AllergenCodes codes={[1, 2, 3, 4, 7, 8, 12, 14]} tone="dark" />
          </div>
        </div>
      </Section>

      {/* ── DISH ROW SU CHIARO ── */}
      <Section tone="light">
        <h2 className="font-serif text-2xl font-medium text-ink mb-2">
          DishRow — sfondo chiaro
        </h2>
        <p className="font-sans text-sm text-muted mb-6">
          Riga piatto con placeholder, badge, allergeni, prezzo
        </p>
        <div>
          {DISHES_LIGHT.map((dish) => (
            <DishRow key={dish.id} dish={dish} tone="light" />
          ))}
        </div>
      </Section>

      {/* ── DISH ROW SU SCURO ── */}
      <Section tone="dark">
        <h2 className="font-serif text-2xl font-medium text-cream-text mb-2">
          DishRow — sfondo scuro
        </h2>
        <p className="font-sans text-sm text-muted-dark mb-6">
          Stesso componente, prop <code className="font-mono text-gold">tone=&quot;dark&quot;</code>
        </p>
        <div>
          {DISHES_DARK.map((dish) => (
            <DishRow key={dish.id} dish={dish} tone="dark" />
          ))}
        </div>
      </Section>

      {/* ── IMAGE PLACEHOLDERS ── */}
      <Section tone="light">
        <h2 className="font-serif text-2xl font-medium text-ink mb-2">
          ImagePlaceholder
        </h2>
        <p className="font-sans text-sm text-muted mb-6">
          Gradiente deterministico basato su seed — lo stesso ID produce sempre
          lo stesso colore
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {PLACEHOLDER_SEEDS.map((seed) => (
            <div key={seed}>
              <ImagePlaceholder seed={seed} aspectRatio="1 / 1" />
              <p className="font-sans text-[10px] text-muted mt-1 text-center font-mono">
                &quot;{seed}&quot;
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {PLACEHOLDER_SEEDS.slice(0, 4).map((seed) => (
            <ImagePlaceholder key={seed} seed={`wide-${seed}`} aspectRatio="4 / 3" />
          ))}
        </div>
      </Section>

      {/* ── PREVIEW MOBILE 380px ── */}
      <Section tone="light">
        <h2 className="font-serif text-2xl font-medium text-ink mb-2">
          Preview mobile — 380px
        </h2>
        <p className="font-sans text-sm text-muted mb-8">
          Contenitore fisso a 380px per verificare la resa su smartphone
          senza ridimensionare la finestra.
        </p>

        {/* Cornice device */}
        <div className="mx-auto w-[380px] max-w-full border border-ink/20 rounded-[2px] overflow-hidden shadow-sm">

          {/* Sezione chiara */}
          <div className="bg-cream px-5 py-5">
            <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted mb-4">
              Componenti — sfondo chiaro
            </p>
            <div className="mb-4">
              <Button variant="primary">Prenota un tavolo</Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="light">Signature</Badge>
              <Badge variant="light">Stagionale</Badge>
              <Badge variant="light">Senza glutine</Badge>
            </div>
            <div className="flex gap-6 mb-3">
              <PriceTag price={24.0} tone="light" />
              <PriceTag price={8.5} variable={true} tone="light" />
            </div>
            <AllergenCodes codes={[1, 3, 7, 12]} tone="light" />
          </div>

          {/* DishRow su chiaro — badge multipli */}
          <div className="bg-cream px-5">
            <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted py-3 border-t border-ink/10">
              DishRow con badge multipli
            </p>
            {DISHES_LIGHT.map((dish) => (
              <DishRow key={`mob-${dish.id}`} dish={dish} tone="light" />
            ))}
          </div>

          {/* Sezione scura */}
          <div className="bg-dark px-5 py-5">
            <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted-dark mb-4">
              Componenti — sfondo scuro
            </p>
            <div className="mb-4">
              <Button variant="outline">Scopri l&apos;experience</Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="dark">Experience</Badge>
              <Badge variant="dark">Solo su prenotazione</Badge>
            </div>
            {DISHES_DARK.map((dish) => (
              <DishRow key={`mob-${dish.id}`} dish={dish} tone="dark" />
            ))}
          </div>

        </div>
      </Section>

      {/* Footer */}
      <Section tone="dark">
        <p className="font-sans text-xs text-muted-dark text-center">
          Styleguide interna — Vizio Bistrot · Fiumicino
        </p>
      </Section>
    </div>
  );
}
