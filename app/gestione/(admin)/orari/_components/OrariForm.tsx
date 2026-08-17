"use client";

import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { Switch } from "@/src/components/ui/Switch";
import { saveOrari } from "../_actions";
import { formatOrariPreview } from "./formatPreview";
import type { OrarioRow } from "./types";

interface RowState {
  giorno_settimana: number;
  nome: string;
  chiuso: boolean;
  apertura: string;
  chiusura: string;
}

function toInputTime(value: string | null): string {
  return value ? value.slice(0, 5) : "";
}

function buildInitialRows(initialOrari: OrarioRow[]): RowState[] {
  return initialOrari.map((r) => ({
    giorno_settimana: r.giorno_settimana,
    nome: r.nome,
    chiuso: !r.apertura && !r.chiusura,
    apertura: toInputTime(r.apertura),
    chiusura: toInputTime(r.chiusura),
  }));
}

const inputClass =
  "bg-cream border border-ink/20 rounded-[2px] px-3 py-1.5 font-sans text-sm text-ink focus:outline-none focus:border-bordeaux/50 transition-colors disabled:opacity-40";

export function OrariForm({ initialOrari }: { initialOrari: OrarioRow[] }) {
  const [rows, setRows] = useState<RowState[]>(() =>
    buildInitialRows(initialOrari),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  function updateRow(index: number, patch: Partial<RowState>) {
    setJustSaved(false);
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await saveOrari(
        rows.map((r) => ({
          giorno_settimana: r.giorno_settimana,
          apertura: r.chiuso ? null : r.apertura || null,
          chiusura: r.chiuso ? null : r.chiusura || null,
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

  const previewText = formatOrariPreview(rows);

  return (
    <div className="max-w-2xl">
      <div>
        {rows.map((row, index) => (
          <div
            key={row.giorno_settimana}
            className="flex flex-wrap items-center gap-4 py-3 border-b border-ink/10"
          >
            <span className="font-sans text-sm font-medium text-ink w-24 flex-shrink-0">
              {row.nome}
            </span>

            <Switch
              checked={row.chiuso}
              onChange={(chiuso) => updateRow(index, { chiuso })}
              label="Chiuso"
            />

            <div className="flex items-center gap-2">
              <label className="font-sans text-xs text-muted">Apertura</label>
              <input
                type="time"
                disabled={row.chiuso}
                value={row.apertura}
                onChange={(e) => updateRow(index, { apertura: e.target.value })}
                className={cn(inputClass, "w-28")}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-sans text-xs text-muted">Chiusura</label>
              <input
                type="time"
                disabled={row.chiuso}
                value={row.chiusura}
                onChange={(e) => updateRow(index, { chiusura: e.target.value })}
                className={cn(inputClass, "w-28")}
              />
            </div>
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
