"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/Button";
import { DarkSectionAccent } from "@/src/components/ui/DarkSectionAccent";
import { Section } from "@/src/components/ui/Section";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { iscrivitiNewsletter } from "@/src/lib/newsletter/actions";

// Tema scuro con lo stesso accento "brace" già stabilito per le altre
// sezioni scure del sito (FeaturedDishes, BarCocktailPreview...): non
// un linguaggio visivo nuovo, lo stesso DarkSectionAccent. "-10%" è
// un elemento grafico a sé (font-serif, grande, in oro) accanto al
// titolo, non solo testo dentro la frase — l'offerta deve leggersi
// prima ancora di leggere.
//
// Contrasto sul fondo scuro: text-gold ≈ 8,7:1, text-muted-dark ≈
// 12,2:1 (già misurati altrove su questo stesso bg-dark, vedi
// Hero.tsx). Il messaggio d'errore usa uno sfondo tenue in bordeaux +
// testo cream-text invece di testo bordeaux diretto: bordeaux su
// bg-dark misura solo ~2,2:1, troppo poco per un testo normale — la
// tinta di sfondo comunica l'errore, il testo resta leggibile.
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
    <Section tone="dark" className="relative isolate overflow-hidden">
      <DarkSectionAccent />
      <div className="relative max-w-xl">
        <p className="mb-3 font-sans text-[10px] tracking-widest uppercase text-muted-dark">
          {t.sezioni.newsletter}
        </p>

        <div className="mb-4 flex items-baseline gap-4">
          <span className="font-serif text-6xl font-medium text-gold md:text-7xl">
            -10%
          </span>
          <h2 className="font-serif text-2xl font-medium text-cream-text">
            {t.newsletter.titolo}
          </h2>
        </div>

        {codice ? (
          <div className="rounded-[2px] border border-cream-text/15 p-5">
            <p className="font-sans text-base text-cream-text">{t.newsletter.fattoTitolo}</p>
            <p className="mt-3 font-sans text-[10px] uppercase tracking-widest text-muted-dark">
              {t.newsletter.codiceEtichetta}
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-gold">{codice}</p>
            <p className="mt-3 font-sans text-sm text-muted-dark">{t.newsletter.comeUsarlo}</p>
          </div>
        ) : (
          <>
            <p className="mb-4 font-sans text-base leading-relaxed text-muted-dark">{offerta}</p>
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
                className="flex-1 rounded-[2px] border border-cream-text/25 bg-dark/60 px-3 py-2.5 font-sans text-sm text-cream-text placeholder:text-muted-dark/70 focus:outline-none focus:border-gold/60"
              />
              <Button type="submit" variant="primary" disabled={inviando}>
                {inviando ? t.newsletter.invio : t.newsletter.bottoneIscrizione}
              </Button>
            </form>
            {errore && (
              <p className="mt-2 rounded-[2px] border border-bordeaux/40 bg-bordeaux/15 px-3 py-2 font-sans text-sm text-cream-text">
                {errore}
              </p>
            )}
            <p className="mt-3 font-sans text-xs text-muted-dark">{t.newsletter.rassicurazione}</p>
          </>
        )}
      </div>
    </Section>
  );
}
