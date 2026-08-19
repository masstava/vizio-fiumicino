interface FasciaOraria {
  apertura: string;
  chiusura: string;
}

export interface GiornoOrario {
  nome: string;
  chiuso: boolean;
  fasce: FasciaOraria[];
}

interface FooterProps {
  orari: GiornoOrario[];
}

// Raggruppa i giorni consecutivi con le stesse fasce (o stesso stato
// "chiuso") in righe distinte, es. "Lunedì — chiuso" poi
// "Martedì–Domenica 12:00–15:00, 18:00–01:00". Versione scoped a
// questo componente (non importata dagli helper admin di
// gestione/orari, per non far dipendere una pagina pubblica dai
// _components privati di un'altra feature) — stessa logica, nessun
// wraparound Domenica→Lunedì.
function groupOrari(rows: GiornoOrario[]): string[] {
  interface Group {
    start: number;
    end: number;
    chiuso: boolean;
    key: string;
    fasce: FasciaOraria[];
  }

  const groups: Group[] = [];

  rows.forEach((row, index) => {
    const key = row.chiuso
      ? "chiuso"
      : row.fasce.map((f) => `${f.apertura}-${f.chiusura}`).join("|");
    const last = groups[groups.length - 1];

    if (last && last.key === key) {
      last.end = index;
    } else {
      groups.push({ start: index, end: index, chiuso: row.chiuso, key, fasce: row.fasce });
    }
  });

  return groups.map((g) => {
    const dayLabel =
      g.start === g.end
        ? rows[g.start].nome
        : `${rows[g.start].nome}–${rows[g.end].nome}`;

    if (g.chiuso) return `${dayLabel} — chiuso`;
    const fasceLabel = g.fasce.map((f) => `${f.apertura}–${f.chiusura}`).join(", ");
    return `${dayLabel} ${fasceLabel}`;
  });
}

// Tema scuro. Contrasto: text-cream-text su bg-dark ≈ 17.6:1,
// text-muted-dark su bg-dark ≈ 12.2:1 — entrambi oltre 4.5:1.
// <address> per l'indirizzo reale: struttura semantica già pronta
// per lo schema markup Restaurant/LocalBusiness futuro, senza
// doverla riscrivere in quello step.
export function Footer({ orari }: FooterProps) {
  const orariLines = groupOrari(orari);

  return (
    <footer id="contatti" className="bg-dark px-6 py-12 text-cream-text md:px-12 lg:px-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-medium">Vizio Bistrot</p>
          <address className="mt-2 font-sans text-sm not-italic leading-relaxed text-muted-dark">
            Via delle Ombrine 25, Fiumicino
          </address>
        </div>

        <div>
          <p className="mb-2 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
            Orari
          </p>
          {orariLines.length > 0 ? (
            <ul className="space-y-1 font-sans text-sm leading-relaxed">
              {orariLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-muted-dark">Orari da definire</p>
          )}
        </div>

        <div>
          <p className="mb-2 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
            Contatti
          </p>
          {/* Nessun telefono/email/social reale disponibile ancora —
              segnalato come placeholder, stesso trattamento già
              usato per le CTA di prenotazione/recensione/contatto. */}
          <p className="font-sans text-sm text-muted-dark">
            Contatti e social in arrivo
          </p>
        </div>
      </div>

      <p className="mt-10 font-sans text-xs text-muted-dark">
        © {new Date().getFullYear()} Vizio Bistrot
      </p>
    </footer>
  );
}
