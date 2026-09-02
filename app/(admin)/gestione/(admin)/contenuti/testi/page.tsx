import { createClient } from "@/src/lib/supabase/server";
import { CHIAVI_CONTENUTI } from "@/src/lib/contenuti";
import { SchedeGestioneSito } from "../_components/SchedeGestioneSito";
import { ContenutiForm } from "../_components/ContenutiForm";

export const dynamic = "force-dynamic";

export default async function GestioneSitoTestiPage() {
  const supabase = await createClient();

  const { data: righe } = await supabase
    .from("contenuti_sito")
    .select("chiave, valore, valore_en");

  const salvati = new Map((righe ?? []).map((r) => [r.chiave, r.valore ?? ""]));
  const salvatiEn = new Map(
    (righe ?? []).map((r) => [r.chiave, r.valore_en ?? ""]),
  );

  // Il form parte dal valore salvato, non dal fallback: un campo
  // vuoto deve restare vuoto (è il modo per tornare al testo del
  // codice), e il fallback si vede come placeholder.
  const initialValori: Record<string, string> = {};
  const initialValoriEn: Record<string, string> = {};
  CHIAVI_CONTENUTI.forEach((chiave) => {
    initialValori[chiave] = salvati.get(chiave) ?? "";
    initialValoriEn[chiave] = salvatiEn.get(chiave) ?? "";
  });

  return (
    <div className="p-8 md:p-12">
      <SchedeGestioneSito />
      <p className="font-sans text-sm text-admin-text-2 mb-10 max-w-2xl">
        Da qui cambi le parole della home. La struttura della pagina — quali
        sezioni ci sono e in che ordine — resta fissa: non si rompe nulla
        scrivendo qui. Sotto ogni campo trovi la versione inglese: se la
        lasci vuota, il sito in inglese mostra il testo italiano.
      </p>

      <ContenutiForm
        initialValori={initialValori}
        initialValoriEn={initialValoriEn}
      />
    </div>
  );
}
