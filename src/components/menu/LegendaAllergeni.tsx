import { Section } from "@/src/components/ui/Section";

export interface VoceAllergene {
  id: number;
  nome: string;
}

// Legenda dei codici allergene, una volta sola a fondo pagina.
//
// Non è un popover: qui è contenuto stabile e va nell'HTML, sia per i
// motori di ricerca sia perché l'informazione sugli allergeni deve
// essere raggiungibile senza dipendere da JavaScript. Il popover resta
// per la scheda di dettaglio del singolo piatto.
export function LegendaAllergeni({
  voci,
  titolo,
  nota,
}: {
  voci: VoceAllergene[];
  titolo: string;
  nota: string;
}) {
  if (voci.length === 0) return null;

  return (
    <Section tone="light" id="allergeni" className="border-t border-ink/10">
      <h2 className="mb-1 font-sans text-[10px] tracking-widest uppercase text-muted">
        {titolo}
      </h2>
      <p className="mb-6 font-sans text-xs text-muted">{nota}</p>
      <ul className="grid grid-cols-1 gap-x-8 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {voci.map((v) => (
          <li key={v.id} className="font-sans text-sm text-ink">
            <span className="mr-2 tabular-nums text-muted">{v.id}</span>
            {v.nome}
          </li>
        ))}
      </ul>
    </Section>
  );
}
