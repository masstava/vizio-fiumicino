"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { cn } from "@/src/lib/utils";
import { salvaSelezioneHome } from "../_actions";
import { SelezionaPiattoPanel } from "./SelezionaPiattoPanel";
import type { PiattoCatalogo } from "./types";

type Sezione = "evidenza" | "anteprima";

export function SelezioneHomeForm({
  catalogo,
  initialEvidenza,
  initialAnteprima,
  massimoEvidenza,
  massimoAnteprima,
}: {
  catalogo: PiattoCatalogo[];
  initialEvidenza: PiattoCatalogo[];
  initialAnteprima: PiattoCatalogo[];
  massimoEvidenza: number;
  massimoAnteprima: number;
}) {
  const [evidenza, setEvidenza] = useState(initialEvidenza);
  const [anteprima, setAnteprima] = useState(initialAnteprima);
  const [target, setTarget] = useState<Sezione | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  // Stesso schema di PrenotazioniListClient.tsx (passaggio 4/6): il
  // pannello di selezione può essere aperto da uno qualunque dei
  // pulsanti "+" (due sezioni), quindi non basta un ref fisso — si
  // annota quale elemento aveva il focus al momento dell'apertura, e
  // alla chiusura il focus torna lì.
  const triggerRef = useRef<HTMLElement | null>(null);

  function segnaModificato() {
    setJustSaved(false);
    setError(null);
  }

  function apriSelezione(sezione: Sezione) {
    triggerRef.current = document.activeElement as HTMLElement;
    setTarget(sezione);
  }

  function chiudiSelezione() {
    setTarget(null);
    triggerRef.current?.focus();
  }

  function handleSeleziona(piatto: PiattoCatalogo) {
    if (target === "evidenza") {
      setEvidenza((prev) => (prev.length < massimoEvidenza ? [...prev, piatto] : prev));
    } else if (target === "anteprima") {
      setAnteprima((prev) => (prev.length < massimoAnteprima ? [...prev, piatto] : prev));
    }
    segnaModificato();
    chiudiSelezione();
  }

  function rimuoviEvidenza(id: string) {
    setEvidenza((prev) => prev.filter((p) => p.id !== id));
    segnaModificato();
  }

  function rimuoviAnteprima(id: string) {
    setAnteprima((prev) => prev.filter((p) => p.id !== id));
    segnaModificato();
  }

  // Un piatto già scelto in una sezione non compare fra i candidati
  // per la STESSA sezione (non ha senso sceglierlo due volte lì), ma
  // resta scegliibile nell'altra: le due liste sono indipendenti.
  const candidatiEvidenza = useMemo(
    () => catalogo.filter((p) => !evidenza.some((e) => e.id === p.id)),
    [catalogo, evidenza],
  );
  const candidatiAnteprima = useMemo(
    () => catalogo.filter((p) => !anteprima.some((e) => e.id === p.id)),
    [catalogo, anteprima],
  );

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await salvaSelezioneHome(
        evidenza.map((p, i) => ({ piatto_id: p.id, ordine: i })),
        anteprima.map((p, i) => ({ piatto_id: p.id, ordine: i })),
      );
      setJustSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <SlotGriglia
        titolo="Piatti in evidenza"
        descrizione={`Massimo ${massimoEvidenza}: mostrati nello slider in home. L'ordine qui è l'ordine di comparsa.`}
        slots={evidenza}
        massimo={massimoEvidenza}
        modalita="fisso"
        onRimuovi={rimuoviEvidenza}
        onAggiungi={() => apriSelezione("evidenza")}
      />

      <div className="mt-10">
        <SlotGriglia
          titolo="Anteprima menu in home"
          descrizione={`Fino a ${massimoAnteprima}: la griglia menu/cocktail in home. Il primo è il piatto grande in cima.`}
          slots={anteprima}
          massimo={massimoAnteprima}
          modalita="crescente"
          onRimuovi={rimuoviAnteprima}
          onAggiungi={() => apriSelezione("anteprima")}
        />
      </div>

      {error && <p className="font-sans text-sm text-admin-brick mt-6">{error}</p>}

      <div className="flex items-center gap-4 mt-8">
        <Button type="button" variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvataggio…" : "Salva selezione home"}
        </Button>
        {justSaved && (
          <span className="font-sans text-sm text-admin-text-2">Selezione salvata.</span>
        )}
      </div>

      <SelezionaPiattoPanel
        aperto={target != null}
        candidati={target === "evidenza" ? candidatiEvidenza : candidatiAnteprima}
        onSeleziona={handleSeleziona}
        onClose={chiudiSelezione}
      />
    </div>
  );
}

function SlotGriglia({
  titolo,
  descrizione,
  slots,
  massimo,
  modalita,
  onRimuovi,
  onAggiungi,
}: {
  titolo: string;
  descrizione: string;
  slots: PiattoCatalogo[];
  massimo: number;
  /**
   * "fisso": sempre `massimo` riquadri (i vuoti restano "+") — per
   * evidenza, che nel prototipo è una griglia di posizioni fisse.
   * "crescente": un riquadro per piatto scelto più UN solo "+" finale,
   * finché non si raggiunge il massimo — per l'anteprima, dove
   * mostrare sempre 8 riquadri vuoti sembrerebbe un modulo da
   * compilare invece di una selezione già fatta.
   */
  modalita: "fisso" | "crescente";
  onRimuovi: (id: string) => void;
  onAggiungi: () => void;
}) {
  const vuoti =
    modalita === "fisso"
      ? Math.max(massimo - slots.length, 0)
      : slots.length < massimo
        ? 1
        : 0;

  return (
    <div>
      <h2 className="font-serif text-xl font-medium text-admin-text mb-1">{titolo}</h2>
      <p className="font-sans text-sm text-admin-text-2 mb-4 max-w-xl">{descrizione}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {slots.map((p) => (
          <div
            key={p.id}
            className="relative rounded-[2px] border border-admin-line bg-admin-surface p-3"
          >
            <button
              type="button"
              onClick={() => onRimuovi(p.id)}
              aria-label={`Rimuovi ${p.nome} da "${titolo}"`}
              className="absolute right-1.5 top-1.5 inline-flex h-11 w-11 items-center justify-center rounded-[2px] text-admin-text-2 hover:text-admin-brick focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 sm:h-6 sm:w-6"
              data-tocco-esteso
            >
              <span aria-hidden="true" className="text-base leading-none">×</span>
            </button>
            <div className="h-16 w-16 overflow-hidden rounded-[2px] mb-2">
              {p.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.fotoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <ImagePlaceholder seed={p.id} className="h-full" />
              )}
            </div>
            <p className="font-sans text-sm font-medium text-admin-text truncate">{p.nome}</p>
            <p className="font-sans text-xs text-admin-text-2 truncate">{p.categoria}</p>
          </div>
        ))}
        {Array.from({ length: vuoti }).map((_, i) => (
          <button
            key={`vuoto-${i}`}
            type="button"
            onClick={onAggiungi}
            className={cn(
              "flex min-h-[124px] flex-col items-center justify-center gap-1 rounded-[2px] border border-dashed border-admin-line bg-admin-canvas",
              "text-admin-text-2 hover:border-admin-brick hover:text-admin-brick transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60",
            )}
          >
            <span aria-hidden="true" className="text-2xl leading-none">+</span>
            <span className="font-sans text-xs">Aggiungi</span>
          </button>
        ))}
      </div>
    </div>
  );
}
