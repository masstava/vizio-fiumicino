"use client";

import { useMemo, useState, useTransition } from "react";
import {
  cambiaStatoPrenotazione,
  type StatoPrenotazione,
} from "../_actions";

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
}

const STATI: { valore: StatoPrenotazione; etichetta: string }[] = [
  { valore: "confermata", etichetta: "Confermata" },
  { valore: "completata", etichetta: "Completata" },
  { valore: "no-show", etichetta: "No-show" },
  { valore: "cancellata", etichetta: "Cancellata" },
];

const selectClass =
  "min-h-11 md:min-h-0 bg-cream border border-ink/20 rounded-[2px] px-2 py-1.5 font-sans text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 focus-visible:border-bordeaux/50 disabled:opacity-50";

const searchClass =
  "min-h-11 md:min-h-0 bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink w-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 focus-visible:border-bordeaux/50";

export function PrenotazioniListClient({
  prenotazioni,
}: {
  prenotazioni: PrenotazioneRiga[];
}) {
  const [ricerca, setRicerca] = useState("");

  const filtrate = useMemo(() => {
    const q = ricerca.trim().toLowerCase();
    if (!q) return prenotazioni;
    return prenotazioni.filter(
      (r) =>
        r.nome.toLowerCase().includes(q) || r.telefono.toLowerCase().includes(q),
    );
  }, [prenotazioni, ricerca]);

  return (
    <div>
      <div className="mb-6 max-w-sm">
        <label
          htmlFor="prenotazioni-ricerca"
          className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5"
        >
          Cerca per nome o telefono
        </label>
        <input
          id="prenotazioni-ricerca"
          type="search"
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          placeholder="Es. Rossi, 333…"
          className={searchClass}
        />
      </div>

      {prenotazioni.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Nessuna prenotazione per questa data.
        </p>
      ) : filtrate.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          Nessun risultato per &quot;{ricerca}&quot;.
        </p>
      ) : (
        <div>
          {filtrate.map((riga) => (
            <PrenotazioneRow key={riga.id} riga={riga} />
          ))}
        </div>
      )}
    </div>
  );
}

function PrenotazioneRow({ riga }: { riga: PrenotazioneRiga }) {
  const [stato, setStato] = useState(riga.stato);
  const [isPending, startTransition] = useTransition();

  function handleCambiaStato(nuovo: StatoPrenotazione) {
    const precedente = stato;
    setStato(nuovo);
    startTransition(async () => {
      try {
        await cambiaStatoPrenotazione(riga.id, nuovo);
      } catch (err) {
        setStato(precedente);
        console.error(err);
        window.alert("Errore durante il cambio di stato. Riprova.");
      }
    });
  }

  const statoColore =
    stato === "cancellata" || stato === "no-show"
      ? "text-bordeaux"
      : stato === "completata"
        ? "text-muted"
        : "text-ink";

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-ink/10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-sm text-bordeaux flex-shrink-0">
            {riga.fascia}
          </span>
          <span className="font-serif text-lg font-medium text-ink">
            {riga.nome}
          </span>
        </div>
        <p className="font-sans text-sm text-muted mt-0.5">
          {riga.telefono} · {riga.coperti}{" "}
          {riga.coperti === 1 ? "coperto" : "coperti"}
        </p>
        {riga.note && (
          <p className="font-sans text-sm text-ink mt-1">{riga.note}</p>
        )}
        {riga.risposteExtra.map((r, i) => (
          <p key={i} className="font-sans text-xs text-muted mt-0.5">
            {r.etichetta}: {r.valore}
          </p>
        ))}
      </div>

      <div className="flex-shrink-0">
        <select
          value={stato}
          onChange={(e) => handleCambiaStato(e.target.value as StatoPrenotazione)}
          disabled={isPending}
          aria-label={`Stato prenotazione di ${riga.nome}`}
          className={`${selectClass} ${statoColore}`}
        >
          {STATI.map((s) => (
            <option key={s.valore} value={s.valore}>
              {s.etichetta}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
