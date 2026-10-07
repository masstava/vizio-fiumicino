"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";

// Registro degli elementi che occupano lo schermo sopra al contenuto:
// popup newsletter di fine scroll, banner cookie (CMP), e in futuro
// qualunque altro pannello a tutta pagina.
//
// Serve a evitare che il bottone WhatsApp resti appeso sopra un banner
// che l'utente deve poter leggere e chiudere — o peggio, che ne copra
// il pulsante di consenso.
//
// AL MOMENTO NESSUNO REGISTRA NULLA: né il popup newsletter né il CMP
// esistono ancora, arrivano in uno step dedicato. Il registro è già
// qui perché il bottone possa rispettarlo fin da subito: quando quei
// due componenti verranno scritti dovranno solo chiamare
// useRegistraOverlay(true) mentre sono visibili, senza che il bottone
// venga toccato di nuovo.
//
// Il conteggio è un numero e non un booleano: due overlay
// contemporanei che si chiudono uno alla volta non devono far
// ricomparire il bottone finché è aperto ancora il secondo.

interface Registro {
  attivi: number;
  registra: () => void;
  rimuovi: () => void;
}

const OverlayContext = createContext<Registro | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [attivi, setAttivi] = useState(0);

  const registra = useCallback(() => setAttivi((n) => n + 1), []);
  const rimuovi = useCallback(() => setAttivi((n) => Math.max(0, n - 1)), []);

  const valore = useMemo(
    () => ({ attivi, registra, rimuovi }),
    [attivi, registra, rimuovi],
  );

  return (
    <OverlayContext.Provider value={valore}>{children}</OverlayContext.Provider>
  );
}

/** true se c'è almeno un overlay aperto. Fuori dal provider: false. */
export function useOverlayAttivo(): boolean {
  return (useContext(OverlayContext)?.attivi ?? 0) > 0;
}

/**
 * Da chiamare dai futuri popup newsletter e banner cookie:
 *
 *   useRegistraOverlay(visibile);
 *
 * Finché è true il bottone WhatsApp resta nascosto.
 */
export function useRegistraOverlay(attivo: boolean): void {
  const registro = useContext(OverlayContext);
  const registra = registro?.registra;
  const rimuovi = registro?.rimuovi;

  // Layout effect, non useEffect: gira prima del paint, quindi non c'è
  // un frame in cui overlay e bottone sono visibili insieme. Prima la
  // registrazione avveniva DURANTE il render (setState nel corpo del
  // componente): se React scartava e ripeteva quel render, il
  // conteggio saliva due volte e scendeva una sola, e il bottone
  // WhatsApp non tornava più fino al ricaricamento. Così ogni
  // registrazione ha la sua rimozione, qualunque cosa faccia React.
  useLayoutEffect(() => {
    if (!attivo || !registra || !rimuovi) return;
    registra();
    return rimuovi;
  }, [attivo, registra, rimuovi]);
}
