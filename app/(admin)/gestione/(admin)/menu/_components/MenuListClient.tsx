"use client";

import { useEffect, useState } from "react";
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
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import { AccordionSection } from "./AccordionSection";
import { AdminDishRow } from "./AdminDishRow";
import { SortableDishRow } from "./SortableDishRow";
import { MenuFilters } from "./MenuFilters";
import { slugify } from "./slugify";
import { deletePiatto, reorderPiatti } from "../_actions";
import type { MacroGroup, PiattoListItem } from "./types";

const fieldClass =
  "min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

interface MenuListClientProps {
  groups: MacroGroup[];
}

function macroKey(id: string) {
  return `m:${id}`;
}

function categoriaKey(id: string) {
  return `c:${id}`;
}

export function MenuListClient({ groups: initialGroups }: MenuListClientProps) {
  const [groups, setGroups] = useState(initialGroups);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();

  // Stato di navigazione locale (non persistito): tutto collassato di
  // default. Contiene le chiavi delle sezioni aperte, sia perché
  // l'utente ha cliccato sull'intestazione sia perché un filtro/la
  // ricerca le ha espanse automaticamente.
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const isSearching = search.trim().length >= 2;
  const searchLower = search.trim().toLowerCase();
  const macroSlug = searchParams.get("macro") ?? "all";
  const categoriaSlug = searchParams.get("categoria") ?? "all";

  // Espansione automatica: solo additiva (non richiude mai nulla da
  // sola) così un click manuale dell'utente, una volta forzata
  // l'apertura, resta sempre rispettato fino al prossimo cambio di
  // filtro/ricerca.
  useEffect(() => {
    setOpenSections((prev) => {
      const next = new Set(prev);

      if (isSearching) {
        groups.forEach((macro) => {
          macro.categorie.forEach((cat) => {
            const hasMatch = cat.piatti.some((p) =>
              p.nome.toLowerCase().includes(searchLower),
            );
            if (hasMatch) {
              next.add(categoriaKey(cat.id));
              next.add(macroKey(macro.id));
            }
          });
        });
        return next;
      }

      if (macroSlug !== "all") {
        const macro = groups.find((m) => slugify(m.nome) === macroSlug);
        if (macro) {
          next.add(macroKey(macro.id));
          // Solo il filtro macro è attivo (nessuna categoria specifica
          // selezionata): espande tutte le sue categorie, così l'intero
          // sottoinsieme filtrato è visibile senza altri click.
          if (categoriaSlug === "all") {
            macro.categorie.forEach((cat) => next.add(categoriaKey(cat.id)));
          }
        }
      }

      if (categoriaSlug !== "all") {
        groups.forEach((macro) => {
          const cat = macro.categorie.find((c) => slugify(c.nome) === categoriaSlug);
          if (cat) {
            next.add(categoriaKey(cat.id));
            next.add(macroKey(macro.id));
          }
        });
      }

      return next;
    });
  }, [groups, isSearching, searchLower, macroSlug, categoriaSlug]);

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

  // Ricerca nella topbar (§ Topbar in DASHBOARD_DESIGN_SYSTEM.md): lo
  // stato resta qui (dove viveva anche prima), solo l'input appare
  // altrove nel DOM via portale — nessuna logica di filtro cambiata.
  const searchSlot = (
    <TopbarSlot order={1}>
      <label htmlFor="menu-search" className="sr-only">
        Cerca piatto
      </label>
      <input
        id="menu-search"
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca per nome…"
        className={`${fieldClass} w-56`}
      />
    </TopbarSlot>
  );

  if (!hasVisibleDish) {
    return (
      <div>
        {searchSlot}
        <MenuFilters groups={groups} />
        <p className="font-sans text-sm text-muted">
          Nessun piatto trovato con i filtri attuali.
        </p>
      </div>
    );
  }

  return (
    <div>
      {searchSlot}
      <MenuFilters groups={groups} />

      <div className="space-y-10">
        {visibleGroups.map((macro) => {
          const macroHasDishes = macro.categorie.some((c) => c.piatti.length > 0);
          if (!macroHasDishes) return null;

          return (
            <AccordionSection
              key={macro.id}
              open={openSections.has(macroKey(macro.id))}
              onToggle={() => toggleSection(macroKey(macro.id))}
              headerClassName="mb-4 pb-2 border-b border-ink/15"
              header={
                <h2 className="font-serif text-xl font-medium text-ink">{macro.nome}</h2>
              }
            >
              <div className="space-y-6 pt-1">
                {macro.categorie.map((cat) => {
                  if (cat.piatti.length === 0) return null;

                  return (
                    <AccordionSection
                      key={cat.id}
                      open={openSections.has(categoriaKey(cat.id))}
                      onToggle={() => toggleSection(categoriaKey(cat.id))}
                      headerClassName="mb-1"
                      header={
                        <p className="font-sans text-[10px] tracking-widest uppercase text-muted">
                          {cat.nome} ({cat.piatti.length})
                        </p>
                      }
                    >
                      {isSearching ? (
                        <div className="divide-y divide-admin-line overflow-hidden rounded-[2px] border border-admin-line bg-admin-surface">
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
                          // id deterministico (dall'id della categoria,
                          // uguale lato server e lato client): senza,
                          // dnd-kit assegna l'id "aria-describedby" del
                          // draggable con un contatore in memoria di
                          // modulo, diverso tra il render SSR e quello
                          // del browser — un mismatch di hydration.
                          id={`menu-dnd-${cat.id}`}
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
                            <div className="divide-y divide-admin-line overflow-hidden rounded-[2px] border border-admin-line bg-admin-surface">
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
                    </AccordionSection>
                  );
                })}
              </div>
            </AccordionSection>
          );
        })}
      </div>
    </div>
  );
}
