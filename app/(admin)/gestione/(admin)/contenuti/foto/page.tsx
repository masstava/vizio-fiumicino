import { createClient } from "@/src/lib/supabase/server";
import { PAGINE_MEDIA_SITO } from "@/src/lib/media-pagine";
import { SchedeGestioneSito } from "../_components/SchedeGestioneSito";
import { FotoPagineForm } from "../_components/FotoPagineForm";

export const dynamic = "force-dynamic";

export default async function GestioneSitoFotoPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("media_pagine")
    .select("pagina, url")
    .eq("slot", "hero");

  const urlByPagina = new Map((rows ?? []).map((r) => [r.pagina, r.url]));

  const slots = PAGINE_MEDIA_SITO.map((p) => ({
    ...p,
    url: urlByPagina.get(p.pagina) ?? null,
  }));

  return (
    <div className="p-8 md:p-12">
      <SchedeGestioneSito />
      <p className="font-sans text-sm text-admin-text-2 mb-8 max-w-2xl">
        Immagine (o video, per la home) di sfondo di ciascuna pagina. Una
        pagina senza niente qui resta com&apos;è oggi — nessuna rottura,
        solo lo sfondo scuro attuale.
      </p>
      <FotoPagineForm slots={slots} />
    </div>
  );
}
