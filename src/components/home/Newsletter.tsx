"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { Section } from "@/src/components/ui/Section";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { iscrivitiNewsletter } from "@/src/lib/newsletter/actions";

export function Newsletter({ locale, offerta }: { locale: Locale; offerta: string }) {
  const t = getDizionario(locale);

  const [email, setEmail] = useState("");
  // Honeypot anti-spam: stesso identico pattern di PrenotaForm.tsx —
  // fuori schermo e fuori dall'albero di tastiera, un utente reale non
  // lo incontra mai.
  const [sitoWeb, setSitoWeb] = useState("");
  const [inviando, setInviando] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [codice, setCodice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || inviando) return;

    setErrore(null);
    setInviando(true);
    try {
      const esito = await iscrivitiNewsletter({
        email: email.trim(),
        nome: null,
        locale,
        honeypot: sitoWeb,
      });

      if (esito.ok) {
        setCodice(esito.codice);
      } else if (esito.motivo === "RATE_LIMITED") {
        setErrore(t.newsletter.erroreLimite);
      } else {
        setErrore(t.newsletter.erroreGenerico);
      }
    } catch {
      setErrore(t.newsletter.erroreGenerico);
    } finally {
      setInviando(false);
    }
  }

  return (
    <Section tone="light">
      <div className="max-w-xl">
        <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted">
          {t.sezioni.newsletter}
        </p>
        <h2 className="mb-4 font-serif text-2xl font-medium text-ink">
          {t.newsletter.titolo}
        </h2>

        {codice ? (
          <div className="rounded-[2px] border border-ink/15 p-5">
            <p className="font-sans text-base text-ink">{t.newsletter.fattoTitolo}</p>
            <p className="mt-3 font-sans text-[10px] uppercase tracking-widest text-muted">
              {t.newsletter.codiceEtichetta}
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-bordeaux">{codice}</p>
            <p className="mt-3 font-sans text-sm text-muted">{t.newsletter.comeUsarlo}</p>
          </div>
        ) : (
          <>
            <p className="mb-4 font-sans text-base leading-relaxed text-muted">{offerta}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
                <label htmlFor="nl-sito-web">Sito web</label>
                <input
                  id="nl-sito-web"
                  name="sito-web"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={sitoWeb}
                  onChange={(e) => setSitoWeb(e.target.value)}
                />
              </div>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.newsletter.emailPlaceholder}
                aria-label={t.newsletter.emailLabel}
                className="flex-1 rounded-[2px] border border-ink/20 bg-cream px-3 py-2.5 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-bordeaux/50"
              />
              <Button type="submit" variant="primary" disabled={inviando}>
                {inviando ? t.newsletter.invio : t.cta.iscriviti}
              </Button>
            </form>
            {errore && <p className="mt-2 font-sans text-sm text-bordeaux">{errore}</p>}
          </>
        )}
      </div>
    </Section>
  );
}
