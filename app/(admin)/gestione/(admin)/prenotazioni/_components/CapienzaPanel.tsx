"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { salvaCapienzaGiorno } from "../_actions";

const inputClass =
  "min-h-11 sm:min-h-0 w-24 sm:w-28 flex-shrink-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-1.5 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

interface CapienzaPanelProps {
  data: string;
  /** Fasce prenotabili quel giorno, dagli orari reali del locale. */
  fasce: string[];
  /** Solo le fasce con un tetto già impostato. */
  limitiEsistenti: Record<string, number>;
  /** Coperti già occupati per fascia (confermate + completate). */
  occupati: Record<string, number>;
}

export function CapienzaPanel({
  data,
  fasce,
  limitiEsistenti,
  occupati,
}: CapienzaPanelProps) {
  const [valori, setValori] = useState<Record<string, string>>(() => {
    const iniziale: Record<string, string> = {};
    fasce.forEach((f) => {
      iniziale[f] = limitiEsistenti[f] != null ? String(limitiEsistenti[f]) : "";
    });
    return iniziale;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function updateValore(fascia: string, value: string) {
    setJustSaved(false);
    setValori((prev) => ({ ...prev, [fascia]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await salvaCapienzaGiorno(
        data,
        fasce.map((f) => ({
          fascia: f,
          limiteCoperti: valori[f]?.trim() ? Number(valori[f]) : null,
        })),
      );
      setJustSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (fasce.length === 0) {
    return (
      <p className="font-sans text-sm text-admin-text-2">
        Il locale è chiuso questo giorno — nessuna fascia da configurare.
      </p>
    );
  }

  return (
    <div>
      <p className="font-sans text-xs text-admin-text-2 mb-4 max-w-2xl">
        Lascia vuoto per nessun tetto (sempre disponibile). Un numero limita i
        coperti prenotabili per quella fascia — lo stesso limite verificato
        dal form pubblico.
      </p>

      <div className="max-w-md divide-y divide-admin-line overflow-hidden rounded-[2px] border border-admin-line bg-admin-surface">
        {fasce.map((fascia) => {
          const limite = valori[fascia]?.trim() ? Number(valori[fascia]) : null;
          const occ = occupati[fascia] ?? 0;
          return (
            // Impilato su mobile: fascia+input su una riga, l'esito di
            // capienza sotto. In riga unica a 380px il testo "X/Y
            // occupati — Z residui" non aveva più spazio dopo l'input
            // (che a sua volta non aveva un limite di larghezza sotto
            // sm) e finiva a sbordare fuori dallo schermo. Da sm in su
            // torna la riga singola di prima.
            <div
              key={fascia}
              className="flex flex-col gap-1 px-4 py-2.5 hover:bg-admin-canvas transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-admin-text w-16 flex-shrink-0">
                  {fascia}
                </span>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="Nessuno"
                  value={valori[fascia] ?? ""}
                  onChange={(e) => updateValore(fascia, e.target.value)}
                  className={inputClass}
                />
              </div>
              {limite != null && (
                <span className="font-sans text-xs text-admin-text-2 pl-[80px] sm:flex-1 sm:pl-0 sm:text-right">
                  {occ}/{limite} occupati
                  {occ >= limite ? " — pieno" : ` — ${limite - occ} residui`}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="font-sans text-sm text-admin-brick mt-4">{error}</p>}

      <div className="flex items-center gap-4 mt-6">
        <Button type="button" variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvataggio…" : "Salva capienza"}
        </Button>
        {justSaved && (
          <span className="font-sans text-sm text-admin-text-2">Capienza salvata.</span>
        )}
      </div>
    </div>
  );
}
