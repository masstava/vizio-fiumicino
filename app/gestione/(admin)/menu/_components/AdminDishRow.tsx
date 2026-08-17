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
      <div className="flex items-center justify-between gap-4 pb-4 pl-24">
        <Switch
          checked={disponibile}
          onChange={handleToggle}
          disabled={isPending}
          label={disponibile ? "Disponibile" : "Esaurito"}
        />
        <div className="flex items-center gap-4">
          <Link
            href={`/gestione/menu/${dish.id}`}
            className="font-sans text-sm text-bordeaux hover:opacity-70 transition-opacity"
          >
            Modifica
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="font-sans text-sm text-muted hover:text-bordeaux transition-colors"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
