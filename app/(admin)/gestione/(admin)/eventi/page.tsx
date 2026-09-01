import { createClient } from "@/src/lib/supabase/server";
import { EventiListClient } from "./_components/EventiListClient";
import { NuovoEventoAction } from "./_components/NuovoEventoAction";

export const dynamic = "force-dynamic";

export default async function EventiPage() {
  const supabase = await createClient();

  const { data: eventi } = await supabase
    .from("eventi")
    .select("id, titolo, data_evento, attivo")
    .order("data_evento", { ascending: true, nullsFirst: false })
    .order("titolo");

  return (
    <div className="p-8 md:p-12">
      <NuovoEventoAction />

      <EventiListClient eventi={eventi ?? []} />
    </div>
  );
}
