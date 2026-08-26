import type { FasciaOraria, GiornoOrario } from "@/src/lib/dominio";
import type { Locale } from "@/src/lib/i18n/config";

// =============================================================
// Griglia degli orari prenotabili — §21, passo 2
// =============================================================
// ASSUNZIONE DA CONFERMARE: la specifica non definisce un elenco di
// turni prenotabili, solo le fasce di apertura del locale (es.
// 18:00–01:00). La griglia a 30 minuti è una scelta editoriale per
// offrire orari sensati in un menu a tendina — non un vincolo del
// database. Si cambia in un solo punto, qui.
export const PASSO_GRIGLIA_MINUTI = 30;

function minutiDa(ora: string): number {
  const [h, m] = ora.split(":").map(Number);
  return h * 60 + m;
}

function oraDaMinuti(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/**
 * Orari prenotabili dentro UNA fascia di apertura, a passi di
 * PASSO_GRIGLIA_MINUTI. L'ultimo è il più tardo che resta
 * strettamente prima della chiusura: niente turni proposti all'ora
 * esatta in cui il locale chiude.
 *
 * Gestisce le fasce che attraversano la mezzanotte (18:00–01:00):
 * se la chiusura è "prima" dell'apertura sull'orologio, si somma un
 * giro completo prima di calcolare i passi.
 */
export function orariPrenotabili(fascia: FasciaOraria): string[] {
  const inizio = minutiDa(fascia.apertura);
  let fine = minutiDa(fascia.chiusura);
  if (fine <= inizio) fine += 24 * 60;

  const orari: string[] = [];
  for (let m = inizio; m < fine; m += PASSO_GRIGLIA_MINUTI) {
    orari.push(oraDaMinuti(m));
  }
  return orari;
}

/**
 * Giorno della settimana (0 = Lunedì … 6 = Domenica, la convenzione
 * già in uso per /gestione/orari) da una data "YYYY-MM-DD".
 *
 * Calcolo puramente calendariale, senza fusi orari: un lunedì è
 * lunedì a prescindere dal fuso di chi lo calcola. Date.UTC evita che
 * l'orario locale del browser o del server faccia scivolare la data
 * di un giorno.
 */
export function giornoSettimanaDaData(dataISO: string): number {
  const [y, m, d] = dataISO.split("-").map(Number);
  const giornoJs = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Dom … 6=Sab
  return (giornoJs + 6) % 7; // 0=Lun … 6=Dom
}

/**
 * Orari selezionabili per una data: incrocia gli orari reali del
 * locale con, se la data è oggi, l'ora corrente — un turno delle
 * 12:00 non ha senso se sono già le 15:00.
 *
 * Scelta di UX e non un vincolo imposto dalla specifica: "oggi" e
 * "ora" arrivano da chi chiama (calcolati una volta al caricamento
 * della pagina) e non si aggiornano da soli. Nel peggiore dei casi —
 * pagina lasciata aperta per ore — un turno già passato resta
 * selezionabile finché non si ricarica: non pericoloso, il database
 * non impedisce comunque una data passata, è solo un turno che non
 * avrebbe senso proporre.
 */
export function orariSelezionabili(
  settimana: GiornoOrario[],
  dataISO: string,
  dataOdierna: string,
  oraAttuale: string,
): string[] {
  const giorno = giornoSettimanaDaData(dataISO);
  const infoGiorno = settimana[giorno];
  if (!infoGiorno || infoGiorno.chiuso) return [];

  const tutti = infoGiorno.fasce.flatMap(orariPrenotabili);
  if (dataISO !== dataOdierna) return tutti;
  return tutti.filter((ora) => ora > oraAttuale);
}

// =============================================================
// Incrocio con la capienza configurata
// =============================================================

/**
 * Data e ora correnti nel fuso di Fiumicino, per calcolare "oggi" e
 * "adesso" lato server al caricamento della pagina — stesso principio
 * già usato altrove nel progetto (isApertoOra, l'evento datato in
 * home): il fuso del server su Vercel è quasi sempre UTC e non va
 * confuso con quello del locale.
 */
export function oggiEOraRoma(now: Date = new Date()): { data: string; ora: string } {
  const parti = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const valore = (tipo: string) => parti.find((p) => p.type === tipo)?.value ?? "";

  return {
    data: `${valore("year")}-${valore("month")}-${valore("day")}`,
    ora: `${valore("hour")}:${valore("minute")}`,
  };
}

/**
 * Data "YYYY-MM-DD" in forma leggibile, nella lingua della
 * prenotazione — usata sia dalla schermata di conferma sia dall'email
 * (§21 passo 3), stessa tecnica di formattazione già in uso per gli
 * eventi (ExperienceEventi.tsx, eventi-sito.ts): mezzogiorno UTC per
 * non far scivolare la data di un giorno quando il fuso locale è
 * indietro.
 */
export function formatDataLeggibile(dataISO: string, locale: Locale): string {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export interface RigaCapienza {
  /** "HH:MM" o "HH:MM:SS": normalizzata internamente. */
  fascia: string;
  limiteCoperti: number | null;
  occupati: number;
}

export interface EsitoFascia {
  ora: string;
  disponibile: boolean;
  /** null = nessun tetto configurato: non si mostra un numero. */
  postiResidui: number | null;
}

/**
 * Unisce la griglia di orari con l'esito di capienza_del_giorno.
 *
 * Una fascia assente dal risultato della funzione non ha alcuna riga
 * in capienza_config per quella data: significa "nessun tetto", esattamente
 * come limiteCoperti nullo — i due casi sono trattati alla pari.
 */
export function unisciCapienza(
  orari: string[],
  righe: RigaCapienza[],
): EsitoFascia[] {
  const perFascia = new Map(righe.map((r) => [r.fascia.slice(0, 5), r]));

  return orari.map((ora) => {
    const r = perFascia.get(ora);
    if (!r || r.limiteCoperti == null) {
      return { ora, disponibile: true, postiResidui: null };
    }
    const residui = r.limiteCoperti - r.occupati;
    return { ora, disponibile: residui > 0, postiResidui: Math.max(0, residui) };
  });
}
