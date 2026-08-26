"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "min-h-11 md:min-h-0 bg-cream border border-ink/20 rounded-[2px] px-3 py-2 font-sans text-sm text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 focus-visible:border-bordeaux/50";

export function SelettoreData({ data, oggi }: { data: string; oggi: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function vaiA(nuovaData: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (nuovaData && nuovaData !== oggi) params.set("data", nuovaData);
    else params.delete("data");
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-4 mb-8">
      <div>
        <label
          htmlFor="prenotazioni-data"
          className="font-sans text-[10px] tracking-widest uppercase text-muted block mb-1.5"
        >
          Data
        </label>
        <input
          id="prenotazioni-data"
          type="date"
          value={data}
          onChange={(e) => vaiA(e.target.value)}
          className={inputClass}
        />
      </div>
      {data !== oggi && (
        <button
          type="button"
          onClick={() => vaiA(oggi)}
          className="inline-flex min-h-11 items-center rounded-[2px] font-sans text-sm text-bordeaux hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux/60 md:min-h-0"
        >
          Torna a oggi
        </button>
      )}
    </div>
  );
}
