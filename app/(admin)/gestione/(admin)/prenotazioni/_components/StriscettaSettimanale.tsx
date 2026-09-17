"use client";

import { cn } from "@/src/lib/utils";

export interface GiornoStriscia {
  /** "YYYY-MM-DD" */
  data: string;
  coperti: number;
  /** Quante prenotazioni di questo giorno hanno vista=false. */
  nonViste: number;
}

// Un tono di bordo per ciascuno dei 6 giorni dopo oggi (offset 1..6):
// l'unico modo per rendere visiva l'idea di "più lontano, meno
// rilevante" SENZA intaccare il contrasto del testo è applicare
// l'opacità solo al bordo (decorativo), mai al testo — il numero del
// giorno e i coperti restano sempre a piena leggibilità, offset 0
// incluso. Classi scritte per intero (mai costruite a runtime): sono
// letterali, Tailwind le trova analizzando il sorgente.
const BORDO_SFUMATO: Record<number, string> = {
  1: "border-admin-line",
  2: "border-admin-line/80",
  3: "border-admin-line/65",
  4: "border-admin-line/50",
  5: "border-admin-line/35",
  6: "border-admin-line/20",
};

function etichettaGiorno(dataISO: string): { giorno: string; numero: string } {
  const d = new Date(`${dataISO}T00:00:00Z`);
  const giorno = new Intl.DateTimeFormat("it-IT", { weekday: "short", timeZone: "UTC" }).format(d);
  const numero = new Intl.DateTimeFormat("it-IT", { day: "numeric", timeZone: "UTC" }).format(d);
  return { giorno, numero };
}

export function StriscettaSettimanale({
  giorni,
  oggi,
  dataSelezionata,
  onSeleziona,
}: {
  giorni: GiornoStriscia[];
  oggi: string;
  dataSelezionata: string;
  onSeleziona: (data: string) => void;
}) {
  return (
    // Sotto sm, 7 colonne davvero equidistanti scenderebbero sotto i
    // 44px di tap target minimo (§ DEFINITION_OF_DONE) — qui diventa
    // una riga che scorre in orizzontale DENTRO il proprio contenitore
    // (min-w-[52px] fisso per cella), non la pagina intera: lo scroll
    // della pagina resta verticale come ovunque. Da sm in su, la griglia
    // a 7 colonne ha comunque colonne ben oltre i 44px, quindi torna
    // un grid pieno, senza scroll.
    <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible sm:px-0">
      <div
        role="group"
        aria-label="Settimana, oggi e i 6 giorni successivi"
        className="flex gap-1.5 sm:grid sm:grid-cols-7 sm:gap-2"
      >
      {giorni.map((g, i) => {
        const isOggi = g.data === oggi;
        const isSelezionato = g.data === dataSelezionata;
        const { giorno, numero } = etichettaGiorno(g.data);

        const etichettaCompleta = [
          `${giorno} ${numero}`,
          `${g.coperti} ${g.coperti === 1 ? "coperto prenotato" : "coperti prenotati"}`,
          g.nonViste > 0
            ? `${g.nonViste} ${g.nonViste === 1 ? "non ancora aperta" : "non ancora aperte"}`
            : null,
        ]
          .filter(Boolean)
          .join(", ");

        return (
          <button
            key={g.data}
            type="button"
            onClick={() => onSeleziona(g.data)}
            aria-pressed={isSelezionato}
            aria-label={etichettaCompleta}
            className={cn(
              "relative flex min-h-11 min-w-[52px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-[2px] border bg-admin-surface px-1 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 sm:min-w-0 sm:flex-shrink",
              isSelezionato
                ? "border-2 border-admin-brick bg-admin-brick-wash"
                : isOggi
                  ? "border-2 border-admin-brick"
                  : BORDO_SFUMATO[i] ?? "border-admin-line",
            )}
          >
            {g.nonViste > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-admin-amber ring-2 ring-admin-canvas"
              />
            )}
            <span className="font-sans text-[10px] uppercase tracking-wide text-admin-text-2">
              {giorno}
            </span>
            <span className="font-sans text-base font-semibold text-admin-text sm:text-lg">
              {numero}
            </span>
            <span className="inline-flex items-center rounded-full bg-admin-canvas px-1.5 py-0.5 font-sans text-[10px] font-medium text-admin-text-2">
              {g.coperti}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
