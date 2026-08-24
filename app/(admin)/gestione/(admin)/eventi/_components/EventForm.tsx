"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { Switch } from "@/src/components/ui/Switch";
import { saveEvento } from "../_actions";

interface EventFormInitialData {
  titolo: string;
  titolo_en: string;
  descrizione: string;
  descrizione_en: string;
  data_evento: string;
  attivo: boolean;
}

interface EventFormProps {
  mode: "create" | "edit";
  eventoId?: string;
  initialData?: EventFormInitialData;
}

const inputClass =
  "w-full min-h-11 md:min-h-0 bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink placeholder:text-muted/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 focus-visible:border-bordeaux/50";

export function EventForm({ mode, eventoId, initialData }: EventFormProps) {
  const router = useRouter();

  const [titolo, setTitolo] = useState(initialData?.titolo ?? "");
  const [titoloEn, setTitoloEn] = useState(initialData?.titolo_en ?? "");
  const [descrizione, setDescrizione] = useState(
    initialData?.descrizione ?? "",
  );
  const [descrizioneEn, setDescrizioneEn] = useState(
    initialData?.descrizione_en ?? "",
  );
  const [dataEvento, setDataEvento] = useState(
    initialData?.data_evento ?? "",
  );
  const [attivo, setAttivo] = useState(initialData?.attivo ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!titolo.trim()) {
      setError("Il titolo è obbligatorio.");
      return;
    }

    setSaving(true);
    try {
      await saveEvento({
        id: eventoId ?? null,
        titolo: titolo.trim(),
        titolo_en: titoloEn.trim() || null,
        descrizione: descrizione.trim() || null,
        descrizione_en: descrizioneEn.trim() || null,
        data_evento: dataEvento || null,
        attivo,
      });

      router.push("/gestione/eventi");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio.",
      );
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={mode === "create" ? "Nuovo evento" : "Modifica evento"}
      className="max-w-xl space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Titolo (IT)">
          <input
            className={inputClass}
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
          />
        </Field>
        <Field label="Titolo (EN)">
          <input
            className={inputClass}
            value={titoloEn}
            onChange={(e) => setTitoloEn(e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Descrizione (IT)">
          <textarea
            className={inputClass}
            rows={4}
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
          />
        </Field>
        <Field label="Descrizione (EN)">
          <textarea
            className={inputClass}
            rows={4}
            value={descrizioneEn}
            onChange={(e) => setDescrizioneEn(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Data evento">
        <input
          type="date"
          className={inputClass}
          value={dataEvento}
          onChange={(e) => setDataEvento(e.target.value)}
        />
        <p className="font-sans text-xs text-muted mt-1.5">
          Lascia vuoto per eventi ricorrenti (es. &quot;Menu Experience&quot;).
        </p>
      </Field>

      <Field label="Stato">
        <Switch
          checked={attivo}
          onChange={setAttivo}
          label={attivo ? "Attivo" : "Non attivo"}
        />
      </Field>

      {error && <p className="font-sans text-sm text-bordeaux">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Salvataggio…" : "Salva evento"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/gestione/eventi")}
          className="inline-flex min-h-11 items-center px-1 font-sans text-sm text-muted hover:text-ink transition-colors md:min-h-0 md:px-0"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
