import { cn } from "@/src/lib/utils";

// Pillola di stato per la dashboard — § "Badge di stato" in
// DASHBOARD_DESIGN_SYSTEM.md: pallino colorato + testo, mai un blocco
// di sfondo pieno (chi non distingue i colori deve poter leggere lo
// stato dal testo, non solo intuirlo dal colore).
//
// Componente pronto ma non ancora usato da nessuna pagina in questo
// passaggio (1/6, solo shell): /gestione/prenotazioni oggi segnala lo
// stato con un colore di testo sul <select> di cambio-stato, non con
// questa pillola — restyling rimandato al passaggio dedicato a quella
// pagina, per non toccare la logica del cambio-stato in questo giro.
export type StatusBadgeTono = "verde" | "ambra" | "grigio" | "brick";

// Classi scritte per intero, mai costruite con replace()/template a
// runtime: Tailwind genera il CSS analizzando il sorgente per
// stringhe letterali, non eseguendo JavaScript — una classe montata
// concatenando pezzi (es. "text-".replace(...)) non verrebbe mai
// generata e la pillola perderebbe silenziosamente il suo colore.
const TONI: Record<StatusBadgeTono, { testo: string; sfondo: string; pallino: string }> = {
  verde: { testo: "text-admin-green", sfondo: "bg-admin-green-wash", pallino: "bg-admin-green" },
  ambra: { testo: "text-admin-amber", sfondo: "bg-admin-amber-wash", pallino: "bg-admin-amber" },
  grigio: { testo: "text-admin-gray", sfondo: "bg-admin-gray-wash", pallino: "bg-admin-gray" },
  brick: { testo: "text-admin-brick", sfondo: "bg-admin-brick-wash", pallino: "bg-admin-brick" },
};

export function StatusBadge({
  tono,
  children,
  className,
}: {
  tono: StatusBadgeTono;
  children: React.ReactNode;
  className?: string;
}) {
  const t = TONI[tono];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-xs font-medium",
        t.testo,
        t.sfondo,
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", t.pallino)} />
      {children}
    </span>
  );
}
