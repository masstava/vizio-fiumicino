import { createClient } from "@/src/lib/supabase/server";
import { OrariForm } from "./_components/OrariForm";
import { PdfDownloadControls } from "./_components/PdfDownloadControls";
import type { OrarioFasciaRow, OrarioGiornoRow } from "./_components/types";

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

  const { data: existingRows, error: fetchError } = await supabase
    .from("orari")
    .select("id, giorno_settimana, ordine, apertura, chiusura")
    .order("giorno_settimana")
    .order("ordine");

  if (fetchError) {
    console.error("[/gestione/orari] lettura orari fallita:", fetchError);
    throw new Error(`Lettura orari fallita: ${fetchError.message}`);
  }

  const rowsByDay = new Map<number, OrarioFasciaRow[]>();
  (existingRows ?? []).forEach((r) => {
    const arr = rowsByDay.get(r.giorno_settimana) ?? [];
    arr.push({
      id: r.id,
      ordine: r.ordine,
      apertura: r.apertura,
      chiusura: r.chiusura,
    });
    rowsByDay.set(r.giorno_settimana, arr);
  });

  // Primo accesso: i giorni senza nessuna fascia vengono inizializzati
  // con una fascia vuota (chiuso di default). Non c'è più un vincolo
  // di unicità su giorno_settimana da sfruttare per un upsert sicuro
  // contro le race concorrenti: accettabile, è uno scenario solo di
  // primo avvio (nel peggiore dei casi una fascia "chiuso" duplicata,
  // visibile e rimovibile subito dall'admin).
  const missingDays = GIORNI_LABELS.map((_, giorno) => giorno).filter(
    (giorno) => !rowsByDay.has(giorno),
  );

  if (missingDays.length > 0) {
    const toInsert = missingDays.map((giorno) => ({
      giorno_settimana: giorno,
      ordine: 0,
      apertura: null,
      chiusura: null,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("orari")
      .insert(toInsert)
      .select("id, giorno_settimana, ordine, apertura, chiusura");

    if (insertError) {
      console.error(
        "[/gestione/orari] seed giorni mancanti fallito:",
        insertError,
      );
      throw new Error(`Inizializzazione orari fallita: ${insertError.message}`);
    }

    (inserted ?? []).forEach((r) => {
      rowsByDay.set(r.giorno_settimana, [
        {
          id: r.id,
          ordine: r.ordine,
          apertura: r.apertura,
          chiusura: r.chiusura,
        },
      ]);
    });
  }

  const orari: OrarioGiornoRow[] = GIORNI_LABELS.map((nome, giorno) => ({
    giorno_settimana: giorno,
    nome,
    fasce: (rowsByDay.get(giorno) ?? []).slice().sort((a, b) => a.ordine - b.ordine),
  }));

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-8">Orari</h1>

      <OrariForm initialOrari={orari} />

      <div className="mt-12 pt-8 border-t border-ink/10 max-w-2xl">
        <h2 className="font-serif text-xl font-medium text-ink mb-1">
          Esporta PDF
        </h2>
        <p className="font-sans text-sm text-muted mb-5">
          Genera un cartello PDF con gli orari attuali. I campi sotto sono
          opzionali e non vengono salvati.
        </p>
        <PdfDownloadControls />
      </div>
    </div>
  );
}
