"use client";

import Link from "next/link";
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import { Button } from "@/src/components/ui/Button";

// Azione primaria della lista piatti, spostata nella topbar — § Topbar
// in DASHBOARD_DESIGN_SYSTEM.md: un solo pulsante pieno per vista.
// Nessuna logica propria: stesso link di prima, solo portato nel
// contenitore giusto.
export function NuovoPiattoAction() {
  return (
    <TopbarSlot order={2}>
      <Link href="/gestione/menu/nuovo">
        <Button variant="primary">+ Nuovo piatto</Button>
      </Link>
    </TopbarSlot>
  );
}
