"use client";

import Link from "next/link";
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import { Button } from "@/src/components/ui/Button";

// Azione primaria della lista eventi, spostata nella topbar — § Topbar
// in DASHBOARD_DESIGN_SYSTEM.md: un solo pulsante pieno per vista.
// Nessuna logica propria: stesso link di prima, solo portato nel
// contenitore giusto (stesso schema di NuovoPiattoAction in
// gestione/menu).
export function NuovoEventoAction() {
  return (
    <TopbarSlot order={2}>
      <Link href="/gestione/eventi/nuovo">
        <Button variant="primary">+ Nuovo evento</Button>
      </Link>
    </TopbarSlot>
  );
}
