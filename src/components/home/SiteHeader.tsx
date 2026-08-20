"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/Button";
import { Logo } from "@/src/components/ui/Logo";
import { localizedPath, type Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Header unico, sticky per tutto lo scroll (anche sopra l'hero
// scuro), sostituisce sia la vecchia barra prenotazione mobile sia la
// nav che mancava. Sfondo scuro pieno indipendente dalla sezione
// sottostante, così il contrasto testo/sfondo è sempre quello
// verificato qui (cream-text/muted-dark su bg-dark), non quello della
// sezione che l'header di volta in volta copre.
//
// Il pulsante "Prenota" resta un placeholder inerte, stessa nota
// della vecchia StickyReservationBar: l'integrazione di prenotazione
// (TheFork o equivalente) arriva in uno step dedicato successivo.
export function SiteHeader({ locale }: { locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = getDizionario(locale);

  // Ancore in-pagina: l'href deve portare il prefisso di lingua,
  // altrimenti da /en il clic rimanda alla home italiana.
  const base = localizedPath("/", locale);
  const NAV_LINKS = [
    { href: `${base}#menu`, label: t.nav.menu },
    { href: `${base}#piatti-in-evidenza`, label: t.nav.carne },
    { href: `${base}#cocktail`, label: t.nav.cocktail },
    { href: `${base}#contatti`, label: t.nav.contatti },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark/95 text-cream-text backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-12 lg:px-16">
        <Link
          href={localizedPath("/", locale)}
          aria-label={t.nav.home}
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
        >
          <Logo priority className="h-7 md:h-8" />
        </Link>

        <nav
          aria-label={t.nav.principale}
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-muted-dark transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />
          <Button type="button" variant="primary" className="px-4 md:px-6">
            {t.cta.prenota}
          </Button>

          <button
            type="button"
            aria-label={menuOpen ? t.nav.chiudiMenu : t.nav.apriMenu}
            aria-expanded={menuOpen}
            aria-controls="site-header-mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[2px] text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="site-header-mobile-nav"
          aria-label={t.nav.principale}
          className="flex flex-col gap-1 border-t border-cream-text/10 px-6 pb-4 pt-2 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-[2px] px-2 py-2.5 font-sans text-sm text-muted-dark transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
