"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { GRUPPI_CONTENUTI } from "@/src/lib/contenuti";
import { saveContenuti } from "../_actions";

const inputClass =
  "w-full bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-bordeaux/50 transition-colors";

// Solo campi di testo etichettati in italiano: nessuna chiave
// tecnica a schermo, nessun editor di layout, nessun drag-and-drop.
// La struttura della home resta nel codice — qui si cambiano le
// parole, non l'impianto.
export function ContenutiForm({
  initialValori,
}: {
  initialValori: Record<string, string>;
}) {
  const [valori, setValori] = useState<Record<string, string>>(initialValori);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function update(chiave: string, valore: string) {
    setJustSaved(false);
    setValori((prev) => ({ ...prev, [chiave]: valore }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveContenuti(valori);
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
      {GRUPPI_CONTENUTI.map((gruppo) => (
        <section
          key={gruppo.titolo}
          className="mb-10 pb-8 border-b border-ink/10"
        >
          <h2 className="font-serif text-xl font-medium text-ink mb-1">
            {gruppo.titolo}
          </h2>
          {gruppo.descrizione && (
            <p className="font-sans text-sm text-muted mb-5">
              {gruppo.descrizione}
            </p>
          )}

          <div className="space-y-5">
            {gruppo.campi.map((campo) => (
              <div key={campo.chiave} className="flex flex-col gap-1.5">
                <label
                  htmlFor={campo.chiave}
                  className="font-sans text-xs font-medium text-ink"
                >
                  {campo.etichetta}
                </label>
                {campo.aiuto && (
                  <p className="font-sans text-xs text-muted">{campo.aiuto}</p>
                )}
                {campo.lungo ? (
                  <textarea
                    id={campo.chiave}
                    rows={3}
                    value={valori[campo.chiave] ?? ""}
                    onChange={(e) => update(campo.chiave, e.target.value)}
                    placeholder={campo.fallback}
                    className={cn(inputClass, "resize-y")}
                  />
                ) : (
                  <input
                    id={campo.chiave}
                    type="text"
                    value={valori[campo.chiave] ?? ""}
                    onChange={(e) => update(campo.chiave, e.target.value)}
                    placeholder={campo.fallback}
                    className={inputClass}
                  />
                )}
                {campo.fallback && (
                  <p className="font-sans text-xs text-muted/80">
                    Se lasci vuoto, il sito mostra il testo attuale.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {error && <p className="font-sans text-sm text-bordeaux mb-4">{error}</p>}

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvataggio…" : "Salva testi"}
        </Button>
        {justSaved && (
          <span className="font-sans text-sm text-muted">Testi salvati.</span>
        )}
      </div>
    </div>
  );
}
