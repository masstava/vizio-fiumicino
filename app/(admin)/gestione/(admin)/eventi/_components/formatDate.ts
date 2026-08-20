/**
 * Formatta una data "YYYY-MM-DD" in italiano (es. "12 settembre 2026")
 * costruendo il Date da componenti locali, per evitare lo slittamento
 * di un giorno che si otterrebbe interpretando la stringa come UTC.
 */
export function formatDataEvento(dataEvento: string | null): string | null {
  if (!dataEvento) return null;

  const [year, month, day] = dataEvento.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
