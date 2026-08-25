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

  // Ogni voce punta alla propria pagina, nessuna più a un'ancora della
  // home: localizedPath ci mette il prefisso di lingua, senza il quale
  // da /en il clic rimanderebbe alla versione italiana.
  //
  // Le ancore della home (#menu, #piatti-in-evidenza, #cocktail,
  // #contatti) restano al loro posto e continuano a funzionare per chi
  // ci arriva da un link esterno o salvato: qui cambia solo dove punta
  // il menu. Il footer ha ancora id="contatti" ed è montato su ogni
  // pagina.
  const NAV_LINKS = [
    { href: localizedPath("/menu", locale), label: t.nav.menu },
    { href: localizedPath("/la-carne", locale), label: t.nav.carne },
    { href: localizedPath("/cocktail-bar", locale), label: t.nav.cocktail },
    { href: localizedPath("/experience-eventi", locale), label: t.nav.experience },
    { href: localizedPath("/contatti", locale), label: t.nav.contatti },
  ];

  return (
    <header className="sticky top-0 z-50 bg-dark/95 text-cream-text backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-6 py-3 md:px-12 lg:px-16">
        <Link
          href={localizedPath("/", locale)}
          aria-label={t.nav.home}
          className="flex min-h-11 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:min-h-0"
        >
          <Logo priority className="h-7 md:h-8" />
        </Link>

        <nav
          aria-label={t.nav.principale}
          className="hidden items-center gap-8 md:flex"
        >
          {/* Tutte le voci sono pagine, quindi tutte passano da Link:
              navigazione client e prefetch. Il ramo <a> che serviva
              alle ancore non ha più voci a cui applicarsi. */}
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-muted-dark transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
            >
              {link.label}
            </Link>
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text md:hidden"
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
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-11 items-center rounded-[2px] px-2 font-sans text-sm text-muted-dark transition-colors hover:text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
