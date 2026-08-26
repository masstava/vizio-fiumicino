"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { Switch } from "@/src/components/ui/Switch";
import { saveEvento, type CampoExtraInput } from "../_actions";

const MASSIMO_CAMPI_EXTRA = 3;

interface EventFormInitialData {
  titolo: string;
  titolo_en: string;
  descrizione: string;
  descrizione_en: string;
  data_evento: string;
  attivo: boolean;
  campiExtra: CampoExtraInput[];
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
  const [campiExtra, setCampiExtra] = useState<CampoExtraInput[]>(
    initialData?.campiExtra ?? [],
  );
  const [campiExtraBloccato, setCampiExtraBloccato] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function aggiungiCampoExtra() {
    if (campiExtra.length >= MASSIMO_CAMPI_EXTRA) {
      setCampiExtraBloccato(true);
      return;
    }
    setCampiExtraBloccato(false);
    setCampiExtra((prev) => [...prev, { etichetta: "" }]);
  }

  function aggiornaCampoExtra(index: number, etichetta: string) {
    setCampiExtra((prev) =>
      prev.map((c, i) => (i === index ? { ...c, etichetta } : c)),
    );
  }

  function rimuoviCampoExtra(index: number) {
    setCampiExtraBloccato(false);
    setCampiExtra((prev) => prev.filter((_, i) => i !== index));
  }

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
        // Etichette vuote scartate lato funzione (save_evento), stesso
        // trattamento dei badge vuoti in save_piatto: qui si manda
        // tutto quello che c'è, non serve filtrarlo prima.
        campiExtra: campiExtra.map((c) => ({ etichetta: c.etichetta.trim() })),
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

      <Field label="Campi extra nel form di prenotazione">
        <p className="font-sans text-xs text-muted mb-2">
          Domande in più mostrate solo a chi prenota per questo evento (es.
          &quot;Occasione speciale&quot;). Massimo {MASSIMO_CAMPI_EXTRA}.
        </p>
        <div className="space-y-2">
          {campiExtra.map((campo, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border-l-2 border-ink/10 pl-3 sm:border-l-0 sm:pl-0"
            >
              <input
                className={inputClass}
                placeholder="Es. Occasione speciale"
                value={campo.etichetta}
                onChange={(e) => aggiornaCampoExtra(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => rimuoviCampoExtra(index)}
                className="inline-flex min-h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-[2px] font-sans text-lg leading-none text-muted hover:text-bordeaux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 sm:min-h-0"
                aria-label="Rimuovi campo extra"
              >
                ×
              </button>
            </div>
          ))}
          {campiExtraBloccato && (
            <p className="font-sans text-xs text-cream-text bg-bordeaux border border-bordeaux inline-block px-2.5 py-1 rounded-[2px]">
              Massimo {MASSIMO_CAMPI_EXTRA} campi extra. Rimuovine uno prima di
              aggiungerne un altro.
            </p>
          )}
          <button
            type="button"
            onClick={aggiungiCampoExtra}
            className="inline-flex min-h-11 items-center rounded-[2px] font-sans text-sm text-bordeaux hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 md:min-h-0"
          >
            + Aggiungi campo extra
          </button>
        </div>
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
