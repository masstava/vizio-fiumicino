import Image from "next/image";
import { cn } from "@/src/lib/utils";

// Fiamma isolata del marchio, usata come accento ricorrente
// dell'identità. Sostituisce il glifo segnaposto disegnato a mano
// usato prima che arrivasse il vettoriale ufficiale.
//
// Varianti:
//   "oro"    → fondi scuri, prima scelta
//   "bianca" → fondi scuri dove l'oro non stacca abbastanza
//   "scura"  → solo come filigrana a bassa opacità sulle sezioni
//              chiare (il logo con lettering lì non si può usare)
//
// Sempre decorativa: alt="" e aria-hidden, non veicola informazione.
type Variante = "oro" | "bianca" | "scura";

const SRC: Record<Variante, string> = {
  oro: "/brand/fiamma-oro.svg",
  bianca: "/brand/fiamma-bianca.svg",
  scura: "/brand/fiamma-scura.svg",
};

export function FlameAccent({
  variante = "oro",
  className,
}: {
  variante?: Variante;
  className?: string;
}) {
  return (
    <Image
      src={SRC[variante]}
      alt=""
      aria-hidden="true"
      width={560}
      height={920}
      // Nessuna altezza di base: la decide chi lo usa. Una classe di
      // altezza qui entrerebbe in conflitto con quella passata da
      // fuori (stessa specificità) e vincerebbe l'ordine nel CSS
      // generato, non quello nell'attributo.
      className={cn("w-auto select-none", className)}
    />
  );
}
