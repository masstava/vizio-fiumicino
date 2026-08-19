import { cn } from "@/src/lib/utils";

// Glifo a fiamma puramente decorativo, in linea con il tema brace del
// locale. NON è il marchio ufficiale: quello esiste solo come raster
// dentro public/pdf/*.png (usato dai PDF), non come vettoriale. Se
// arriva il logo in SVG/AI basta sostituire questo path.
//
// Inline e monocromatico (currentColor): nessuna richiesta di rete,
// nessun impatto sul caricamento.
export function FlameMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
    >
      <path d="M12 1.5c.8 2.9.2 5-1.6 6.9-1.9 2-3.1 3.9-3.1 6.4C7.3 18.6 9.4 21 12 21s4.7-2.4 4.7-6.2c0-2.1-.9-3.9-2.3-5.5.1 1.5-.3 2.6-1.2 3.4.6-3.9.3-7.7-1.2-11.2z" />
    </svg>
  );
}
