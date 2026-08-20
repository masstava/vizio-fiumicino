import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import type { EventoInEvidenza } from "@/src/lib/dominio";

// "2026-09-12" → "sabato 12 settembre". Formattato sul fuso di Roma
// per non slittare di un giorno quando il server gira in UTC.
function formatData(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "it-IT", {
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
export function ExperienceEventi({
  evento,
  locale,
}: {
  evento?: EventoInEvidenza | null;
  locale: Locale;
}) {
  const t = getDizionario(locale);
  const dataLeggibile = evento?.data_evento
    ? formatData(evento.data_evento, locale)
    : null;

  return (
    <Section tone="light">
      <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted">
        {t.sezioni.experience}
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
              {t.cta.prenotaPosto}
            </Button>
          </>
        ) : (
          <>
            <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
              {t.experience.titoloGenerico}
            </h2>
            <p className="mb-6 font-sans text-sm leading-relaxed text-muted">
              {t.experience.testoGenerico}
            </p>
            <Button type="button" variant="primary">
              {t.cta.contattaci}
            </Button>
          </>
        )}
      </div>
    </Section>
  );
}
