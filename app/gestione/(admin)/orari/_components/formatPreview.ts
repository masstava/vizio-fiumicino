interface RowForPreview {
  nome: string;
  chiuso: boolean;
  apertura: string;
  chiusura: string;
}

/**
 * Raggruppa i giorni consecutivi con lo stesso orario (o stesso stato
 * "chiuso") in un'unica riga, es. "Martedì–Domenica 18:00–01:00".
 * Nessun wraparound Domenica→Lunedì: la settimana resta lineare.
 */
export function formatOrariPreview(rows: RowForPreview[]): string {
  if (rows.length === 0) return "";

  interface Group {
    start: number;
    end: number;
    chiuso: boolean;
    apertura: string;
    chiusura: string;
  }

  const groups: Group[] = [];

  rows.forEach((row, index) => {
    const last = groups[groups.length - 1];
    const sameAsLast =
      last &&
      last.chiuso === row.chiuso &&
      (row.chiuso ||
        (last.apertura === row.apertura && last.chiusura === row.chiusura));

    if (sameAsLast) {
      last.end = index;
    } else {
      groups.push({
        start: index,
        end: index,
        chiuso: row.chiuso,
        apertura: row.apertura,
        chiusura: row.chiusura,
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
      if (!g.apertura || !g.chiusura) return `${dayLabel} — orario da definire`;
      return `${dayLabel} ${g.apertura}–${g.chiusura}`;
    })
    .join(", ");
}
