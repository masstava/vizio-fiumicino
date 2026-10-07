"use client";

import { useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { cn } from "@/src/lib/utils";
import type { Locale } from "@/src/lib/i18n/config";
import type { PiattoAnteprima } from "@/src/lib/dominio";
import { FeaturedDishSlide } from "./FeaturedDishSlide";

// Slider con puntini per 2-3 piatti in evidenza. Nessuna libreria di
// carosello: con al massimo 3 elementi basta mostrare/nascondere la
// slide attiva, senza scroll-snap o gesture — più semplice, nessun
// impatto sulle performance.
//
// Il cambio slide è una dissolvenza incrociata. Le due slide occupano
// la STESSA cella di una griglia invece di essere posizionate in
// assoluto: così il contenitore mantiene l'altezza del contenuto e
// durante la transizione non c'è alcun salto di layout.
export function FeaturedDishesSlider({
  dishes,
  locale,
}: {
  dishes: PiattoAnteprima[];
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);
  const riduciMovimento = useReducedMotion();

  return (
    <div>
      <div className="grid">
        <AnimatePresence mode="sync" initial={false}>
          <m.div
            key={dishes[index].id}
            style={{ gridArea: "1 / 1" }}
            initial={riduciMovimento ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: riduciMovimento ? 0 : 0.35,
              ease: "easeOut",
            }}
          >
            <FeaturedDishSlide dish={dishes[index]} locale={locale} />
          </m.div>
        </AnimatePresence>
      </div>
      {/* Il pallino resta di 8px, ma il pulsante che lo contiene è
          44x44 (target di tap del DoD; prima il bersaglio era il
          pallino stesso, 8x8). Unica differenza visibile: i pallini
          sono a 44px di passo invece di 16, perché due bersagli da 44
          non possono stare più vicini senza sovrapporsi. I margini
          compensano l'altezza in più: sopra e sotto lo spazio resta
          quello di prima (32px sopra il pallino, nulla sotto). */}
      <div className="mt-[14px] -mb-[18px] flex justify-center">
        {dishes.map((dish, i) => (
          <button
            key={dish.id}
            type="button"
            aria-label={`${locale === "en" ? "Go to dish" : "Vai al piatto"} ${i + 1}/${dishes.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none"
          >
            <span
              aria-hidden="true"
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-150 group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-dark",
                i === index ? "bg-gold" : "bg-cream-text/30",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
