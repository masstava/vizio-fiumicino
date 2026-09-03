"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "min-h-11 md:min-h-0 bg-admin-surface border border-admin-line rounded-[2px] px-3 py-2 font-sans text-sm text-admin-text transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 focus-visible:border-admin-brick/50";

// Stesso principio di SelettoreData.tsx in /gestione/prenotazioni: la
// data (qui, un intervallo) vive nell'URL, non in uno stato client —
// condivisibile e compatibile col tasto indietro del browser.
export function FiltroDataAnalytics({ da, a }: { da: string | null; a: string | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function aggiorna(campo: "da" | "a", valore: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valore) params.set(campo, valore);
    else params.delete(campo);
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="mb-8 flex flex-wrap items-end gap-4">
      <div>
        <label
          htmlFor="coupon-analytics-da"
          className="font-sans text-[10px] tracking-widest uppercase text-admin-text-2 block mb-1.5"
        >
          Da
        </label>
        <input
          id="coupon-analytics-da"
          type="date"
          value={da ?? ""}
          onChange={(e) => aggiorna("da", e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="coupon-analytics-a"
          className="font-sans text-[10px] tracking-widest uppercase text-admin-text-2 block mb-1.5"
        >
          A
        </label>
        <input
          id="coupon-analytics-a"
          type="date"
          value={a ?? ""}
          onChange={(e) => aggiorna("a", e.target.value)}
          className={inputClass}
        />
      </div>
      {(da || a) && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="inline-flex min-h-11 items-center rounded-[2px] font-sans text-sm text-admin-brick hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-brick/60 md:min-h-0"
        >
          Azzera periodo
        </button>
      )}
    </div>
  );
}
