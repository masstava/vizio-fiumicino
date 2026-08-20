import { createClient } from "@/src/lib/supabase/server";
import { CHIAVI_CONTENUTI } from "@/src/lib/contenuti";
import { ContenutiForm } from "./_components/ContenutiForm";

export const dynamic = "force-dynamic";

export default async function ContenutiPage() {
  const supabase = await createClient();

  const { data: righe } = await supabase
    .from("contenuti_sito")
    .select("chiave, valore");

  const salvati = new Map((righe ?? []).map((r) => [r.chiave, r.valore ?? ""]));

  // Il form parte dal valore salvato, non dal fallback: un campo
  // vuoto deve restare vuoto (è il modo per tornare al testo del
  // codice), e il fallback si vede come placeholder.
  const initialValori: Record<string, string> = {};
  CHIAVI_CONTENUTI.forEach((chiave) => {
    initialValori[chiave] = salvati.get(chiave) ?? "";
  });

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-3">
        Testi della home
      </h1>
      <p className="font-sans text-sm text-muted mb-10 max-w-2xl">
        Da qui cambi le parole della home. La struttura della pagina — quali
        sezioni ci sono e in che ordine — resta fissa: non si rompe nulla
        scrivendo qui.
      </p>

      <ContenutiForm initialValori={initialValori} />
    </div>
  );
}
