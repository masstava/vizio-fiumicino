import { GestisciCookie } from "@/src/components/consenso/GestisciCookie";
import { Section } from "@/src/components/ui/Section";
import type { Blocco, Informativa as DatiInformativa } from "@/src/lib/copy/legale-tipi";
import type { Locale } from "@/src/lib/i18n/config";

// Renderer unico per privacy e cookie policy: le due informative hanno
// forme diverse ma gli stessi mattoni. Tenerne uno solo evita che
// l'una diverga dall'altra nella resa — e la struttura resta dati, non
// markup, quindi riordinare o rinominare una sezione è una modifica al
// testo e basta.
//
// Tema chiaro su tutta la lunghezza: sono documenti da leggere, non da
// guardare, e il fondo scuro su mille parole affatica.

export function InformativaLegale({
  dati,
  dataAggiornamento,
  locale,
}: {
  dati: DatiInformativa;
  dataAggiornamento: string;
  locale: Locale;
}) {
  return (
    <Section tone="light">
      {/* max-w-prose e non la larghezza piena: oltre una settantina di
          caratteri per riga l'occhio perde il capo successivo, e qui
          il testo è lungo. */}
      <div className="max-w-prose">
        <h1 className="font-serif text-3xl font-medium leading-tight text-ink md:text-4xl">
          {dati.titolo}
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-muted">
          {dati.sottotitolo}
        </p>
        <p className="mt-3 font-sans text-xs text-muted">
          {dati.aggiornata(dataAggiornamento)}
        </p>

        <div className="mt-10 space-y-10">
          {dati.sezioni.map((sezione) => (
            <section key={sezione.titolo}>
              <h2 className="font-serif text-xl font-medium text-ink md:text-2xl">
                {sezione.titolo}
              </h2>
              <div className="mt-4 space-y-4">
                {sezione.blocchi.map((blocco, i) => (
                  <RenderBlocco key={i} blocco={blocco} locale={locale} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Section>
  );
}

function RenderBlocco({ blocco, locale }: { blocco: Blocco; locale: Locale }) {
  switch (blocco.tipo) {
    case "p":
      return (
        <p className="font-sans text-base leading-relaxed text-muted">
          {blocco.testo}
        </p>
      );

    case "elenco":
      return (
        <ul className="ml-5 list-disc space-y-2">
          {blocco.voci.map((voce) => (
            <li
              key={voce}
              className="font-sans text-base leading-relaxed text-muted"
            >
              {voce}
            </li>
          ))}
        </ul>
      );

    case "definizioni":
      return (
        <dl className="space-y-4">
          {blocco.voci.map((voce) => (
            <div key={voce.termine}>
              <dt className="font-sans text-sm font-medium text-ink">
                {voce.termine}
              </dt>
              <dd className="mt-1 font-sans text-base leading-relaxed text-muted">
                {voce.descrizione}
              </dd>
            </div>
          ))}
        </dl>
      );

    case "tabella":
      // A 380px una tabella a quattro colonne è illeggibile e una
      // tabella con scroll orizzontale è peggio: sotto md ogni riga
      // diventa una scheda con le etichette accanto ai valori. Da md
      // in su torna una tabella vera.
      return (
        <>
          <div className="space-y-4 md:hidden">
            {blocco.righe.map((riga) => (
              <div
                key={riga.categoria}
                className="rounded-[2px] border border-ink/15 p-4"
              >
                <p className="font-sans text-sm font-medium text-ink">
                  {riga.categoria}
                </p>
                <dl className="mt-2 space-y-2">
                  {(
                    [
                      [blocco.intestazioni[1], riga.finalita],
                      [blocco.intestazioni[2], riga.base],
                      [blocco.intestazioni[3], riga.durata],
                    ] as const
                  ).map(([etichetta, valore]) => (
                    <div key={etichetta}>
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-muted">
                        {etichetta}
                      </dt>
                      <dd className="font-sans text-sm leading-relaxed text-muted">
                        {valore}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <table className="hidden w-full border-collapse text-left md:table">
            <thead>
              <tr className="border-b border-ink/20">
                {blocco.intestazioni.map((testo) => (
                  <th
                    key={testo}
                    scope="col"
                    className="py-2 pr-4 font-sans text-[10px] font-medium uppercase tracking-widest text-muted"
                  >
                    {testo}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blocco.righe.map((riga) => (
                <tr key={riga.categoria} className="border-b border-ink/10 align-top">
                  <th
                    scope="row"
                    className="py-3 pr-4 font-sans text-sm font-medium text-ink"
                  >
                    {riga.categoria}
                  </th>
                  <td className="py-3 pr-4 font-sans text-sm leading-relaxed text-muted">
                    {riga.finalita}
                  </td>
                  <td className="py-3 pr-4 font-sans text-sm leading-relaxed text-muted">
                    {riga.base}
                  </td>
                  <td className="py-3 font-sans text-sm leading-relaxed text-muted">
                    {riga.durata}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );

    case "gestisci-cookie":
      // Non un link a un'altra pagina: riapre il pannello del CMP
      // dov'è l'utente. "Revocare deve essere facile quanto
      // acconsentire" si traduce in questo.
      return (
        <div className="rounded-[2px] border border-ink/15 bg-ink/[0.03] px-4 py-3">
          <GestisciCookie locale={locale} tono="chiaro" />
        </div>
      );
  }
}
