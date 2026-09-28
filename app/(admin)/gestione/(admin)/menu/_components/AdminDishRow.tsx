"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { DishRow } from "@/src/components/ui/DishRow";
import { StatusToggle } from "@/src/components/admin/StatusToggle";
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
    // hover: leggero cambio di sfondo — § Tabelle/liste in
    // DASHBOARD_DESIGN_SYSTEM.md. Il bordo tra righe non è più qui:
    // lo dà il divide-y del pannello che le contiene tutte.
    //
    // [&_div:has(>h3)]:flex-wrap — nella lista admin (maniglia di
    // riordino + miniatura) a 380px non c'è spazio per nome e prezzo
    // affiancati: il nome non scende sotto la sua parola più lunga e il
    // prezzo veniva tagliato dal bordo ("18,00€ / hg" → "18,00€ /").
    // Qui il prezzo va a capo SOLO quando non ci sta; DishRow resta
    // intatto per il sito pubblico (§ Tabelle/liste dense).
    <div className="px-4 hover:bg-admin-canvas transition-colors [&_div:has(>h3)]:flex-wrap [&_div:has(>h3)]:gap-y-1">
      <DishRow dish={dish} tone="light" className="border-b-0 py-3" />
      {/* pl-24 allinea le azioni sotto la colonna di testo della
          DishRow (miniatura 80px + gap). A 380px però quei 96px
          spingevano "Elimina" oltre il bordo destro, rendendolo
          intoccabile: sotto sm l'allineamento salta e il gruppo va a
          capo se serve. */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-3 sm:flex-nowrap sm:pl-24">
        <StatusToggle
          checked={disponibile}
          onChange={handleToggle}
          disabled={isPending}
          tonoOn="verde"
          testoOn="Disponibile"
          tonoOff="grigio"
          testoOff="Esaurito"
        />
        <div className="flex items-center gap-4">
          <Link
            href={`/gestione/menu/${dish.id}`}
            className="inline-flex min-h-11 items-center font-sans text-sm text-admin-brick hover:opacity-70 transition-opacity md:pointer-fine:min-h-0"
          >
            Modifica
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-11 items-center font-sans text-sm text-admin-text-2 hover:text-admin-brick transition-colors md:pointer-fine:min-h-0"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
