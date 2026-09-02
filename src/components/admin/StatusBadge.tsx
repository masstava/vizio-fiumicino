import { cn } from "@/src/lib/utils";

// Pillola di stato per la dashboard — § "Badge di stato" in
// DASHBOARD_DESIGN_SYSTEM.md: pallino colorato + testo, mai un blocco
// di sfondo pieno (chi non distingue i colori deve poter leggere lo
// stato dal testo, non solo intuirlo dal colore).
//
// Usato direttamente qui per gli stati di sola lettura, e come
// mattone visivo di StatusToggle (stato binario, dentro un
// <button role="switch">). StatusSelect (stato a N valori) riusa lo
// stesso TONI esportato qui sotto invece di tenerne una copia propria:
// un'unica lista di colori, aggiornarla in un solo punto.
export type StatusBadgeTono = "verde" | "ambra" | "grigio" | "brick";

// Classi scritte per intero, mai costruite con replace()/template a
// runtime: Tailwind genera il CSS analizzando il sorgente per
// stringhe letterali, non eseguendo JavaScript — una classe montata
// concatenando pezzi (es. "text-".replace(...)) non verrebbe mai
// generata e la pillola perderebbe silenziosamente il suo colore.
export const TONI_STATUS: Record<
  StatusBadgeTono,
  { testo: string; sfondo: string; pallino: string }
> = {
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
  const t = TONI_STATUS[tono];
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
