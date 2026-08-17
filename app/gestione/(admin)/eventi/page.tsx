import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { Button } from "@/src/components/ui/Button";
import { EventiListClient } from "./_components/EventiListClient";

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
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
            Gestione
          </p>
          <h1 className="font-serif text-4xl font-medium text-ink">Eventi</h1>
        </div>
        <Link href="/gestione/eventi/nuovo">
          <Button variant="primary">+ Aggiungi evento</Button>
        </Link>
      </div>

      <EventiListClient eventi={eventi ?? []} />
    </div>
  );
}
