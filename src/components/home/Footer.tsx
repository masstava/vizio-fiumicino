import { SocialIcon } from "@/src/components/ui/SocialIcon";
import { CONTATTI } from "@/src/lib/contatti";

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
  apertoOra: boolean;
  /** Nota orari temporanei, se impostata in dashboard. */
  notaOrari?: string | null;
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
export function Footer({ orari, apertoOra, notaOrari }: FooterProps) {
  const orariLines = groupOrari(orari);

  return (
    <footer id="contatti" className="bg-dark px-6 py-12 text-cream-text md:px-12 lg:px-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-medium">{CONTATTI.nome}</p>
          {/* L'indirizzo apre la scheda Google Maps: utile su mobile
              (avvia la navigazione) e coerente col NAP. */}
          <address className="mt-2 font-sans text-sm not-italic leading-relaxed text-muted-dark">
            <a
              href={CONTATTI.google.scheda}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-colors hover:text-cream-text"
            >
              {CONTATTI.indirizzo.completo}
            </a>
          </address>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted-dark">
              Orari
            </p>
            {/* Calcolato da questa stessa fonte dati (orari), non una
                nuova tabella. Il pallino è decorativo: lo stato è
                comunicato anche a parole per non dipendere dal solo
                colore. */}
            <span className="flex items-center gap-1.5 font-sans text-xs normal-case tracking-normal text-muted-dark">
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${apertoOra ? "bg-emerald-400" : "bg-rose-400"}`}
              />
              {apertoOra ? "Aperto ora" : "Chiuso ora"}
            </span>
          </div>
          {orariLines.length > 0 ? (
            <ul className="space-y-1 font-sans text-sm leading-relaxed">
              {orariLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-muted-dark">Orari da definire</p>
          )}
          {/* Nota orari temporanei, se impostata in dashboard: evita
              che un orario stagionale passi per definitivo. */}
          {notaOrari && (
            <p className="mt-2 font-sans text-xs italic text-muted-dark">
              {notaOrari}
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
            Contatti
          </p>
          <ul className="space-y-1 font-sans text-sm leading-relaxed">
            <li>
              <a
                href={CONTATTI.telefono.href}
                className="underline underline-offset-4 transition-colors hover:text-cream-text"
              >
                {CONTATTI.telefono.display}
              </a>
            </li>
            <li>
              <a
                href={CONTATTI.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 transition-colors hover:text-cream-text"
              >
                WhatsApp {CONTATTI.whatsapp.display}
              </a>
            </li>
          </ul>

          <ul className="mt-4 flex items-center gap-4">
            {CONTATTI.social.map((s) => (
              <li key={s.nome}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.nome}
                  className="inline-flex text-muted-dark transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
                >
                  <SocialIcon nome={s.nome} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-10 font-sans text-xs text-muted-dark">
        © {new Date().getFullYear()} {CONTATTI.nome}
      </p>
    </footer>
  );
}
