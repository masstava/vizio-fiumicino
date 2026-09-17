import { createClient } from "@/src/lib/supabase/server";
import { getOrariSito } from "@/src/lib/orari-sito";
import {
  addGiorni,
  giornoSettimanaDaData,
  oggiEOraRoma,
  orariPrenotabili,
} from "@/src/lib/prenotazioni/disponibilita";
import { risposteExtraDaJson } from "@/src/lib/prenotazioni/evento-contesto";
import { SezionePrenotazioniClient } from "./_components/SezionePrenotazioniClient";
import type { PrenotazioneRiga } from "./_components/PrenotazioniListClient";
import type { GiornoStriscia } from "./_components/StriscettaSettimanale";
import { CapienzaPanel } from "./_components/CapienzaPanel";
import type { StatoPrenotazione } from "./_actions";

/** Ampiezza della striscia settimanale: oggi + 6 giorni successivi. */
const GIORNI_STRISCIA = 7;

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
  const fineStriscia = addGiorni(oggi, GIORNI_STRISCIA - 1);

  // Quattro letture indipendenti: partono insieme. Il riepilogo della
  // striscia settimanale è sempre sull'intervallo oggi..oggi+6, non su
  // dataSelezionata — le due cose sono deliberatamente disaccoppiate
  // (si può selezionare un giorno fuori dai 7 mostrati dal calendario
  // completo, senza che la striscia cambi finestra).
  const [
    { data: prenotazioni, error: erroreLista },
    { data: capienzaRighe },
    orari,
    { data: riepilogoRighe, error: erroreRiepilogo },
  ] = await Promise.all([
    supabase
      .from("prenotazioni")
      .select("id, nome, telefono, fascia, coperti, note, stato, risposte_extra, vista")
      .eq("data", dataSelezionata)
      .order("fascia"),
    supabase
      .from("capienza_config")
      .select("fascia, limite_coperti")
      .eq("data", dataSelezionata),
    getOrariSito(supabase, "it"),
    supabase.rpc("riepilogo_settimana_prenotazioni", { p_da: oggi, p_a: fineStriscia }),
  ]);

  if (erroreLista) {
    console.error("[/gestione/prenotazioni] lettura prenotazioni fallita:", erroreLista, {
      dataSelezionata,
    });
  }
  if (erroreRiepilogo) {
    console.error("[/gestione/prenotazioni] riepilogo settimana fallito:", erroreRiepilogo, {
      oggi,
      fineStriscia,
    });
  }

  // Fallback a zero se la RPC fallisce: la striscia resta utilizzabile
  // (si vede comunque quale giorno è oggi, si può comunque navigare),
  // solo senza i numeri — meglio di una pagina rotta per un errore su
  // un solo aggregato accessorio.
  const perData = new Map((riepilogoRighe ?? []).map((r) => [r.data, r]));
  const giorniStriscia: GiornoStriscia[] = Array.from({ length: GIORNI_STRISCIA }, (_, i) => {
    const data = addGiorni(oggi, i);
    const riga = perData.get(data);
    return {
      data,
      coperti: riga?.coperti ?? 0,
      nonViste: riga?.non_viste ?? 0,
    };
  });

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
    vista: p.vista,
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
      <SezionePrenotazioniClient
        oggi={oggi}
        dataSelezionata={dataSelezionata}
        giorniIniziali={giorniStriscia}
        prenotazioni={righe}
        prenotazioniAttive={prenotazioniAttive}
        copertiTotali={copertiTotali}
        noShow={noShow}
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
