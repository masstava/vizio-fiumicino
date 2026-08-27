import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Pastiglia "Aperto ora" / "Chiuso ora".
//
// Il calcolo NON è qui: arriva da isApertoOra() (src/lib/orari.ts),
// la stessa funzione che alimenta il footer. Qui c'è solo la resa.
//
// Condiviso da Footer.tsx e da questa pagina Contatti (Audit tecnico
// #2, punto 4): finché la home era considerata intoccabile, estrarre
// il markup dal Footer significava toccare un componente montato
// ovunque per un cambio fuori scope, e la pastiglia restava scritta
// in linea lì. Da allora la home è stata toccata più volte (CTA del
// sistema di prenotazione compreso) — il vincolo che giustificava la
// duplicazione non c'è più, e "normal-case tracking-normal" qui sotto
// è esattamente quello che serviva al Footer per stare accanto
// all'etichetta "ORARI" (uppercase, tracking-widest) senza ereditarne
// lo stile: dove non serve (qui in Contatti) non ha alcun effetto,
// perché non c'è nulla da correggere.
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
      className={`inline-flex items-center gap-1.5 font-sans text-xs normal-case tracking-normal ${
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
