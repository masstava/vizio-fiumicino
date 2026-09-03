"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { creaCouponCampagna } from "../_actions";

const inputClass =
  "w-full min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text placeholder:text-admin-text-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

const labelClass = "block mb-1.5 font-sans text-xs font-medium text-admin-text";

// Solo creazione: niente modifica/eliminazione qui, di proposito —
// § 6 chiede "niente di più elaborato". Un coupon campagna sbagliato
// si disattiva a mano nel database finché non serve un'azione
// dedicata (nessuna richiesta reale oggi la giustifica).
export function CouponForm() {
  const router = useRouter();

  const [codice, setCodice] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [validoDal, setValidoDal] = useState("");
  const [validoAl, setValidoAl] = useState("");
  const [utilizzoMassimo, setUtilizzoMassimo] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!codice.trim()) {
      setError("Il codice è obbligatorio.");
      return;
    }
    if (!descrizione.trim()) {
      setError("La descrizione è obbligatoria per un coupon campagna.");
      return;
    }
    if (validoDal && validoAl && validoDal > validoAl) {
      setError("La data di inizio non può essere dopo la data di fine.");
      return;
    }

    setSaving(true);
    try {
      const esito = await creaCouponCampagna({
        codice,
        descrizione,
        validoDal: validoDal || null,
        validoAl: validoAl || null,
        utilizzoMassimo: utilizzoMassimo.trim() ? Number(utilizzoMassimo) : null,
      });

      if (!esito.ok) {
        setError(esito.messaggio);
        return;
      }

      router.push("/gestione/coupon");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="cp-codice" className={labelClass}>
          Codice
        </label>
        <input
          id="cp-codice"
          type="text"
          required
          value={codice}
          onChange={(e) => setCodice(e.target.value)}
          placeholder="Es. PROMOSVALE"
          className={`${inputClass} font-mono uppercase`}
        />
        <p className="mt-1 font-sans text-xs text-admin-text-2">
          Come lo digiterà lo staff in cassa — maiuscolo, senza spazi.
        </p>
      </div>

      <div>
        <label htmlFor="cp-descrizione" className={labelClass}>
          Descrizione
        </label>
        <textarea
          id="cp-descrizione"
          rows={2}
          required
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          placeholder="Es. -20% sul conto per gli eventi di settembre"
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cp-valido-dal" className={labelClass}>
            Valido dal
          </label>
          <input
            id="cp-valido-dal"
            type="date"
            value={validoDal}
            onChange={(e) => setValidoDal(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 font-sans text-xs text-admin-text-2">Vuoto = subito valido.</p>
        </div>
        <div>
          <label htmlFor="cp-valido-al" className={labelClass}>
            Valido al
          </label>
          <input
            id="cp-valido-al"
            type="date"
            value={validoAl}
            onChange={(e) => setValidoAl(e.target.value)}
            className={inputClass}
          />
          <p className="mt-1 font-sans text-xs text-admin-text-2">Vuoto = nessuna scadenza.</p>
        </div>
      </div>

      <div>
        <label htmlFor="cp-utilizzo-massimo" className={labelClass}>
          Tetto utilizzi
        </label>
        <input
          id="cp-utilizzo-massimo"
          type="number"
          min={1}
          value={utilizzoMassimo}
          onChange={(e) => setUtilizzoMassimo(e.target.value)}
          placeholder="Illimitato"
          className={`${inputClass} sm:w-40`}
        />
        <p className="mt-1 font-sans text-xs text-admin-text-2">
          Quante volte in totale può essere riscattato. Vuoto = illimitato.
        </p>
      </div>

      {error && <p className="font-sans text-sm text-admin-brick">{error}</p>}

      <Button type="submit" variant="primary" disabled={saving}>
        {saving ? "Salvataggio…" : "Crea coupon"}
      </Button>
    </form>
  );
}
