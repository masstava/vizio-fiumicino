"use client";

import { m } from "motion/react";

// Comparsa in dissolvenza con una risalita minima, allo scorrimento.
//
// Vincoli rispettati:
//
// - Nessun salto di layout (CLS): si animano solo opacity e transform,
//   che non rientrano nel flusso. L'elemento occupa il suo spazio
//   definitivo fin dal primo render.
//
// - Nessun ritardo sul primo contenuto utile (LCP): questo wrapper NON
//   va usato sopra la piega. L'hero resta senza animazione, altrimenti
//   l'elemento più grande della pagina partirebbe invisibile e l'LCP
//   slitterebbe di conseguenza.
//
// - prefers-reduced-motion: gestito in CSS (app/globals.css), non
//   qui. Il server non sa quale preferenza abbia l'utente, quindi una
//   scelta fatta in JavaScript arriverebbe solo dopo l'idratazione e
//   nel frattempo il contenuto resterebbe invisibile proprio a chi ha
//   chiesto meno movimento. La regola CSS agisce dal primo paint.
//
// - once: true — l'animazione non si ripete a ogni passaggio: uno
//   sfarfallio a ogni scroll su e giù sarebbe fastidioso, e ogni
//   ripetizione è lavoro inutile per il thread principale.
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Ritardo in secondi, per scalare più elementi in sequenza. */
  delay?: number;
  className?: string;
}) {
  return (
    <m.div
      // data-reveal: aggancio per la regola <noscript> nel layout, che
      // rende visibile il contenuto se JavaScript non parte. Senza,
      // resterebbe a opacità 0 per sempre.
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.45, ease: [0.22, 0.61, 0.36, 1], delay }}
    >
      {children}
    </m.div>
  );
}
