"use client";

import { useState } from "react";
import { AdminDishRow } from "./AdminDishRow";
import { deletePiatto } from "../_actions";
import type { MacroGroup } from "./types";

interface MenuListClientProps {
  groups: MacroGroup[];
}

export function MenuListClient({ groups: initialGroups }: MenuListClientProps) {
  const [groups, setGroups] = useState(initialGroups);

  function removeLocally(piattoId: string) {
    setGroups((prev) =>
      prev.map((macro) => ({
        ...macro,
        categorie: macro.categorie.map((cat) => ({
          ...cat,
          piatti: cat.piatti.filter((p) => p.id !== piattoId),
        })),
      })),
    );
  }

  async function handleDelete(piattoId: string, nome: string) {
    if (!window.confirm(`Eliminare "${nome}"? L'operazione non è reversibile.`)) {
      return;
    }

    const previousGroups = groups;
    removeLocally(piattoId);

    try {
      await deletePiatto(piattoId);
    } catch (err) {
      setGroups(previousGroups);
      console.error(err);
      window.alert("Errore durante l'eliminazione. Riprova.");
    }
  }

  const hasAnyDish = groups.some((m) =>
    m.categorie.some((c) => c.piatti.length > 0),
  );

  if (!hasAnyDish) {
    return (
      <p className="font-sans text-sm text-muted">
        Nessun piatto ancora. Usa &quot;+ Aggiungi piatto&quot; per iniziare.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {groups.map((macro) => {
        const macroHasDishes = macro.categorie.some((c) => c.piatti.length > 0);
        if (!macroHasDishes) return null;

        return (
          <div key={macro.id}>
            <h2 className="font-serif text-xl font-medium text-ink mb-4 pb-2 border-b border-ink/15">
              {macro.nome}
            </h2>
            <div className="space-y-6">
              {macro.categorie.map((cat) => {
                if (cat.piatti.length === 0) return null;

                return (
                  <div key={cat.id}>
                    <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-1">
                      {cat.nome}
                    </p>
                    <div>
                      {cat.piatti.map((dish) => (
                        <AdminDishRow
                          key={dish.id}
                          dish={dish}
                          onDelete={() => handleDelete(dish.id, dish.nome)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
