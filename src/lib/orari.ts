import type { FasceGiorno, FasciaOraria } from "./dominio";

const GIORNO_INDEX_BY_ROME_WEEKDAY: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

// Giorno/ora correnti nel fuso di Fiumicino, indipendentemente dal
// fuso del server (che su Vercel è quasi sempre UTC).
function romeNow(date: Date): { giorno: number; time: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";

  return {
    giorno: GIORNO_INDEX_BY_ROME_WEEKDAY[weekday] ?? 0,
    time: `${hour}:${minute}`,
  };
}

// Una fascia che chiude dopo mezzanotte (es. 18:00–01:00) appartiene
// per metà a "oggi" (dalle 18:00 in poi) e per metà a "ieri" quando
// la si guarda dal giorno successivo (fino all'01:00).
function fasciaCoprendoOra(
  fascia: FasciaOraria,
  time: string,
  comeIeri: boolean,
): boolean {
  const attraversaMezzanotte = fascia.chiusura < fascia.apertura;

  if (!attraversaMezzanotte) {
    return !comeIeri && time >= fascia.apertura && time < fascia.chiusura;
  }

  return comeIeri ? time < fascia.chiusura : time >= fascia.apertura;
}

// La data di validità di una nota orari è passata? Confronto fatto
// sul calendario di Roma (non su quello del server, che su Vercel è
// UTC): altrimenti a cavallo della mezzanotte l'avviso comparirebbe
// o sparirebbe con un giorno di scarto.
export function isScaduta(
  validaFinoAl: string | null,
  now: Date = new Date(),
): boolean {
  if (!validaFinoAl) return false;

  // "en-CA" produce YYYY-MM-DD, direttamente confrontabile con il
  // formato date di Postgres.
  const oggiRoma = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Scaduta solo dal giorno DOPO: "valida fino al 31/8" resta valida
  // per tutto il 31.
  return oggiRoma > validaFinoAl;
}

export function isApertoOra(
  giorni: FasceGiorno[],
  now: Date = new Date(),
): boolean {
  const { giorno, time } = romeNow(now);
  const ieri = (giorno + 6) % 7;

  const fasceOggi = giorni.find((g) => g.giorno_settimana === giorno)?.fasce ?? [];
  const fasceIeri = giorni.find((g) => g.giorno_settimana === ieri)?.fasce ?? [];

  return (
    fasceOggi.some((f) => fasciaCoprendoOra(f, time, false)) ||
    fasceIeri.some((f) => fasciaCoprendoOra(f, time, true))
  );
}
