"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { GRUPPI_CONTENUTI } from "@/src/lib/contenuti";
import { saveContenuti } from "../_actions";

const inputClass =
  "w-full min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text placeholder:text-admin-text-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

// Solo campi di testo etichettati in italiano: nessuna chiave
// tecnica a schermo, nessun editor di layout, nessun drag-and-drop.
// La struttura della home resta nel codice — qui si cambiano le
// parole, non l'impianto.
export function ContenutiForm({
  initialValori,
  initialValoriEn,
}: {
  initialValori: Record<string, string>;
  initialValoriEn: Record<string, string>;
}) {
  const [valori, setValori] = useState<Record<string, string>>(initialValori);
  const [valoriEn, setValoriEn] = useState<Record<string, string>>(initialValoriEn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function update(chiave: string, valore: string) {
    setJustSaved(false);
    setValori((prev) => ({ ...prev, [chiave]: valore }));
  }

  function updateEn(chiave: string, valore: string) {
    setJustSaved(false);
    setValoriEn((prev) => ({ ...prev, [chiave]: valore }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveContenuti(valori, valoriEn);
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
          className="mb-10 pb-8 border-b border-admin-line"
        >
          <h2 className="font-serif text-xl font-medium text-admin-text mb-1">
            {gruppo.titolo}
          </h2>
          {gruppo.descrizione && (
            <p className="font-sans text-sm text-admin-text-2 mb-5">
              {gruppo.descrizione}
            </p>
          )}

          <div className="space-y-5">
            {gruppo.campi.map((campo) => (
              <div key={campo.chiave} className="flex flex-col gap-1.5">
                <label
                  htmlFor={campo.chiave}
                  className="font-sans text-xs font-medium text-admin-text"
                >
                  {campo.etichetta}
                </label>
                {campo.aiuto && (
                  <p className="font-sans text-xs text-admin-text-2">{campo.aiuto}</p>
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
                  <p className="font-sans text-xs text-admin-text-3">
                    Se lasci vuoto, il sito mostra il testo attuale.
                  </p>
                )}

                {/* Versione inglese, mostrata sotto quella italiana:
                    il sito in EN la usa se compilata, altrimenti
                    ricade sull'italiano qui sopra. Un campo può
                    restare vuoto senza rompere nulla. */}
                <div className="mt-1 flex items-start gap-2">
                  <span className="mt-2 font-sans text-[10px] font-medium tracking-widest text-admin-text-2">
                    EN
                  </span>
                  {campo.lungo ? (
                    <textarea
                      id={`${campo.chiave}-en`}
                      aria-label={`${campo.etichetta} — inglese`}
                      rows={2}
                      value={valoriEn[campo.chiave] ?? ""}
                      onChange={(e) => updateEn(campo.chiave, e.target.value)}
                      placeholder={campo.fallbackEn || campo.fallback}
                      className={cn(inputClass, "resize-y")}
                    />
                  ) : (
                    <input
                      id={`${campo.chiave}-en`}
                      aria-label={`${campo.etichetta} — inglese`}
                      type="text"
                      value={valoriEn[campo.chiave] ?? ""}
                      onChange={(e) => updateEn(campo.chiave, e.target.value)}
                      placeholder={campo.fallbackEn || campo.fallback}
                      className={inputClass}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {error && <p className="font-sans text-sm text-admin-brick mb-4">{error}</p>}

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
          <span className="font-sans text-sm text-admin-text-2">Testi salvati.</span>
        )}
      </div>
    </div>
  );
}
