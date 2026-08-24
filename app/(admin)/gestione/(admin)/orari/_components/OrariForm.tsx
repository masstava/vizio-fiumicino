"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { Switch } from "@/src/components/ui/Switch";
import { saveOrari, type FasciaInput } from "../_actions";
import { formatOrariPreview } from "./formatPreview";
import type { OrarioGiornoRow } from "./types";

interface FasciaState {
  key: string;
  apertura: string;
  chiusura: string;
}

interface DayState {
  giorno_settimana: number;
  nome: string;
  chiuso: boolean;
  fasce: FasciaState[];
}

function toInputTime(value: string | null): string {
  return value ? value.slice(0, 5) : "";
}

function buildInitialDays(initialOrari: OrarioGiornoRow[]): DayState[] {
  return initialOrari.map((day) => {
    const validFasce = day.fasce.filter((f) => f.apertura && f.chiusura);
    const chiuso = validFasce.length === 0;

    return {
      giorno_settimana: day.giorno_settimana,
      nome: day.nome,
      chiuso,
      fasce: chiuso
        ? [{ key: day.fasce[0]?.id ?? crypto.randomUUID(), apertura: "", chiusura: "" }]
        : validFasce.map((f) => ({
            key: f.id,
            apertura: toInputTime(f.apertura),
            chiusura: toInputTime(f.chiusura),
          })),
    };
  });
}

// min-h-11 solo sotto sm: su telefono i campi vanno centrati col
// dito. Da sm in su la densità del prospetto settimanale resta quella
// di prima — qui si guardano sette giorni insieme, e allargare le
// righe renderebbe l'insieme meno leggibile.
const inputClass =
  "min-h-11 sm:min-h-0 bg-cream border border-ink/20 rounded-[2px] px-3 py-1.5 font-sans text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 focus-visible:border-bordeaux/50 disabled:opacity-40";

export function OrariForm({ initialOrari }: { initialOrari: OrarioGiornoRow[] }) {
  const [days, setDays] = useState<DayState[]>(() => buildInitialDays(initialOrari));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function updateDay(dayIndex: number, patch: Partial<DayState>) {
    setJustSaved(false);
    setDays((prev) => prev.map((d, i) => (i === dayIndex ? { ...d, ...patch } : d)));
  }

  function updateFascia(
    dayIndex: number,
    fasciaIndex: number,
    patch: Partial<FasciaState>,
  ) {
    setJustSaved(false);
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              fasce: d.fasce.map((f, fi) =>
                fi === fasciaIndex ? { ...f, ...patch } : f,
              ),
            }
          : d,
      ),
    );
  }

  function addFascia(dayIndex: number) {
    setJustSaved(false);
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              fasce: [
                ...d.fasce,
                { key: crypto.randomUUID(), apertura: "", chiusura: "" },
              ],
            }
          : d,
      ),
    );
  }

  function applyToAllDays(sourceDayIndex: number) {
    setJustSaved(false);
    setDays((prev) => {
      const source = prev[sourceDayIndex];
      return prev.map((d) =>
        d.giorno_settimana === source.giorno_settimana
          ? d
          : {
              ...d,
              chiuso: source.chiuso,
              fasce: source.fasce.map((f) => ({
                key: crypto.randomUUID(),
                apertura: f.apertura,
                chiusura: f.chiusura,
              })),
            },
      );
    });
  }

  function removeFascia(dayIndex: number, fasciaIndex: number) {
    setJustSaved(false);
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? { ...d, fasce: d.fasce.filter((_, fi) => fi !== fasciaIndex) }
          : d,
      ),
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const rows: FasciaInput[] = days.flatMap((day): FasciaInput[] => {
        const validFasce = day.chiuso
          ? []
          : day.fasce.filter((f) => f.apertura && f.chiusura);

        if (validFasce.length === 0) {
          return [
            {
              giorno_settimana: day.giorno_settimana,
              ordine: 0,
              apertura: null,
              chiusura: null,
            },
          ];
        }

        return validFasce.map((f, index) => ({
          giorno_settimana: day.giorno_settimana,
          ordine: index,
          apertura: f.apertura,
          chiusura: f.chiusura,
        }));
      });

      await saveOrari(rows);
      setJustSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore durante il salvataggio.",
      );
    } finally {
      setSaving(false);
    }
  }

  const previewText = formatOrariPreview(
    days.map((d) => ({
      nome: d.nome,
      chiuso: d.chiuso,
      fasce: d.chiuso
        ? []
        : d.fasce
            .filter((f) => f.apertura && f.chiusura)
            .map((f) => ({ apertura: f.apertura, chiusura: f.chiusura })),
    })),
  );

  return (
    <div className="max-w-2xl">
      <div>
        {days.map((day, dayIndex) => (
          <div
            key={day.giorno_settimana}
            className="py-4 border-b border-ink/10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="font-sans text-sm font-medium text-ink w-24 flex-shrink-0">
                  {day.nome}
                </span>
                <Switch
                  checked={day.chiuso}
                  onChange={(chiuso) => updateDay(dayIndex, { chiuso })}
                  label="Chiuso"
                />
              </div>
              <button
                type="button"
                onClick={() => applyToAllDays(dayIndex)}
                className="inline-flex min-h-11 items-center rounded-[2px] font-sans text-xs text-muted transition-colors hover:text-bordeaux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 sm:min-h-0"
              >
                Applica a tutti i giorni
              </button>
            </div>

            {!day.chiuso && (
              <div className="mt-3 sm:pl-28 space-y-2">
                {day.fasce.map((fascia, fasciaIndex) => (
                  // Su mobile "Apertura [ora] Chiusura [ora] ×" in
                  // una riga sola non ci sta: i 332px disponibili non
                  // bastano e la × finiva fuori dallo schermo. Qui
                  // diventa una griglia a due colonne con le etichette
                  // sopra i campi; da sm torna la riga inline.
                  <div
                    key={fascia.key}
                    className="grid grid-cols-[1fr_1fr_auto] items-end gap-2 sm:flex sm:items-center"
                  >
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <label
                        htmlFor={`${fascia.key}-apertura`}
                        className="font-sans text-xs text-muted"
                      >
                        Apertura
                      </label>
                      <input
                        id={`${fascia.key}-apertura`}
                        type="time"
                        value={fascia.apertura}
                        onChange={(e) =>
                          updateFascia(dayIndex, fasciaIndex, {
                            apertura: e.target.value,
                          })
                        }
                        className={cn(inputClass, "w-full sm:w-28")}
                      />
                    </div>
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                      <label
                        htmlFor={`${fascia.key}-chiusura`}
                        className="font-sans text-xs text-muted"
                      >
                        Chiusura
                      </label>
                      <input
                        id={`${fascia.key}-chiusura`}
                        type="time"
                        value={fascia.chiusura}
                        onChange={(e) =>
                          updateFascia(dayIndex, fasciaIndex, {
                            chiusura: e.target.value,
                          })
                        }
                        className={cn(inputClass, "w-full sm:w-28")}
                      />
                    </div>
                    {day.fasce.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeFascia(dayIndex, fasciaIndex)}
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[2px] font-sans text-lg leading-none text-muted hover:text-bordeaux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 sm:min-h-0 sm:min-w-0 sm:px-1"
                        aria-label="Rimuovi fascia oraria"
                      >
                        ×
                      </button>
                    ) : (
                      // Segnaposto: senza, con una sola fascia le due
                      // colonne dei campi si allargherebbero, e le
                      // righe di uno stesso giorno non sarebbero
                      // allineate fra loro.
                      <span aria-hidden="true" className="w-11 sm:hidden" />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFascia(dayIndex)}
                  className="inline-flex min-h-11 items-center rounded-[2px] font-sans text-xs text-bordeaux hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 sm:min-h-0"
                >
                  + Aggiungi fascia oraria
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="font-sans text-sm text-bordeaux mt-4">{error}</p>
      )}

      <div className="flex items-center gap-4 mt-6">
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Salvataggio…" : "Salva orari"}
        </Button>
        {justSaved && (
          <span className="font-sans text-sm text-muted">Orari salvati.</span>
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-ink/10">
        <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-2">
          Anteprima footer sito
        </p>
        <p className="font-serif text-base text-ink italic">{previewText}</p>
      </div>
    </div>
  );
}
