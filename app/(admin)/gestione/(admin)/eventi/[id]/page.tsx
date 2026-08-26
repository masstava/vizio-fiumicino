import { notFound } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { EventForm } from "../_components/EventForm";

export const dynamic = "force-dynamic";

export default async function ModificaEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Due letture indipendenti (evento e i suoi campi extra): partono
  // insieme, non in sequenza.
  const [{ data: evento }, { data: campiExtra }] = await Promise.all([
    supabase.from("eventi").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("campi_extra_evento")
      .select("etichetta")
      .eq("evento_id", id)
      .order("ordine"),
  ]);

  if (!evento) notFound();

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione · Eventi
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-8">
        Modifica evento
      </h1>
      <EventForm
        mode="edit"
        eventoId={evento.id}
        initialData={{
          titolo: evento.titolo,
          titolo_en: evento.titolo_en ?? "",
          descrizione: evento.descrizione ?? "",
          descrizione_en: evento.descrizione_en ?? "",
          data_evento: evento.data_evento ?? "",
          attivo: evento.attivo,
          campiExtra: (campiExtra ?? []).map((c) => ({ etichetta: c.etichetta })),
        }}
      />
    </div>
  );
}
