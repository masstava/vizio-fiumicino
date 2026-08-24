"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DishRow } from "@/src/components/ui/DishRow";
import { Switch } from "@/src/components/ui/Switch";
import { toggleDisponibile } from "../_actions";
import type { PiattoListItem } from "./types";

interface AdminDishRowProps {
  dish: PiattoListItem;
  onDelete: () => void;
}

export function AdminDishRow({ dish, onDelete }: AdminDishRowProps) {
  const [disponibile, setDisponibile] = useState(dish.disponibile);
  const [isPending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    setDisponibile(next);
    startTransition(async () => {
      try {
        await toggleDisponibile(dish.id, next);
      } catch (err) {
        setDisponibile(!next);
        console.error(err);
      }
    });
  }

  return (
    <div className="border-b border-ink/10">
      <DishRow dish={dish} tone="light" className="border-b-0 pb-3" />
      {/* pl-24 allinea le azioni sotto la colonna di testo della
          DishRow (miniatura 80px + gap). A 380px però quei 96px
          spingevano "Elimina" oltre il bordo destro, rendendolo
          intoccabile: sotto sm l'allineamento salta e il gruppo va a
          capo se serve. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-4 sm:flex-nowrap sm:pl-24">
        <Switch
          checked={disponibile}
          onChange={handleToggle}
          disabled={isPending}
          label={disponibile ? "Disponibile" : "Esaurito"}
        />
        <div className="flex items-center gap-4">
          <Link
            href={`/gestione/menu/${dish.id}`}
            className="inline-flex min-h-11 items-center font-sans text-sm text-bordeaux hover:opacity-70 transition-opacity md:min-h-0"
          >
            Modifica
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-11 items-center font-sans text-sm text-muted hover:text-bordeaux transition-colors md:min-h-0"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
