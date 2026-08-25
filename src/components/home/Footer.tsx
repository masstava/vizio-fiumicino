import Link from "next/link";
import { GestisciCookie } from "@/src/components/consenso/GestisciCookie";
import { Logo } from "@/src/components/ui/Logo";
import { SocialIcon } from "@/src/components/ui/SocialIcon";
import { CONTATTI } from "@/src/lib/contatti";
import type { FasciaOraria, GiornoOrario } from "@/src/lib/dominio";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

interface FooterProps {
  orari: GiornoOrario[];
  apertoOra: boolean;
  /** Nota orari temporanei, se impostata in dashboard. */
  notaOrari?: string | null;
  locale: Locale;
}

// Raggruppa i giorni consecutivi con le stesse fasce (o stesso stato
// "chiuso") in righe distinte, es. "Lunedì — chiuso" poi
// "Martedì–Domenica 12:00–15:00, 18:00–01:00". Versione scoped a
// questo componente (non importata dagli helper admin di
// gestione/orari, per non far dipendere una pagina pubblica dai
// _components privati di un'altra feature) — stessa logica, nessun
// wraparound Domenica→Lunedì.
function groupOrari(rows: GiornoOrario[], etichettaChiuso: string): string[] {
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

    if (g.chiuso) return `${dayLabel} — ${etichettaChiuso}`;
    const fasceLabel = g.fasce.map((f) => `${f.apertura}–${f.chiusura}`).join(", ");
    return `${dayLabel} ${fasceLabel}`;
  });
}

// Tema scuro. Contrasto: text-cream-text su bg-dark ≈ 17.6:1,
// text-muted-dark su bg-dark ≈ 12.2:1 — entrambi oltre 4.5:1.
// <address> per l'indirizzo reale: struttura semantica già pronta
// per lo schema markup Restaurant/LocalBusiness futuro, senza
// doverla riscrivere in quello step.
export function Footer({ orari, apertoOra, notaOrari, locale }: FooterProps) {
  const t = getDizionario(locale);
  const orariLines = groupOrari(orari, t.footer.chiuso);

  return (
    <footer id="contatti" className="bg-dark px-6 py-12 text-cream-text md:px-12 lg:px-16">
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <Logo className="h-8" />
          {/* L'indirizzo apre la scheda Google Maps: utile su mobile
              (avvia la navigazione) e coerente col NAP. */}
          <address className="mt-2 font-sans text-sm not-italic leading-relaxed text-muted-dark">
            <a
              href={CONTATTI.google.scheda}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-cream-text md:min-h-0"
            >
              {CONTATTI.indirizzo.completo}
            </a>
          </address>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className="font-sans text-[10px] tracking-widest uppercase text-muted-dark">
              {t.footer.orari}
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
              {apertoOra ? t.footer.apertoOra : t.footer.chiusoOra}
            </span>
          </div>
          {orariLines.length > 0 ? (
            <ul className="space-y-1 font-sans text-sm leading-relaxed">
              {orariLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="font-sans text-sm text-muted-dark">{t.footer.orariDaDefinire}</p>
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
            {t.footer.contatti}
          </p>
          <ul className="space-y-1 font-sans text-sm leading-relaxed">
            <li>
              <a
                href={CONTATTI.telefono.href}
                className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-cream-text md:min-h-0"
              >
                {CONTATTI.telefono.display}
              </a>
            </li>
            <li>
              <a
                href={CONTATTI.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center underline underline-offset-4 transition-colors hover:text-cream-text md:min-h-0"
              >
                WhatsApp {CONTATTI.whatsapp.display}
              </a>
            </li>
          </ul>

          {/* Sotto md ogni icona sta dentro un riquadro di 44x44 e la
              distanza fra le icone si riduce, perché la spaziatura la
              danno ormai i riquadri stessi. Non si usa il
              pseudo-elemento di data-tocco-esteso: con quattro icone a
              36px di distanza fra i centri, quattro aree da 44px
              centrate si sovrapporrebbero e il tocco finirebbe
              sull'icona accanto. L'icona resta 20x20: cambia lo spazio
              attorno, non il disegno. */}
          <ul className="mt-4 flex items-center gap-1 md:gap-4">
            {CONTATTI.social.map((s) => (
              <li key={s.nome}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.nome}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] text-muted-dark transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:h-auto md:w-auto"
                >
                  <SocialIcon nome={s.nome} className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Riga legale: le due informative e la riapertura del pannello
          consenso. "Gestisci cookie" sta qui e non altrove perché il
          footer è l'unico punto presente su ogni pagina. */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1">
        <Link
          href={localizedPath("/privacy", locale)}
          className="inline-flex min-h-11 items-center font-sans text-sm text-muted-dark underline underline-offset-4 transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:min-h-0"
        >
          {t.consenso.linkPrivacy}
        </Link>
        <Link
          href={localizedPath("/cookie-policy", locale)}
          className="inline-flex min-h-11 items-center font-sans text-sm text-muted-dark underline underline-offset-4 transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:min-h-0"
        >
          {t.consenso.linkCookie}
        </Link>
        <GestisciCookie locale={locale} />
      </div>

      <p className="mt-4 font-sans text-xs text-muted-dark">
        © {new Date().getFullYear()} {CONTATTI.nome}
      </p>
    </footer>
  );
}
