import { createClient } from "@/src/lib/supabase/server";
import { getOrariSito } from "@/src/lib/orari-sito";
import {
  giornoSettimanaDaData,
  oggiEOraRoma,
  orariPrenotabili,
} from "@/src/lib/prenotazioni/disponibilita";
import { risposteExtraDaJson } from "@/src/lib/prenotazioni/evento-contesto";
import { SelettoreData } from "./_components/SelettoreData";
import {
  PrenotazioniListClient,
  type PrenotazioneRiga,
} from "./_components/PrenotazioniListClient";
import { CapienzaPanel } from "./_components/CapienzaPanel";
import type { StatoPrenotazione } from "./_actions";

export const dynamic = "force-dynamic";

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

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
    risposteExtra: risposteExtraDaJson(p.risposte_extra),
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

  // Statistiche del giorno selezionato — dalla stessa lettura già in
  // uso per la lista (nessuna query aggiuntiva). "In attesa" del
  // prototipo non esiste nel modello dati reale (§ Verifica): sostituito
  // con "No-show", uno stato reale e operativamente utile (quante
  // persone non si sono presentate quel giorno).
  const prenotazioniAttive = righe.filter((r) => r.stato !== "cancellata").length;
  const copertiTotali = Object.values(occupatiPerFascia).reduce((a, b) => a + b, 0);
  const noShow = righe.filter((r) => r.stato === "no-show").length;

  return (
    <div className="p-8 md:p-12">
      <SelettoreData data={dataSelezionata} oggi={oggi} />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl">
        <StatTile numero={prenotazioniAttive} etichetta="Prenotazioni" />
        <StatTile numero={copertiTotali} etichetta="Coperti totali" />
        <StatTile numero={noShow} etichetta="No-show" />
      </div>

      {/* key={dataSelezionata}: la lista tiene uno stato locale (per
          l'aggiornamento ottimistico dello stato e la sincronia col
          pannello di dettaglio) inizializzato una sola volta da questa
          prop. Senza una key che cambia con la data, passare a un altro
          giorno aggiornerebbe correttamente il rendering server (data,
          statistiche) ma NON lo stato locale già montato — la lista
          continuerebbe a mostrare le prenotazioni del giorno precedente
          finché non si ricarica la pagina. La key forza React a
          rimontare il componente da zero a ogni cambio di giorno. */}
      <PrenotazioniListClient
        key={dataSelezionata}
        prenotazioni={righe}
        data={dataSelezionata}
      />

      <div className="mt-12 pt-8 border-t border-admin-line">
        <h2 className="font-serif text-xl font-medium text-admin-text mb-1">
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

function StatTile({ numero, etichetta }: { numero: number; etichetta: string }) {
  return (
    <div className="rounded-[2px] border border-admin-line bg-admin-surface px-4 py-3">
      <p className="font-serif text-3xl font-medium text-admin-text">{numero}</p>
      <p className="font-sans text-[10px] tracking-widest uppercase text-admin-text-2 mt-1">
        {etichetta}
      </p>
    </div>
  );
}
