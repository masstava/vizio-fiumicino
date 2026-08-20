import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";

export interface EventoHome {
  id: string;
  titolo: string;
  descrizione: string | null;
  data_evento: string | null;
}

// "2026-09-12" → "sabato 12 settembre". Formattato sul fuso di Roma
// per non slittare di un giorno quando il server gira in UTC.
function formatData(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

// Tema chiaro, volutamente minimale: nessun elenco eventi, nessun
// flusso di prenotazione sala. Se in dashboard c'è un evento futuro
// con data lo si mostra — un appuntamento reale e datato crea
// urgenza, il testo generico no; altrimenti resta il testo generico.
// Il pulsante è un placeholder inerte come le altre CTA di contatto.
export function ExperienceEventi({ evento }: { evento?: EventoHome | null }) {
  const dataLeggibile =
    evento?.data_evento ? formatData(evento.data_evento) : null;

  return (
    <Section tone="light">
      <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted">
        Experience &amp; Eventi
      </p>
      <div className="max-w-xl">
        {evento && dataLeggibile ? (
          <>
            <p className="mb-2 font-sans text-sm font-medium text-bordeaux">
              <time dateTime={evento.data_evento ?? undefined}>
                {dataLeggibile}
              </time>
            </p>
            <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
              {evento.titolo}
            </h2>
            {evento.descrizione && (
              <p className="mb-6 font-sans text-sm leading-relaxed text-muted">
                {evento.descrizione}
              </p>
            )}
            <Button type="button" variant="primary">
              Prenota il tuo posto
            </Button>
          </>
        ) : (
          <>
            <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
              Occasioni su misura
            </h2>
            <p className="mb-6 font-sans text-sm leading-relaxed text-muted">
              Menu degustazione, cene a tema, eventi privati: raccontaci cosa
              hai in mente e lo organizziamo insieme.
            </p>
            <Button type="button" variant="primary">
              Contattaci
            </Button>
          </>
        )}
      </div>
    </Section>
  );
}
