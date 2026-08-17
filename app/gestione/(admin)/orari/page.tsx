import { createClient } from "@/src/lib/supabase/server";
import { OrariForm } from "./_components/OrariForm";
import type { OrarioRow } from "./_components/types";

export const dynamic = "force-dynamic";

const GIORNI_LABELS = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
] as const;

export default async function OrariPage() {
  const supabase = await createClient();

  const { data: existingRows } = await supabase
    .from("orari")
    .select("giorno_settimana, apertura, chiusura")
    .order("giorno_settimana");

  const existingByDay = new Map(
    (existingRows ?? []).map((r) => [r.giorno_settimana, r]),
  );

  // Primo accesso: la tabella "orari" non ha ancora le 7 righe.
  // Le inizializziamo con orari nulli. Upsert + ignoreDuplicates
  // rende l'operazione sicura anche se due utenti la eseguono
  // in contemporanea.
  if (existingByDay.size < 7) {
    const missing = GIORNI_LABELS.map((_, giorno) => giorno)
      .filter((giorno) => !existingByDay.has(giorno))
      .map((giorno) => ({
        giorno_settimana: giorno,
        apertura: null,
        chiusura: null,
      }));

    if (missing.length > 0) {
      await supabase
        .from("orari")
        .upsert(missing, {
          onConflict: "giorno_settimana",
          ignoreDuplicates: true,
        });
    }
  }

  const orari: OrarioRow[] = GIORNI_LABELS.map((nome, giorno) => {
    const row = existingByDay.get(giorno);
    return {
      giorno_settimana: giorno,
      nome,
      apertura: row?.apertura ?? null,
      chiusura: row?.chiusura ?? null,
    };
  });

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-8">Orari</h1>
      <OrariForm initialOrari={orari} />
    </div>
  );
}
