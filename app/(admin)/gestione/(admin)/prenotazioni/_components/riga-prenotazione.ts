import { risposteExtraDaJson } from "@/src/lib/prenotazioni/evento-contesto";
import type { StatoPrenotazione } from "../_actions";
import type { PrenotazioneRiga } from "./PrenotazioniListClient";

// Conversione riga del database → riga della lista, condivisa fra la
// lettura server (page.tsx) e il payload Realtime di una nuova
// prenotazione (SezionePrenotazioniClient): le due strade devono
// produrre righe identiche, altrimenti una prenotazione arrivata dal
// vivo apparirebbe diversa dalla stessa riga dopo una ricarica.
export interface RecordPrenotazione {
  id: string;
  nome: string;
  telefono: string;
  /** "HH:MM:SS" dal database. */
  fascia: string;
  coperti: number;
  note: string | null;
  stato: string;
  risposte_extra: unknown;
  vista: boolean;
}

export function rigaDaRecord(p: RecordPrenotazione): PrenotazioneRiga {
  return {
    id: p.id,
    nome: p.nome,
    telefono: p.telefono,
    fascia: p.fascia.slice(0, 5),
    coperti: p.coperti,
    note: p.note,
    stato: p.stato as StatoPrenotazione,
    risposteExtra: risposteExtraDaJson(p.risposte_extra),
    vista: p.vista,
  };
}

// Stesso ordinamento della lettura server (.order("fascia")): la nuova
// riga va dopo tutte quelle con orario minore O UGUALE — a parità di
// fascia la più recente va in fondo al gruppo. Il confronto fra
// stringhe "HH:MM" è già cronologico.
export function inserisciInOrdine(righe: PrenotazioneRiga[], nuova: PrenotazioneRiga): PrenotazioneRiga[] {
  const i = righe.findIndex((r) => r.fascia > nuova.fascia);
  if (i === -1) return [...righe, nuova];
  return [...righe.slice(0, i), nuova, ...righe.slice(i)];
}
