import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Pastiglia "Aperto ora" / "Chiuso ora".
//
// Il calcolo NON è qui: arriva da isApertoOra() (src/lib/orari.ts),
// la stessa funzione che alimenta il footer. Qui c'è solo la resa.
//
// È un componente nuovo e non il riuso di quello del footer perché
// lì la pastiglia è scritta in linea dentro Footer.tsx: estrarla
// avrebbe voluto dire modificare un componente montato anche in home,
// che in questo step è fuori scope. La logica resta comunque unica —
// duplicato è il markup, non il calcolo. Da consolidare quando si
// toccherà il footer per altri motivi.
//
// Il pallino colorato è decorativo (aria-hidden): l'informazione sta
// nel testo accanto, quindi non è veicolata dal solo colore.
export function IndicatoreApertura({
  aperto,
  locale,
  tone = "dark",
}: {
  aperto: boolean;
  locale: Locale;
  tone?: "light" | "dark";
}) {
  const t = getDizionario(locale);
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans text-xs ${
        tone === "dark" ? "text-muted-dark" : "text-muted"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          aperto ? "bg-emerald-400" : "bg-rose-400"
        }`}
      />
      {aperto ? t.footer.apertoOra : t.footer.chiusoOra}
    </span>
  );
}
