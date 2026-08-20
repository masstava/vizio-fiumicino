interface FasciaForPreview {
  apertura: string;
  chiusura: string;
}

interface RowForPreview {
  nome: string;
  chiuso: boolean;
  fasce: FasciaForPreview[];
}

function fasceKey(fasce: FasciaForPreview[]): string {
  return fasce.map((f) => `${f.apertura}-${f.chiusura}`).join("|");
}

function fasceLabel(fasce: FasciaForPreview[]): string {
  const valid = fasce.filter((f) => f.apertura && f.chiusura);
  if (valid.length === 0) return "orario da definire";
  return valid.map((f) => `${f.apertura}–${f.chiusura}`).join(", ");
}

/**
 * Raggruppa i giorni consecutivi con lo stesso set di fasce orarie
 * (o stesso stato "chiuso") in un'unica riga, es.
 * "Martedì–Domenica 12:00–15:00, 18:00–01:00".
 * Nessun wraparound Domenica→Lunedì: la settimana resta lineare.
 */
export function formatOrariPreview(rows: RowForPreview[]): string {
  if (rows.length === 0) return "";

  interface Group {
    start: number;
    end: number;
    chiuso: boolean;
    key: string;
    fasce: FasciaForPreview[];
  }

  const groups: Group[] = [];

  rows.forEach((row, index) => {
    const key = row.chiuso ? "chiuso" : fasceKey(row.fasce);
    const last = groups[groups.length - 1];

    if (last && last.key === key) {
      last.end = index;
    } else {
      groups.push({
        start: index,
        end: index,
        chiuso: row.chiuso,
        key,
        fasce: row.fasce,
      });
    }
  });

  return groups
    .map((g) => {
      const dayLabel =
        g.start === g.end
          ? rows[g.start].nome
          : `${rows[g.start].nome}–${rows[g.end].nome}`;

      if (g.chiuso) return `${dayLabel} — chiuso`;
      return `${dayLabel} ${fasceLabel(g.fasce)}`;
    })
    .join(", ");
}
