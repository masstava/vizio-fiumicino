"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { saveOrariConfig } from "../_actions";

const inputClass =
  "bg-cream border border-ink/20 rounded-[2px] px-3 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-bordeaux/50 transition-colors";

interface OrariNotaFormProps {
  initialNota: string | null;
  initialValidaFinoAl: string | null;
  /** Calcolata lato server: la data di validità è già passata. */
  scaduta: boolean;
}

// Nota facoltativa per orari temporanei/stagionali + data di
// validità. Nessun automatismo sui dati: alla scadenza la dashboard
// mostra solo un avviso, gli orari restano quelli inseriti.
export function OrariNotaForm({
  initialNota,
  initialValidaFinoAl,
  scaduta,
}: OrariNotaFormProps) {
  const [nota, setNota] = useState(initialNota ?? "");
  const [validaFinoAl, setValidaFinoAl] = useState(initialValidaFinoAl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveOrariConfig({
        nota: nota.trim() || null,
        valida_fino_al: validaFinoAl || null,
      });
      setJustSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 font-serif text-xl font-medium text-ink">
        Orari temporanei
      </h2>
      <p className="mb-5 font-sans text-sm text-muted">
        Se gli orari qui sopra sono stagionali, scrivilo qui: la nota compare
        sul sito accanto agli orari. La data di validità serve solo come
        promemoria in questa pagina — non modifica gli orari da sola.
      </p>

      {scaduta && (
        <p className="mb-5 rounded-[2px] border border-bordeaux/40 bg-bordeaux/5 px-3 py-2 font-sans text-sm text-bordeaux">
          Gli orari temporanei sono scaduti, verificali.
        </p>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="orari-nota" className="font-sans text-xs text-muted">
            Nota (mostrata sul sito)
          </label>
          <input
            id="orari-nota"
            type="text"
            value={nota}
            onChange={(e) => {
              setJustSaved(false);
              setNota(e.target.value);
            }}
            placeholder="Es. Orario estivo fino al 31 agosto"
            className={cn(inputClass, "w-full")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="orari-valida" className="font-sans text-xs text-muted">
            Valida fino al (solo promemoria interno)
          </label>
          <input
            id="orari-valida"
            type="date"
            value={validaFinoAl}
            onChange={(e) => {
              setJustSaved(false);
              setValidaFinoAl(e.target.value);
            }}
            className={cn(inputClass, "w-48")}
          />
        </div>
      </div>

      {error && <p className="mt-4 font-sans text-sm text-bordeaux">{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvataggio…" : "Salva nota"}
        </Button>
        {justSaved && (
          <span className="font-sans text-sm text-muted">Nota salvata.</span>
        )}
      </div>
    </div>
  );
}
