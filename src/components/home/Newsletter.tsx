"use client";

import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Blocco iscrizione in linea, sempre visibile. Il popup a fine
// scroll e l'invio reale (SMTP casella dedicata o Resend) arriveranno
// in uno step dedicato al modulo newsletter — per ora il form non
// invia nulla da nessuna parte: preventDefault serve solo a evitare
// un reload di pagina al submit, non c'è alcuna richiesta di rete.
//
// ATTENZIONE: t.newsletter.testo porta ora un incentivo reale (-10%
// prima visita, accesso anticipato alle serate a tema) — un impegno
// del locale verso chi si iscrive, non solo una descrizione. Finché
// il form non invia nulla da nessuna parte (vedi sopra), iscriversi
// oggi non produce alcun -10% né alcun accesso anticipato: il testo è
// online prima del meccanismo che lo rende vero. Va implementato a
// breve — non è una promessa da lasciare silenziosamente inevasa.
export function Newsletter({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  return (
    <Section tone="light">
      <div className="max-w-xl">
        <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted">
          {t.sezioni.newsletter}
        </p>
        <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
          {t.newsletter.titolo}
        </h2>
        <p className="mb-4 font-sans text-base leading-relaxed text-muted">
          {t.newsletter.testo}
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder={t.newsletter.emailPlaceholder}
            aria-label={t.newsletter.emailLabel}
            className="flex-1 rounded-[2px] border border-ink/20 bg-cream px-3 py-2.5 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-bordeaux/50"
          />
          <Button type="submit" variant="primary">
            {t.cta.iscriviti}
          </Button>
        </form>
      </div>
    </Section>
  );
}
