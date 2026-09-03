"use client";

import { useMemo, useState, useTransition } from "react";
import { TopbarSlot } from "@/src/components/admin/TopbarSlot";
import { StatusBadge } from "@/src/components/admin/StatusBadge";
import { segnaComeUsato, type MotivoRiscattoFallito } from "../_actions";
import { ETICHETTA_STATO_COUPON, statoCoupon, TONO_STATO_COUPON, type StatoCoupon } from "./stati";

export interface CouponRiga {
  id: string;
  codice: string;
  tipo: "newsletter" | "campagna";
  descrizione: string | null;
  email: string | null;
  /** "YYYY-MM-DD" o null. */
  validoDal: string | null;
  /** "YYYY-MM-DD" o null. */
  validoAl: string | null;
  utilizzoMassimo: number | null;
  attivo: boolean;
  utilizzi: number;
}

const selectClass =
  "min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

const MOTIVO_TESTO: Record<MotivoRiscattoFallito, string> = {
  scaduto: "Coupon scaduto.",
  esaurito: "Coupon già esaurito: nessun utilizzo residuo.",
  disattivato: "Coupon disattivato.",
  non_trovato: "Codice non trovato.",
  non_ancora_valido: "Il coupon non è ancora valido.",
  sconosciuto: "Errore durante il riscatto. Riprova.",
};

export function CouponListClient({
  coupons: iniziali,
  oggi,
}: {
  coupons: CouponRiga[];
  /** "YYYY-MM-DD", fuso di Roma. */
  oggi: string;
}) {
  const [coupons, setCoupons] = useState(iniziali);
  const [filtroTipo, setFiltroTipo] = useState<"tutti" | "newsletter" | "campagna">("tutti");
  const [filtroStato, setFiltroStato] = useState<"tutti" | StatoCoupon>("tutti");
  const [isPending, startTransition] = useTransition();

  const filtrati = useMemo(() => {
    return coupons.filter((c) => {
      if (filtroTipo !== "tutti" && c.tipo !== filtroTipo) return false;
      if (filtroStato !== "tutti" && statoCoupon(c, oggi) !== filtroStato) return false;
      return true;
    });
  }, [coupons, filtroTipo, filtroStato, oggi]);

  function handleSegnaComeUsato(riga: CouponRiga) {
    // Aggiornamento ottimistico: un riscatto riuscito non cambia
    // nessun altro campo visibile della riga se non il conteggio
    // utilizzi (e, di conseguenza, forse lo stato "esaurito").
    setCoupons((prev) =>
      prev.map((c) => (c.id === riga.id ? { ...c, utilizzi: c.utilizzi + 1 } : c)),
    );
    startTransition(async () => {
      const esito = await segnaComeUsato(riga.codice);
      if (!esito.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === riga.id ? { ...c, utilizzi: c.utilizzi - 1 } : c)),
        );
        window.alert(MOTIVO_TESTO[esito.motivo]);
      }
    });
  }

  return (
    <div>
      <TopbarSlot order={1}>
        <label htmlFor="coupon-filtro-tipo" className="sr-only">
          Filtra per tipo
        </label>
        <select
          id="coupon-filtro-tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as typeof filtroTipo)}
          className={selectClass}
        >
          <option value="tutti">Tutti i tipi</option>
          <option value="newsletter">Newsletter</option>
          <option value="campagna">Campagna</option>
        </select>

        <label htmlFor="coupon-filtro-stato" className="sr-only">
          Filtra per stato
        </label>
        <select
          id="coupon-filtro-stato"
          value={filtroStato}
          onChange={(e) => setFiltroStato(e.target.value as typeof filtroStato)}
          className={selectClass}
        >
          <option value="tutti">Tutti gli stati</option>
          {(Object.keys(ETICHETTA_STATO_COUPON) as StatoCoupon[]).map((stato) => (
            <option key={stato} value={stato}>
              {ETICHETTA_STATO_COUPON[stato]}
            </option>
          ))}
        </select>
      </TopbarSlot>

      {coupons.length === 0 ? (
        <p className="font-sans text-sm text-admin-text-2">
          Nessun coupon creato. Usa &quot;+ Nuovo coupon campagna&quot; per iniziare, oppure
          attendi la prima iscrizione alla newsletter.
        </p>
      ) : filtrati.length === 0 ? (
        <p className="font-sans text-sm text-admin-text-2">
          Nessun coupon corrisponde ai filtri scelti.
        </p>
      ) : (
        <div className="divide-y divide-admin-line overflow-hidden rounded-[2px] border border-admin-line bg-admin-surface">
          {filtrati.map((riga) => (
            <CouponRow
              key={riga.id}
              riga={riga}
              oggi={oggi}
              isPending={isPending}
              onSegnaComeUsato={() => handleSegnaComeUsato(riga)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CouponRow({
  riga,
  oggi,
  isPending,
  onSegnaComeUsato,
}: {
  riga: CouponRiga;
  oggi: string;
  isPending: boolean;
  onSegnaComeUsato: () => void;
}) {
  const stato = statoCoupon(riga, oggi);
  const puoRiscattare = stato === "attivo";

  return (
    <div className="flex flex-col gap-3 px-4 py-4 hover:bg-admin-canvas transition-colors sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-sm text-admin-brick flex-shrink-0">{riga.codice}</span>
          <span className="font-sans text-[10px] tracking-widest uppercase text-admin-text-2">
            {riga.tipo === "newsletter" ? "Newsletter" : "Campagna"}
          </span>
        </div>
        <p className="font-sans text-sm text-admin-text mt-0.5">
          {riga.tipo === "newsletter" ? riga.email : riga.descrizione}
        </p>
        <p className="font-sans text-xs text-admin-text-2 mt-1">
          {riga.validoDal || riga.validoAl
            ? [
                riga.validoDal ? `dal ${riga.validoDal}` : null,
                riga.validoAl ? `al ${riga.validoAl}` : null,
              ]
                .filter(Boolean)
                .join(" ")
            : "Senza scadenza"}
          {" · "}
          {riga.utilizzoMassimo != null
            ? `${riga.utilizzi}/${riga.utilizzoMassimo} utilizzi`
            : `${riga.utilizzi} ${riga.utilizzi === 1 ? "utilizzo" : "utilizzi"}`}
        </p>
      </div>

      <div className="flex flex-shrink-0 items-center gap-4">
        <StatusBadge tono={TONO_STATO_COUPON[stato]}>{ETICHETTA_STATO_COUPON[stato]}</StatusBadge>
        <button
          type="button"
          disabled={isPending || !puoRiscattare}
          onClick={onSegnaComeUsato}
          className="inline-flex min-h-11 items-center font-sans text-sm text-admin-brick transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40 md:min-h-0"
        >
          Segna come usato
        </button>
      </div>
    </div>
  );
}
