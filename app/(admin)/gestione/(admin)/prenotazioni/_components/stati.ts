import type { StatusSelectOption } from "@/src/components/admin/StatusSelect";
import type { StatoPrenotazione } from "../_actions";

// Un tono per stato — sono esattamente 4 stati e 4 toni disponibili
// (§ Colori in DASHBOARD_DESIGN_SYSTEM.md). Scelta motivata:
// confermata=verde (attiva, positiva), no-show=ambra (da verificare —
// il cliente non si è presentato), completata=grigio (conclusa,
// neutra), cancellata=brick (esito definitivo, la stessa importanza
// visiva riservata altrove all'azione primaria — qui non è un
// pulsante ma serve comunque risaltare). Condiviso fra la riga della
// lista e il pannello di dettaglio: un solo posto dove i quattro stati
// e le loro etichette/colori sono definiti.
export const STATI: StatusSelectOption<StatoPrenotazione>[] = [
  { valore: "confermata", etichetta: "Confermata", tono: "verde" },
  { valore: "completata", etichetta: "Completata", tono: "grigio" },
  { valore: "no-show", etichetta: "No-show", tono: "ambra" },
  { valore: "cancellata", etichetta: "Cancellata", tono: "brick" },
];
