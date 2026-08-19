"use client";

import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";

// Blocco iscrizione in linea, sempre visibile. Il popup a fine
// scroll e l'invio reale (SMTP casella dedicata o Resend) arriveranno
// in uno step dedicato al modulo newsletter — per ora il form non
// invia nulla da nessuna parte: preventDefault serve solo a evitare
// un reload di pagina al submit, non c'è alcuna richiesta di rete.
export function Newsletter() {
  return (
    <Section tone="light">
      <div className="max-w-xl">
        <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted">
          Newsletter
        </p>
        <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
          Eventi, novità di menu, serate speciali.
        </h2>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="La tua email"
            aria-label="Indirizzo email"
            className="flex-1 rounded-[2px] border border-ink/20 bg-cream px-3 py-2.5 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-bordeaux/50"
          />
          <Button type="submit" variant="primary">
            Iscriviti
          </Button>
        </form>
      </div>
    </Section>
  );
}
