"use client";

import Link from "next/link";
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import { Button } from "@/src/components/ui/Button";

// Azione primaria della lista coupon, in topbar — stesso schema di
// NuovoEventoAction. order=2: la ricerca/i filtri della lista (order=1,
// montati da CouponListClient) restano a sinistra di questo pulsante.
export function NuovoCouponAction() {
  return (
    <TopbarSlot order={2}>
      <Link href="/gestione/coupon/nuovo">
        <Button variant="primary">+ Nuovo coupon campagna</Button>
      </Link>
    </TopbarSlot>
  );
}
