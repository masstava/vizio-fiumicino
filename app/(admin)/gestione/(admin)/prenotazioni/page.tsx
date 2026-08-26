import { createClient } from "@/src/lib/supabase/server";
import { getOrariSito } from "@/src/lib/orari-sito";
import {
  giornoSettimanaDaData,
  oggiEOraRoma,
  orariPrenotabili,
} from "@/src/lib/prenotazioni/disponibilita";
import type { RispostaExtra } from "@/src/lib/prenotazioni/evento-contesto";
import { SelettoreData } from "./_components/SelettoreData";
import {
  PrenotazioniListClient,
  type PrenotazioneRiga,
} from "./_components/PrenotazioniListClient";
import { CapienzaPanel } from "./_components/CapienzaPanel";
import type { StatoPrenotazione } from "./_actions";

export const dynamic = "force-dynamic";

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

function risposteExtraDiRiga(valore: unknown): RispostaExtra[] {
  if (!Array.isArray(valore)) return [];
  return valore.filter(
    (v): v is RispostaExtra =>
      typeof v === "object" &&
      v !== null &&
      typeof (v as RispostaExtra).etichetta === "string" &&
      typeof (v as RispostaExtra).valore === "string",
  );
}

export default async function PrenotazioniPage({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const { data: dataParam } = await searchParams;
  const oggi = oggiEOraRoma().data;
  const dataSelezionata = dataParam && FORMATO_DATA.test(dataParam) ? dataParam : oggi;

  const supabase = await createClient();

  // Tre letture indipendenti per la stessa data: partono insieme.
  const [{ data: prenotazioni, error: erroreLista }, { data: capienzaRighe }, orari] =
    await Promise.all([
      supabase
        .from("prenotazioni")
        .select("id, nome, telefono, fascia, coperti, note, stato, risposte_extra")
        .eq("data", dataSelezionata)
        .order("fascia"),
      supabase
        .from("capienza_config")
        .select("fascia, limite_coperti")
        .eq("data", dataSelezionata),
      getOrariSito(supabase, "it"),
    ]);

  if (erroreLista) {
    console.error("[/gestione/prenotazioni] lettura prenotazioni fallita:", erroreLista, {
      dataSelezionata,
    });
  }

  const giorno = giornoSettimanaDaData(dataSelezionata);
  const infoGiorno = orari.settimana[giorno];
  const fasceGiorno =
    infoGiorno && !infoGiorno.chiuso ? infoGiorno.fasce.flatMap(orariPrenotabili) : [];

  const righe: PrenotazioneRiga[] = (prenotazioni ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    telefono: p.telefono,
    fascia: p.fascia.slice(0, 5),
    coperti: p.coperti,
    note: p.note,
    stato: p.stato as StatoPrenotazione,
    risposteExtra: risposteExtraDiRiga(p.risposte_extra),
  }));

  const occupatiPerFascia: Record<string, number> = {};
  righe.forEach((r) => {
    if (r.stato === "confermata" || r.stato === "completata") {
      occupatiPerFascia[r.fascia] = (occupatiPerFascia[r.fascia] ?? 0) + r.coperti;
    }
  });

  const limitiEsistenti: Record<string, number> = {};
  (capienzaRighe ?? []).forEach((r) => {
    if (r.limite_coperti != null) limitiEsistenti[r.fascia.slice(0, 5)] = r.limite_coperti;
  });

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-8">
        Prenotazioni
      </h1>

      <SelettoreData data={dataSelezionata} oggi={oggi} />

      <PrenotazioniListClient prenotazioni={righe} />

      <div className="mt-12 pt-8 border-t border-ink/10">
        <h2 className="font-serif text-xl font-medium text-ink mb-1">
          Capienza per fascia
        </h2>
        <CapienzaPanel
          data={dataSelezionata}
          fasce={fasceGiorno}
          limitiEsistenti={limitiEsistenti}
          occupati={occupatiPerFascia}
        />
      </div>
    </div>
  );
}
