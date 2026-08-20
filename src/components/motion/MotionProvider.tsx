"use client";

import { LazyMotion, domAnimation } from "motion/react";

// Carica solo il sottoinsieme di funzioni di Motion che serve
// davvero (animazioni DOM: opacità, trasformazioni, gesti). L'import
// completo porterebbe dentro anche layout animation e drag, che qui
// non si usano — su una home il peso del bundle è tempo di caricamento.
//
// I figli restano componenti server: questo wrapper fornisce solo il
// contesto, non li trasforma in client.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
