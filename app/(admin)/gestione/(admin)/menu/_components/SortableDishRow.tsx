"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/src/lib/utils";
import { AdminDishRow } from "./AdminDishRow";
import type { PiattoListItem } from "./types";

interface SortableDishRowProps {
  dish: PiattoListItem;
  onDelete: () => void;
}

export function SortableDishRow({ dish, onDelete }: SortableDishRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dish.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : undefined,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-stretch bg-admin-surface hover:bg-admin-canvas transition-colors"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Riordina ${dish.nome}`}
        className={cn(
          // Sotto md la maniglia arriva a 44px di larghezza: è già
          // alta quanto la riga, ma a 30px il dito la mancava e il
          // riordino su telefono era di fatto impossibile.
          "flex-shrink-0 flex items-center justify-center min-w-11 px-2 text-admin-text-2 hover:text-admin-text md:pointer-fine:min-w-0 md:pointer-fine:justify-start",
          // touch-manipulation (non touch-none): uno swipe rapido deve
          // scorrere la pagina come sul resto della riga; il drag parte
          // solo dopo la pressione prolungata del TouchSensor.
          "cursor-grab active:cursor-grabbing touch-manipulation select-none",
          // Anello come gli altri controlli della dashboard; inset perché
          // la maniglia è a filo del bordo della riga.
          "focus-visible:outline-none focus-visible:text-admin-brick focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-brick/60",
        )}
      >
        <DragHandleIcon />
      </button>
      <div className="flex-1 min-w-0">
        <AdminDishRow dish={dish} onDelete={onDelete} />
      </div>
    </div>
  );
}

function DragHandleIcon() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
      <circle cx="4" cy="4" r="1.6" fill="currentColor" />
      <circle cx="10" cy="4" r="1.6" fill="currentColor" />
      <circle cx="4" cy="11" r="1.6" fill="currentColor" />
      <circle cx="10" cy="11" r="1.6" fill="currentColor" />
      <circle cx="4" cy="18" r="1.6" fill="currentColor" />
      <circle cx="10" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}
