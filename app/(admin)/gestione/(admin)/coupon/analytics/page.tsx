import { createClient } from "@/src/lib/supabase/server";
import { SchedeCoupon } from "../_components/SchedeCoupon";
import { FiltroDataAnalytics } from "../_components/FiltroDataAnalytics";

export const dynamic = "force-dynamic";

const FORMATO_DATA = /^\d{4}-\d{2}-\d{2}$/;

type Tipo = "newsletter" | "campagna";

export default async function CouponAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ da?: string; a?: string }>;
}) {
  const { da: daParam, a: aParam } = await searchParams;
  const da = daParam && FORMATO_DATA.test(daParam) ? daParam : null;
  const a = aParam && FORMATO_DATA.test(aParam) ? aParam : null;

  const supabase = await createClient();

  // Due letture indipendenti: partono insieme. Niente filtro data lato
  // query — l'intervallo tocca due colonne diverse (creato_il per gli
  // emessi, utilizzato_il per i riscatti) e i volumi in gioco per una
  // dashboard di un solo locale non giustificano una RPC di aggregato
  // dedicata: si filtra qui, sulle due liste già lette.
  const [{ data: coupons }, { data: utilizzi }] = await Promise.all([
    supabase.from("coupon").select("id, tipo, creato_il"),
    supabase.from("coupon_utilizzi").select("coupon_id, utilizzato_il"),
  ]);

  const tipoById = new Map((coupons ?? []).map((c) => [c.id, c.tipo as Tipo]));

  function nelPeriodo(timestamp: string): boolean {
    const giorno = timestamp.slice(0, 10);
    if (da && giorno < da) return false;
    if (a && giorno > a) return false;
    return true;
  }

  const emessi: Record<Tipo, number> = { newsletter: 0, campagna: 0 };
  (coupons ?? [])
    .filter((c) => nelPeriodo(c.creato_il))
    .forEach((c) => {
      emessi[c.tipo as Tipo] = (emessi[c.tipo as Tipo] ?? 0) + 1;
    });

  const riscattati: Record<Tipo, number> = { newsletter: 0, campagna: 0 };
  (utilizzi ?? [])
    .filter((u) => nelPeriodo(u.utilizzato_il))
    .forEach((u) => {
      const tipo = tipoById.get(u.coupon_id);
      if (tipo) riscattati[tipo] = (riscattati[tipo] ?? 0) + 1;
    });

  const totaleEmessi = emessi.newsletter + emessi.campagna;
  const totaleRiscattati = riscattati.newsletter + riscattati.campagna;

  return (
    <div className="p-8 md:p-12">
      <SchedeCoupon />
      <FiltroDataAnalytics da={da} a={a} />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl">
        <StatTile numero={totaleEmessi} etichetta="Coupon emessi" />
        <StatTile numero={totaleRiscattati} etichetta="Coupon riscattati" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl">
        <DettaglioTipo titolo="Newsletter" emessi={emessi.newsletter} riscattati={riscattati.newsletter} />
        <DettaglioTipo titolo="Campagna" emessi={emessi.campagna} riscattati={riscattati.campagna} />
      </div>
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

function DettaglioTipo({
  titolo,
  emessi,
  riscattati,
}: {
  titolo: string;
  emessi: number;
  riscattati: number;
}) {
  return (
    <div className="rounded-[2px] border border-admin-line bg-admin-surface p-5">
      <h3 className="font-serif text-lg font-medium text-admin-text mb-3">{titolo}</h3>
      <dl className="space-y-1.5">
        <div className="flex justify-between gap-4">
          <dt className="font-sans text-sm text-admin-text-2">Emessi</dt>
          <dd className="font-sans text-sm font-medium text-admin-text">{emessi}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="font-sans text-sm text-admin-text-2">Riscattati</dt>
          <dd className="font-sans text-sm font-medium text-admin-text">{riscattati}</dd>
        </div>
      </dl>
    </div>
  );
}
