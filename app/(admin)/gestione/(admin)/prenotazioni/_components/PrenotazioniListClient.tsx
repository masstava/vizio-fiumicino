"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import { StatusSelect } from "@/src/components/admin/StatusSelect";
import {
  cambiaStatoPrenotazione,
  segnaPrenotazioneVista,
  type StatoPrenotazione,
} from "../_actions";
import { STATI } from "./stati";
import { DettaglioPrenotazionePanel } from "./DettaglioPrenotazionePanel";

export interface RispostaExtraRiga {
  etichetta: string;
  valore: string;
}

export interface PrenotazioneRiga {
  id: string;
  nome: string;
  telefono: string;
  /** "HH:MM" */
  fascia: string;
  coperti: number;
  note: string | null;
  stato: StatoPrenotazione;
  risposteExtra: RispostaExtraRiga[];
  vista: boolean;
}

const searchClass =
  "min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text w-56 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

export function PrenotazioniListClient({
  prenotazioni: iniziali,
  data,
  onPrenotazioneVista,
}: {
  prenotazioni: PrenotazioneRiga[];
  data: string;
  /**
   * Chiamato la prima volta che una riga di QUESTO giorno passa a
   * vista=true — mai per riaperture successive. Il chiamante (la
   * striscia settimanale) lo usa per far scendere di uno il contatore
   * "non ancora aperte" del giorno, senza dover rileggere il server.
   */
  onPrenotazioneVista: (data: string) => void;
}) {
  const [prenotazioni, setPrenotazioni] = useState(iniziali);
  const [ricerca, setRicerca] = useState("");
  const [selezionataId, setSelezionataId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const triggerRef = useRef<HTMLElement | null>(null);

  const filtrate = useMemo(() => {
    const q = ricerca.trim().toLowerCase();
    if (!q) return prenotazioni;
    return prenotazioni.filter(
      (r) =>
        r.nome.toLowerCase().includes(q) || r.telefono.toLowerCase().includes(q),
    );
  }, [prenotazioni, ricerca]);

  const rigaSelezionata = prenotazioni.find((p) => p.id === selezionataId) ?? null;

  function apriDettaglio(riga: PrenotazioneRiga) {
    triggerRef.current = document.activeElement as HTMLElement;
    setSelezionataId(riga.id);

    // Una sola direzione, una sola volta: se questa riga era già vista
    // non si tocca né lo stato locale né il server.
    if (riga.vista) return;
    setPrenotazioni((prev) =>
      prev.map((p) => (p.id === riga.id ? { ...p, vista: true } : p)),
    );
    onPrenotazioneVista(data);
    startTransition(async () => {
      try {
        await segnaPrenotazioneVista(riga.id);
      } catch (err) {
        // Nessun rollback: lo staff ha comunque aperto e visto la
        // prenotazione — vedi il commento in _actions.ts.
        console.error("[apriDettaglio] impossibile segnare la prenotazione come vista:", err, {
          id: riga.id,
        });
      }
    });
  }

  function chiudiDettaglio() {
    setSelezionataId(null);
    triggerRef.current?.focus();
  }

  function handleCambiaStato(id: string, nuovo: StatoPrenotazione) {
    const precedente = prenotazioni.find((p) => p.id === id)?.stato;
    setPrenotazioni((prev) => prev.map((p) => (p.id === id ? { ...p, stato: nuovo } : p)));
    startTransition(async () => {
      try {
        await cambiaStatoPrenotazione(id, nuovo);
      } catch (err) {
        if (precedente) {
          setPrenotazioni((prev) =>
            prev.map((p) => (p.id === id ? { ...p, stato: precedente } : p)),
          );
        }
        console.error(err);
        window.alert("Errore durante il cambio di stato. Riprova.");
      }
    });
  }

  return (
    <div>
      <TopbarSlot order={1}>
        <label htmlFor="prenotazioni-ricerca" className="sr-only">
          Cerca per nome o telefono
        </label>
        <input
          id="prenotazioni-ricerca"
          type="search"
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          placeholder="Cerca per nome o telefono…"
          className={searchClass}
        />
      </TopbarSlot>

      {prenotazioni.length === 0 ? (
        <p className="font-sans text-sm text-admin-text-2">
          Nessuna prenotazione per questa data.
        </p>
      ) : filtrate.length === 0 ? (
        <p className="font-sans text-sm text-admin-text-2">
          Nessun risultato per &quot;{ricerca}&quot;.
        </p>
      ) : (
        <div className="divide-y divide-admin-line overflow-hidden rounded-[2px] border border-admin-line bg-admin-surface">
          {filtrate.map((riga) => (
            <PrenotazioneRow
              key={riga.id}
              riga={riga}
              isPending={isPending}
              onApri={() => apriDettaglio(riga)}
              onCambiaStato={(nuovo) => handleCambiaStato(riga.id, nuovo)}
            />
          ))}
        </div>
      )}

      <DettaglioPrenotazionePanel
        riga={rigaSelezionata}
        data={data}
        onClose={chiudiDettaglio}
        onCambiaStato={handleCambiaStato}
        isPending={isPending}
      />
    </div>
  );
}

function PrenotazioneRow({
  riga,
  isPending,
  onApri,
  onCambiaStato,
}: {
  riga: PrenotazioneRiga;
  isPending: boolean;
  onApri: () => void;
  onCambiaStato: (nuovo: StatoPrenotazione) => void;
}) {
  return (
    <div className="flex flex-col gap-3 px-4 py-4 hover:bg-admin-canvas transition-colors sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <button
        type="button"
        onClick={onApri}
        className="min-w-0 flex-1 rounded-[2px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60"
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-sm text-admin-brick flex-shrink-0">
            {riga.fascia}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {!riga.vista && (
              <span aria-hidden="true" className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-admin-amber" />
            )}
            <span className="font-serif text-lg font-medium text-admin-text">
              {riga.nome}
            </span>
            {!riga.vista && <span className="sr-only">Non ancora aperta.</span>}
          </span>
        </div>
        <p className="font-sans text-sm text-admin-text-2 mt-0.5">
          {riga.telefono} · {riga.coperti}{" "}
          {riga.coperti === 1 ? "coperto" : "coperti"}
        </p>
        {riga.note && (
          <p className="font-sans text-sm text-admin-text mt-1">{riga.note}</p>
        )}
        {riga.risposteExtra.map((r, i) => (
          <p key={i} className="font-sans text-xs text-admin-text-2 mt-0.5">
            {r.etichetta}: {r.valore}
          </p>
        ))}
      </button>

      <div className="flex-shrink-0">
        <StatusSelect
          value={riga.stato}
          options={STATI}
          onChange={onCambiaStato}
          disabled={isPending}
          ariaLabel={`Stato prenotazione di ${riga.nome}`}
        />
      </div>
    </div>
  );
}
