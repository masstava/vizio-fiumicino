"use client";

import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/Button";

const inputClass =
  "w-full bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-bordeaux/50 transition-colors";

export function PdfDownloadControls() {
  // Campi non persistiti: solo per il download corrente, si svuotano
  // ad ogni ricarica della pagina.
  const [titolo, setTitolo] = useState("");
  const [sottotitolo, setSottotitolo] = useState("");

  const href = useMemo(() => {
    const params = new URLSearchParams();
    if (titolo.trim()) params.set("titolo", titolo.trim());
    if (sottotitolo.trim()) params.set("sottotitolo", sottotitolo.trim());
    const query = params.toString();
    return `/api/pdf/orari${query ? `?${query}` : ""}`;
  }, [titolo, sottotitolo]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
      <div className="flex-1">
        <label className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5">
          Titolo
        </label>
        <input
          className={inputClass}
          placeholder="Orari apertura"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <label className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5">
          Sottotitolo
        </label>
        <input
          className={inputClass}
          placeholder="es. Orari speciali Ferragosto"
          value={sottotitolo}
          onChange={(e) => setSottotitolo(e.target.value)}
        />
      </div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
        <Button type="button" variant="primary">
          Scarica PDF orari
        </Button>
      </a>
    </div>
  );
}
