"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { Toast } from "@/src/components/admin/Toast";
import { SelettoreData } from "./SelettoreData";
import { StriscettaSettimanale, type GiornoStriscia } from "./StriscettaSettimanale";
import {
  PrenotazioniListClient,
  type PrenotazioneRiga,
} from "./PrenotazioniListClient";

interface ToastNuovaPrenotazione {
  titolo: string;
  descrizione: string;
}

// Un'unica sottoscrizione Realtime per tutta la sezione Prenotazioni,
// aperta al montaggio e chiusa allo smontaggio (che avviene quando si
// lascia /gestione/prenotazioni per un'altra voce della dashboard) —
// mai una per ogni cambio di giorno nella striscia. Per questo la
// sottoscrizione vive QUI, nel componente stabile che avvolge tutta la
// sezione, e non dentro PrenotazioniListClient (che invece si
// rimonta a ogni cambio di data, key={dataSelezionata}: se il canale
// vivesse lì, verrebbe chiuso e riaperto a ogni clic sulla striscia).
export function SezionePrenotazioniClient({
  oggi,
  dataSelezionata,
  giorniIniziali,
  prenotazioni,
  prenotazioniAttive,
  copertiTotali,
  noShow,
}: {
  oggi: string;
  dataSelezionata: string;
  giorniIniziali: GiornoStriscia[];
  prenotazioni: PrenotazioneRiga[];
  prenotazioniAttive: number;
  copertiTotali: number;
  noShow: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [giorni, setGiorni] = useState(giorniIniziali);
  const [calendarioAperto, setCalendarioAperto] = useState(false);
  const [toast, setToast] = useState<ToastNuovaPrenotazione | null>(null);

  // Riallinea la striscia ai dati freschi del server a ogni nuova
  // navigazione (cambio di giorno, ricarica) — l'aggiornamento in
  // tempo reale sotto copre solo l'intervallo TRA una navigazione e
  // l'altra, non lo sostituisce.
  useEffect(() => {
    setGiorni(giorniIniziali);
  }, [giorniIniziali]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("prenotazioni-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "prenotazioni" },
        (payload) => {
          const nuova = payload.new as {
            nome: string;
            fascia: string;
            coperti: number;
            data: string;
          };

          setToast({
            titolo: "Nuova prenotazione",
            descrizione: `${nuova.nome} · ${nuova.fascia.slice(0, 5)} · ${nuova.coperti} ${
              nuova.coperti === 1 ? "coperto" : "coperti"
            }`,
          });

          // Solo se il giorno è tra i 7 mostrati dalla striscia — una
          // prenotazione per una data più lontana non ha una cella da
          // aggiornare qui. Ogni riga inserita parte sempre con
          // stato='confermata' (default di colonna) e vista=false, per
          // questo si somma sempre ai coperti e si incrementa sempre
          // non viste, senza dover rileggere quei due campi dal payload.
          setGiorni((prev) =>
            prev.map((g) =>
              g.data === nuova.data
                ? { ...g, coperti: g.coperti + nuova.coperti, nonViste: g.nonViste + 1 }
                : g,
            ),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function vaiA(nuovaData: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nuovaData && nuovaData !== oggi) params.set("data", nuovaData);
    else params.delete("data");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  function handlePrenotazioneVista(dataRiga: string) {
    setGiorni((prev) =>
      prev.map((g) => (g.data === dataRiga ? { ...g, nonViste: Math.max(0, g.nonViste - 1) } : g)),
    );
  }

  const totaleNonViste = giorni.reduce((acc, g) => acc + g.nonViste, 0);

  return (
    <div>
      {toast && (
        <Toast
          titolo={toast.titolo}
          descrizione={toast.descrizione}
          onClose={() => setToast(null)}
        />
      )}

      <StriscettaSettimanale
        giorni={giorni}
        oggi={oggi}
        dataSelezionata={dataSelezionata}
        onSeleziona={vaiA}
      />

      <div className="mt-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-sm text-admin-text-2">
          {totaleNonViste === 0
            ? "Nessuna prenotazione da aprire questa settimana."
            : `${totaleNonViste} ${
                totaleNonViste === 1 ? "prenotazione non ancora aperta" : "prenotazioni non ancora aperte"
              } questa settimana.`}
        </p>
        <button
          type="button"
          onClick={() => setCalendarioAperto((v) => !v)}
          aria-expanded={calendarioAperto}
          className="inline-flex min-h-11 items-center rounded-[2px] font-sans text-sm text-admin-brick hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 md:min-h-0"
        >
          {calendarioAperto ? "Nascondi calendario" : "Apri calendario completo"}
        </button>
      </div>

      {calendarioAperto && <SelettoreData data={dataSelezionata} oggi={oggi} />}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-2xl">
        <StatTile numero={prenotazioniAttive} etichetta="Prenotazioni" />
        <StatTile numero={copertiTotali} etichetta="Coperti totali" />
        <StatTile numero={noShow} etichetta="No-show" />
      </div>

      {/* key={dataSelezionata}: vedi il commento originale in page.tsx
          — la lista tiene stato locale proprio (righe, pannello di
          dettaglio) che deve ripartire da zero a ogni cambio di
          giorno. Il resto di questo componente (striscia, canale
          Realtime, toast) NON è keyato: deve restare montato e vivo
          attraverso i cambi di giorno. */}
      <PrenotazioniListClient
        key={dataSelezionata}
        prenotazioni={prenotazioni}
        data={dataSelezionata}
        onPrenotazioneVista={handlePrenotazioneVista}
      />
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
