import { createClient } from "@/src/lib/supabase/server";
import { oggiEOraRoma } from "@/src/lib/prenotazioni/disponibilita";
import { SchedeCoupon } from "./_components/SchedeCoupon";
import { NuovoCouponAction } from "./_components/NuovoCouponAction";
import { CouponListClient, type CouponRiga } from "./_components/CouponListClient";

export const dynamic = "force-dynamic";

export default async function CouponPage() {
  const supabase = await createClient();
  const oggi = oggiEOraRoma().data;

  // Due letture indipendenti: partono insieme. coupon_utilizzi non ha
  // una colonna di aggregato pronta — si contano le righe qui, non
  // servono altri campi oltre a coupon_id.
  const [{ data: coupons }, { data: utilizzi }] = await Promise.all([
    supabase
      .from("coupon")
      .select(
        "id, codice, tipo, descrizione, email, valido_dal, valido_al, utilizzo_massimo, attivo",
      )
      .order("creato_il", { ascending: false }),
    supabase.from("coupon_utilizzi").select("coupon_id"),
  ]);

  const conteggioUtilizzi = new Map<string, number>();
  (utilizzi ?? []).forEach((u) => {
    conteggioUtilizzi.set(u.coupon_id, (conteggioUtilizzi.get(u.coupon_id) ?? 0) + 1);
  });

  const righe: CouponRiga[] = (coupons ?? []).map((c) => ({
    id: c.id,
    codice: c.codice,
    tipo: c.tipo as "newsletter" | "campagna",
    descrizione: c.descrizione,
    email: c.email,
    validoDal: c.valido_dal,
    validoAl: c.valido_al,
    utilizzoMassimo: c.utilizzo_massimo,
    attivo: c.attivo,
    utilizzi: conteggioUtilizzi.get(c.id) ?? 0,
  }));

  return (
    <div className="p-8 md:p-12">
      <SchedeCoupon />
      <NuovoCouponAction />
      <CouponListClient coupons={righe} oggi={oggi} />
    </div>
  );
}
