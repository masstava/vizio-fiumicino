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

const inputClass =
  "bg-cream border border-ink/20 rounded-[2px] px-3 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-bordeaux/50 transition-colors disabled:opacity-40";

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
                className="font-sans text-xs text-muted hover:text-bordeaux transition-colors"
              >
                Applica a tutti i giorni
              </button>
            </div>

            {!day.chiuso && (
              <div className="mt-3 sm:pl-28 space-y-2">
                {day.fasce.map((fascia, fasciaIndex) => (
                  <div key={fascia.key} className="flex items-center gap-2">
                    <label className="font-sans text-xs text-muted">
                      Apertura
                    </label>
                    <input
                      type="time"
                      value={fascia.apertura}
                      onChange={(e) =>
                        updateFascia(dayIndex, fasciaIndex, {
                          apertura: e.target.value,
                        })
                      }
                      className={cn(inputClass, "w-28")}
                    />
                    <label className="font-sans text-xs text-muted">
                      Chiusura
                    </label>
                    <input
                      type="time"
                      value={fascia.chiusura}
                      onChange={(e) =>
                        updateFascia(dayIndex, fasciaIndex, {
                          chiusura: e.target.value,
                        })
                      }
                      className={cn(inputClass, "w-28")}
                    />
                    {day.fasce.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFascia(dayIndex, fasciaIndex)}
                        className="font-sans text-lg leading-none text-muted hover:text-bordeaux px-1"
                        aria-label="Rimuovi fascia oraria"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addFascia(dayIndex)}
                  className="font-sans text-xs text-bordeaux hover:opacity-70"
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
