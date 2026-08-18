"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AdminDishRow } from "./AdminDishRow";
import { SortableDishRow } from "./SortableDishRow";
import { MenuFilters } from "./MenuFilters";
import { slugify } from "./slugify";
import { deletePiatto, reorderPiatti } from "../_actions";
import type { MacroGroup, PiattoListItem } from "./types";

interface MenuListClientProps {
  groups: MacroGroup[];
}

export function MenuListClient({ groups: initialGroups }: MenuListClientProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  const sensors = useSensors(
    // Mouse/trackpad: una piccola soglia di distanza evita che un
    // semplice click sui pulsanti della riga venga scambiato per drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    // Touch: un breve delay lascia lo scroll naturale della pagina
    // funzionare; solo una pressione prolungata sulla maniglia avvia
    // il trascinamento.
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  function setCategoriaPiatti(categoriaId: string, piatti: PiattoListItem[]) {
    setGroups((prev) =>
      prev.map((macro) => ({
        ...macro,
        categorie: macro.categorie.map((cat) =>
          cat.id === categoriaId ? { ...cat, piatti } : cat,
        ),
      })),
    );
  }

  async function handleDragEnd(
    categoriaId: string,
    piatti: PiattoListItem[],
    event: DragEndEvent,
  ) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = piatti.findIndex((p) => p.id === active.id);
    const newIndex = piatti.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(piatti, oldIndex, newIndex);

    // Ottimistico: l'ordine visivo cambia subito, senza aspettare il server.
    setCategoriaPiatti(categoriaId, reordered);

    try {
      await reorderPiatti(
        categoriaId,
        reordered.map((p, index) => ({ id: p.id, ordine: index })),
      );
    } catch (err) {
      setCategoriaPiatti(categoriaId, piatti); // rollback all'ordine precedente
      console.error(err);
      window.alert("Errore durante il riordino. Riprova.");
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

  const isSearching = search.trim().length >= 2;
  const searchLower = search.trim().toLowerCase();

  const macroSlug = searchParams.get("macro") ?? "all";
  const categoriaSlug = searchParams.get("categoria") ?? "all";

  // Ricerca attiva: ignora i filtri select, cerca su tutto il menu,
  // nessun drag-and-drop (la vista mescola piatti di categorie diverse).
  // Filtri select attivi: mostra solo le macro/categorie selezionate,
  // ogni categoria visibile mantiene l'intera lista e il drag-and-drop.
  const visibleGroups = groups
    .filter((macro) => isSearching || macroSlug === "all" || slugify(macro.nome) === macroSlug)
    .map((macro) => ({
      ...macro,
      categorie: macro.categorie
        .filter(
          (cat) =>
            isSearching || categoriaSlug === "all" || slugify(cat.nome) === categoriaSlug,
        )
        .map((cat) => ({
          ...cat,
          piatti: isSearching
            ? cat.piatti.filter((p) => p.nome.toLowerCase().includes(searchLower))
            : cat.piatti,
        })),
    }));

  const hasVisibleDish = visibleGroups.some((m) =>
    m.categorie.some((c) => c.piatti.length > 0),
  );

  if (!hasVisibleDish) {
    return (
      <div>
        <MenuFilters groups={groups} search={search} onSearchChange={setSearch} />
        <p className="font-sans text-sm text-muted">
          Nessun piatto trovato con i filtri attuali.
        </p>
      </div>
    );
  }

  return (
    <div>
      <MenuFilters groups={groups} search={search} onSearchChange={setSearch} />

      <div className="space-y-10">
        {visibleGroups.map((macro) => {
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
                        {cat.nome} ({cat.piatti.length})
                      </p>

                      {isSearching ? (
                        <div>
                          {cat.piatti.map((dish) => (
                            <AdminDishRow
                              key={dish.id}
                              dish={dish}
                              onDelete={() => handleDelete(dish.id, dish.nome)}
                            />
                          ))}
                        </div>
                      ) : (
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragEnd={(event) =>
                            handleDragEnd(cat.id, cat.piatti, event)
                          }
                        >
                          <SortableContext
                            items={cat.piatti.map((p) => p.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            <div>
                              {cat.piatti.map((dish) => (
                                <SortableDishRow
                                  key={dish.id}
                                  dish={dish}
                                  onDelete={() => handleDelete(dish.id, dish.nome)}
                                />
                              ))}
                            </div>
                          </SortableContext>
                        </DndContext>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
