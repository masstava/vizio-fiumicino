"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Alcune pagine devono mostrare un controllo (ricerca, azione primaria)
// dentro la topbar della shell — che vive in un componente diverso
// (AdminTopbar, dentro AdminShell) e non riceve props dalla pagina, per
// non introdurre un accoppiamento diretto layout↔pagina. Un portale
// verso un nodo fisso che AdminTopbar espone (vedi `TOPBAR_SLOT_ID`)
// lascia lo stato del controllo esattamente dove vive già (nel
// componente della pagina che lo possiede), spostando solo DOVE
// appare nel DOM — coerente con un passaggio che cambia la
// presentazione, non la logica.
//
// `order` sceglie la posizione orizzontale nello slot (che è un
// flex container) indipendentemente dall'ordine di montaggio dei vari
// portali che vi scrivono: due pagine/componenti diversi che portano
// contenuto nello stesso slot non devono dipendere da quale dei due
// monta per primo.
export const TOPBAR_SLOT_ID = "admin-topbar-slot";

export function TopbarSlot({
  children,
  order,
}: {
  children: React.ReactNode;
  order?: number;
}) {
  // Il nodo target esiste solo lato client (reso da AdminTopbar): il
  // primo render, server compreso, non deve tentare createPortal così
  // da restare identico tra SSR e client — l'effetto forza un secondo
  // render dopo il mount, quando il nodo è garantito presente.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const target = document.getElementById(TOPBAR_SLOT_ID);
  if (!target) return null;

  return createPortal(
    <div style={order != null ? { order } : undefined}>{children}</div>,
    target,
  );
}
