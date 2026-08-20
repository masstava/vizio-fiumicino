"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import type { Locale } from "@/src/lib/i18n/config";
import { FeaturedDishSlide, type FeaturedDish } from "./FeaturedDishSlide";

// Slider con puntini per 2-3 piatti in evidenza. Nessuna libreria di
// carosello: con al massimo 3 elementi basta mostrare/nascondere la
// slide attiva, senza scroll-snap o gesture — più semplice, nessun
// impatto sulle performance.
export function FeaturedDishesSlider({
  dishes,
  locale,
}: {
  dishes: FeaturedDish[];
  locale: Locale;
}) {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <FeaturedDishSlide dish={dishes[index]} locale={locale} />
      <div className="mt-8 flex justify-center gap-2">
        {dishes.map((dish, i) => (
          <button
            key={dish.id}
            type="button"
            aria-label={`${locale === "en" ? "Go to dish" : "Vai al piatto"} ${i + 1}/${dishes.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-colors duration-150",
              i === index ? "bg-gold" : "bg-cream-text/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}
