"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";

// Estratto in un file a parte per poter essere caricato su richiesta:
// il Popover porta con sé Floating UI, il motore di posizionamento,
// che da solo pesa più di tutto il resto della pagina messo insieme.
//
// In home gli allergeni non arrivano mai (l'anteprima non li legge di
// proposito), quindi senza questo taglio si scaricherebbe un motore
// di posizionamento per una funzione che su quella pagina non compare.
export function AllergeniPopover({
  etichetta,
  allergeni,
}: {
  etichetta: string;
  allergeni: string[];
}) {
  return (
    <Popover>
      <PopoverTrigger className="font-sans text-xs tracking-widest uppercase text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {etichetta}
      </PopoverTrigger>
      {/* Popover e non tooltip: l'elenco deve restare leggibile anche
          da telefono, dove l'hover non esiste. */}
      <PopoverContent align="start">
        <ul className="space-y-1 font-sans text-xs leading-relaxed">
          {allergeni.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
