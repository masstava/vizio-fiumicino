"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { leggiConsenso, scriviConsenso } from "@/src/lib/consenso/archivio";
import { aggiornaConsentMode } from "@/src/lib/consenso/consent-mode";
import { TUTTO_CONCESSO, TUTTO_NEGATO, type Scelte } from "@/src/lib/consenso/tipi";

// Stato del consenso per l'intero sito pubblico.
//
// "letto" parte a false e diventa true solo dopo il montaggio: il
// server non può sapere cosa c'è in localStorage, quindi qualunque
// cosa dipenda dal consenso non va renderizzata lato server. Senza
// questa attesa il markup del server e quello del client
// divergerebbero e React scarterebbe l'idratazione.
interface Consenso {
  /** false finché non si è letto lo storage: non decidere nulla prima. */
  letto: boolean;
  /** true se l'utente ha già espresso una scelta valida e non scaduta. */
  deciso: boolean;
  scelte: Scelte;
  bannerVisibile: boolean;
  preferenzeAperte: boolean;
  apriPreferenze: () => void;
  chiudiPreferenze: () => void;
  accettaTutti: () => void;
  rifiutaTutti: () => void;
  salva: (scelte: Scelte) => void;
}

const ConsensoContext = createContext<Consenso | null>(null);

export function ConsensoProvider({ children }: { children: React.ReactNode }) {
  const [letto, setLetto] = useState(false);
  const [deciso, setDeciso] = useState(false);
  const [scelte, setScelte] = useState<Scelte>(TUTTO_NEGATO);
  const [preferenzeAperte, setPreferenzeAperte] = useState(false);

  useEffect(() => {
    const salvato = leggiConsenso();
    if (salvato) {
      setScelte(salvato.scelte);
      setDeciso(true);
    }
    setLetto(true);
  }, []);

  const salva = useCallback((nuove: Scelte) => {
    const record = scriviConsenso(nuove);
    setScelte(record.scelte);
    setDeciso(true);
    setPreferenzeAperte(false);
    aggiornaConsentMode(record.scelte);
  }, []);

  const valore = useMemo<Consenso>(
    () => ({
      letto,
      deciso,
      scelte,
      // Il banner non compare mentre il modale è aperto: sarebbe
      // coperto e continuerebbe a chiedere una cosa che l'utente sta
      // già facendo. Chiudendo il modale senza salvare torna, perché
      // "deciso" è ancora false.
      bannerVisibile: letto && !deciso && !preferenzeAperte,
      preferenzeAperte,
      apriPreferenze: () => setPreferenzeAperte(true),
      // Chiusura SENZA salvare: nessuna scrittura, nessun consenso.
      // È il punto richiesto dalle Linee guida del Garante del
      // 10/06/2021 — chiudere non vale come accettare.
      chiudiPreferenze: () => setPreferenzeAperte(false),
      accettaTutti: () => salva(TUTTO_CONCESSO),
      rifiutaTutti: () => salva(TUTTO_NEGATO),
      salva,
    }),
    [letto, deciso, scelte, preferenzeAperte, salva],
  );

  return (
    <ConsensoContext.Provider value={valore}>{children}</ConsensoContext.Provider>
  );
}

export function useConsenso(): Consenso {
  const c = useContext(ConsensoContext);
  if (!c) {
    throw new Error("useConsenso va usato dentro <ConsensoProvider>");
  }
  return c;
}

/** Variante che non lancia: per componenti montati anche fuori dal sito pubblico. */
export function useConsensoOpzionale(): Consenso | null {
  return useContext(ConsensoContext);
}
