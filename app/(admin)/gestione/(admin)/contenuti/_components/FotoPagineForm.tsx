"use client";

import { useState } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { salvaMediaPagina } from "../_actions";

interface SlotMedia {
  pagina: string;
  etichetta: string;
  tipo: "immagine" | "video";
  url: string | null;
}

// Bucket pubblico dedicato — vedi
// supabase/migrations/20260901000000_media_pagine.sql per il perché di
// "sito-media" (non "sito-foto": il codice pubblico lo referenzia già
// con questo nome per il video hero).
const BUCKET = "sito-media";

export function FotoPagineForm({ slots }: { slots: SlotMedia[] }) {
  return (
    <div className="max-w-2xl divide-y divide-admin-line overflow-hidden rounded-[2px] border border-admin-line bg-admin-surface">
      {slots.map((slot) => (
        <RigaMedia key={slot.pagina} slot={slot} />
      ))}
    </div>
  );
}

function RigaMedia({ slot }: { slot: SlotMedia }) {
  const [url, setUrl] = useState(slot.url);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permette di riselezionare lo stesso file
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || (slot.tipo === "video" ? "mp4" : "jpg");
      const path = `${slot.pagina}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true });
      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

      await salvaMediaPagina(slot.pagina, publicUrlData.publicUrl);
      setUrl(publicUrlData.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRimuovi() {
    setUploading(true);
    setError(null);
    try {
      await salvaMediaPagina(slot.pagina, null);
      setUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante la rimozione.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[2px]">
        {url && slot.tipo === "immagine" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : url && slot.tipo === "video" ? (
          <div className="flex h-full w-full items-center justify-center bg-admin-ink font-sans text-[10px] uppercase tracking-widest text-cream-text">
            Video
          </div>
        ) : (
          <ImagePlaceholder seed={slot.pagina} className="h-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm font-medium text-admin-text">{slot.etichetta}</p>
        <p className="font-sans text-xs text-admin-text-2">
          {url ? "Impostata" : "Non impostata — il sito usa il suo aspetto attuale"}
        </p>
        {error && <p className="font-sans text-xs text-admin-brick mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <label
          className="inline-flex min-h-11 items-center rounded-[2px] border border-admin-line bg-admin-surface px-3 font-sans text-sm text-admin-text cursor-pointer transition-colors hover:border-admin-brick/50 md:min-h-0 md:py-1.5"
        >
          {uploading ? "Caricamento…" : url ? "Cambia" : "Carica"}
          <input
            type="file"
            accept={slot.tipo === "video" ? "video/mp4" : "image/*"}
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
        {url && (
          <button
            type="button"
            onClick={handleRimuovi}
            disabled={uploading}
            className="inline-flex min-h-11 items-center font-sans text-sm text-admin-text-2 hover:text-admin-brick transition-colors disabled:opacity-50 md:min-h-0"
          >
            Rimuovi
          </button>
        )}
      </div>
    </div>
  );
}
