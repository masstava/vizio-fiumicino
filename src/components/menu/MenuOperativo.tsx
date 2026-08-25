"use client";

import { DishDetailDialog } from "@/src/components/home/DishDetailDialog";
import { DishRow } from "@/src/components/ui/DishRow";
import type { MacroMenu } from "@/src/components/menu/MenuCompleto";
import type { VoceAllergene } from "@/src/components/menu/LegendaAllergeni";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Vista operativa del menu: telefono appoggiato al tavolo durante il
// servizio. Niente header, niente footer, niente racconto.
//
// Tutte le sezioni sono renderizzate, sempre, nello stesso documento:
// l'ora del giorno decide solo QUALE viene per prima (vedi
// src/lib/fascia-oraria.ts), e quell'ordine è fissato dal server.
// Nessuna sezione viene nascosta e niente si riordina mentre il
// cliente legge — se stesse guardando i cocktail alle 13:00, la
// sezione non deve sparire da sotto le dita.
//
// Le ancore sono link normali: nessun listener di scroll, nessuno
// "scroll spy". Su una pagina lunga letta col pollice, un osservatore
// che ricalcola a ogni pixel è lavoro sprecato sul thread principale
// — e lo scorrimento deve restare fluido, non informato.
export function MenuOperativo({
  macro,
  legenda,
  locale,
  chiaveSuggerita,
}: {
  macro: MacroMenu[];
  legenda: VoceAllergene[];
  locale: Locale;
  /** Macro pre-selezionata dall'ora: riceve il segno "Ora". */
  chiaveSuggerita: string;
}) {
  const t = getDizionario(locale);

  // Codice allergene → nome esteso, per la scheda di dettaglio.
  const nomeAllergene = new Map(legenda.map((v) => [v.id, v.nome]));

  if (macro.length === 0) {
    return (
      <p className="px-5 py-16 text-center font-sans text-sm text-muted">
        {t.menuOperativo.vuoto}
      </p>
    );
  }

  return (
    <div className="pb-16">
      {/* Barra delle sezioni, sempre in alto. Scorre in orizzontale:
          con quattro o più macro a 380px non ci starebbero
          affiancate, e mandarle a capo mangerebbe metà schermo. */}
      <nav
        aria-label={t.menuOperativo.vaiA}
        className="sticky top-0 z-30 border-b border-ink/10 bg-cream/95 backdrop-blur"
      >
        <ul className="flex gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {macro.map((m) => (
            <li key={m.id} className="flex-shrink-0">
              <a
                href={`#sezione-${m.id}`}
                className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-[2px] border border-ink/20 px-3 font-sans text-sm text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux"
              >
                {m.nome}
                {m.chiave === chiaveSuggerita && (
                  <span className="rounded-[2px] bg-bordeaux px-1.5 py-0.5 font-sans text-[10px] font-medium uppercase tracking-wide text-cream-text">
                    {t.menuOperativo.consigliatoOra}
                  </span>
                )}
              </a>
            </li>
          ))}
          <li className="flex-shrink-0">
            <a
              href="#allergeni"
              className="inline-flex min-h-11 items-center whitespace-nowrap rounded-[2px] border border-ink/20 px-3 font-sans text-sm text-muted transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux"
            >
              {t.menuOperativo.allergeni}
            </a>
          </li>
        </ul>
      </nav>

      {macro.map((m) => (
        <section
          key={m.id}
          id={`sezione-${m.id}`}
          // scroll-mt: l'ancora deve fermarsi SOTTO la barra sticky,
          // altrimenti il titolo della sezione ci finisce sotto.
          className="scroll-mt-16 px-4 pt-8"
        >
          <h2 className="font-serif text-2xl font-medium text-ink">{m.nome}</h2>

          {m.categorie.map((c) => (
            <div key={c.id} className="mt-6">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted">
                {c.nome}
              </h3>
              <ul>
                {c.piatti.map((p) => (
                  <li key={p.id}>
                    {/* Tocco sul piatto → la scheda di dettaglio già
                        costruita per il resto del sito. Il <button>
                        avvolge la riga intera: su un telefono il
                        bersaglio è tutta la riga, non un'icona. */}
                    <DishDetailDialog
                      locale={locale}
                      dish={{
                        id: p.id,
                        nome: p.nome,
                        descrizione: p.descrizione ?? null,
                        foto_url: p.foto_url ?? null,
                        allergeni: (p.allergeni ?? [])
                          .map((codice) => nomeAllergene.get(codice))
                          .filter((n): n is string => Boolean(n)),
                      }}
                    >
                      <button
                        type="button"
                        aria-label={t.piatto.apriDettaglio(p.nome)}
                        className="block w-full cursor-pointer text-left transition-colors hover:bg-ink/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux"
                      >
                        <DishRow dish={p} tone="light" />
                      </button>
                    </DishDetailDialog>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      {legenda.length > 0 && (
        <section id="allergeni" className="scroll-mt-16 border-t border-ink/10 px-4 pt-8">
          <h2 className="font-sans text-[10px] uppercase tracking-widest text-muted">
            {t.menu.legendaTitolo}
          </h2>
          <p className="mt-1 font-sans text-xs leading-relaxed text-muted">
            {t.menu.legendaNota}
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {legenda.map((v) => (
              <li key={v.id} className="font-sans text-sm text-ink">
                <span className="mr-2 tabular-nums text-muted">{v.id}</span>
                {v.nome}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
