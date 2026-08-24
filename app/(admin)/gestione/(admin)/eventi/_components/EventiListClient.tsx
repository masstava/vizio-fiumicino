"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Switch } from "@/src/components/ui/Switch";
import { toggleAttivo, deleteEvento } from "../_actions";
import { formatDataEvento } from "./formatDate";

export interface EventoListItem {
  id: string;
  titolo: string;
  data_evento: string | null;
  attivo: boolean;
}

interface EventiListClientProps {
  eventi: EventoListItem[];
}

export function EventiListClient({ eventi: initialEventi }: EventiListClientProps) {
  const [eventi, setEventi] = useState(initialEventi);

  async function handleDelete(id: string, titolo: string) {
    if (
      !window.confirm(
        `Eliminare l'evento "${titolo}"? L'operazione non è reversibile.`,
      )
    ) {
      return;
    }

    const previous = eventi;
    setEventi((prev) => prev.filter((e) => e.id !== id));

    try {
      await deleteEvento(id);
    } catch (err) {
      setEventi(previous);
      console.error(err);
      window.alert("Errore durante l'eliminazione. Riprova.");
    }
  }

  if (eventi.length === 0) {
    return (
      <p className="font-sans text-sm text-muted">
        Nessun evento ancora. Usa &quot;+ Aggiungi evento&quot; per iniziare.
      </p>
    );
  }

  return (
    <div>
      {eventi.map((evento) => (
        <EventoRow
          key={evento.id}
          evento={evento}
          onDelete={() => handleDelete(evento.id, evento.titolo)}
        />
      ))}
    </div>
  );
}

function EventoRow({
  evento,
  onDelete,
}: {
  evento: EventoListItem;
  onDelete: () => void;
}) {
  const [attivo, setAttivo] = useState(evento.attivo);
  const [isPending, startTransition] = useTransition();

  function handleToggle(next: boolean) {
    setAttivo(next);
    startTransition(async () => {
      try {
        await toggleAttivo(evento.id, next);
      } catch (err) {
        setAttivo(!next);
        console.error(err);
      }
    });
  }

  const dataLabel = formatDataEvento(evento.data_evento);

  // Sotto sm la riga diventa una scheda impilata: titolo su tutta la
  // larghezza, azioni sotto. In riga unica a 380px il titolo si
  // riduceva a un'ottantina di pixel e veniva troncato quasi sempre —
  // anche quelli corti — quindi non si capiva quale evento si stesse
  // per modificare o eliminare. Da sm in su resta la riga di prima.
  return (
    <div className="flex flex-col gap-3 py-4 border-b border-ink/10 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="font-serif text-lg font-medium text-ink sm:truncate">
          {evento.titolo}
        </p>
        <p className="font-sans text-sm text-muted mt-0.5">
          {dataLabel ?? "Ricorrente — nessuna data"}
        </p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <Switch
          checked={attivo}
          onChange={handleToggle}
          disabled={isPending}
          label={attivo ? "Attivo" : "Non attivo"}
        />
        <Link
          href={`/gestione/eventi/${evento.id}`}
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
  );
}
