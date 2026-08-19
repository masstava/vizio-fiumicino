import { Button } from "@/src/components/ui/Button";

// Barra di prenotazione sticky, solo mobile: resta visibile in cima
// allo schermo durante tutto lo scroll, anche sopra l'hero, dato che
// è il primo elemento della pagina e usa position: sticky (non
// fixed) — occupa il suo spazio normale finché non si scrolla oltre,
// poi resta ancorata. Toni chiari, volutamente distinti dall'hero
// scuro sottostante per non competere con la sua CTA.
//
// Il pulsante "Prenota" è un placeholder inerte: l'integrazione di
// prenotazione (TheFork o equivalente) arriverà in uno step dedicato
// successivo — per ora esiste solo visivamente.
export function StickyReservationBar() {
  return (
    <div className="sticky top-0 z-50 md:hidden bg-cream border-b border-ink/10 px-4 py-2 flex items-center justify-between gap-3">
      <span className="font-serif text-sm font-medium text-ink">
        Vizio Bistrot
      </span>
      <Button type="button" variant="primary">
        Prenota
      </Button>
    </div>
  );
}
