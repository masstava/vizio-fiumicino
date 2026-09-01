"use client";

import { useEffect, useRef, useState } from "react";
import { AdminTopbar } from "@/src/components/admin/AdminTopbar";
import { SidebarNav } from "./SidebarNav";
import { SignOutButton } from "./SignOutButton";

// Struttura della dashboard — restyling del contenitore (Passaggio
// 1/6 del refactor UI/UX, vedi DASHBOARD_DESIGN_SYSTEM.md). Il
// comportamento responsive sotto è lo STESSO già verificato in
// precedenza (apertura/chiusura, focus, Esc, overlay): cambia solo
// l'aspetto, non la logica.
//
// Desktop invariato nella struttura: colonna laterale sempre
// visibile, ora 232px (era 224px) per il nuovo sistema di design.
//
// Mobile: la stessa colonna occuperebbe una fetta enorme dei 380px
// disponibili, lasciando troppo poco ai form — che è il contrario
// della priorità giusta. Diventa quindi un pannello che compare al
// tocco e si richiude scegliendo una voce, toccando fuori o con Esc.
//
// Il pannello non intrappola il focus di proposito: è una divulgazione,
// non una finestra modale. Chi naviga da tastiera può uscirne
// tabulando, e Esc lo chiude riportando il focus al pulsante che
// l'ha aperto — così non si perde il punto in cui si era.
interface AdminShellProps {
  children: React.ReactNode;
  // Conteggi reali per i contatori opzionali della sidebar (§ Sidebar
  // in DASHBOARD_DESIGN_SYSTEM.md), calcolati nel layout server-side.
  // Ogni chiave è opzionale: una sezione senza contatore reale non ne
  // passa uno, e SidebarNav semplicemente non mostra la pillola.
  contatori?: { menu?: number };
}

export function AdminShell({ children, contatori }: AdminShellProps) {
  const [aperto, setAperto] = useState(false);
  const bottoneRef = useRef<HTMLButtonElement>(null);
  const pannelloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aperto) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAperto(false);
        bottoneRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aperto]);

  // Il focus entra nel pannello all'apertura: senza, chi naviga da
  // tastiera dovrebbe attraversare tutta la pagina per raggiungerlo.
  useEffect(() => {
    if (aperto) pannelloRef.current?.querySelector("a")?.focus();
  }, [aperto]);

  function chiudi() {
    setAperto(false);
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Barra superiore, solo mobile */}
      {/* z-50 sopra il pannello (z-40): aperto il menu, l'hamburger
          diventa una X e deve restare visibile e toccabile. Coprirlo
          toglierebbe l'unico comando evidente per richiudere — restano
          Esc e il tocco fuori, ma nessuno dei due si vede. */}
      <div className="sticky top-0 z-50 flex items-center gap-3 bg-admin-ink px-4 py-3 md:hidden">
        <button
          ref={bottoneRef}
          type="button"
          onClick={() => setAperto((v) => !v)}
          aria-expanded={aperto}
          aria-controls="admin-nav-mobile"
          aria-label={aperto ? "Chiudi il menu di gestione" : "Apri il menu di gestione"}
          className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[2px] text-cream-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream-text"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {aperto ? (
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
        <div className="min-w-0">
          <p className="truncate font-serif text-base font-medium leading-tight text-cream-text">
            Vizio
          </p>
          <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted-dark">
            Gestione
          </p>
        </div>
      </div>

      {/* Velo: intercetta il tocco fuori dal pannello. aria-hidden e
          senza testo — la chiusura resta possibile da Esc e dal
          pulsante, quindi non è l'unico modo per uscire. */}
      {aperto && (
        <div
          aria-hidden="true"
          onClick={chiudi}
          className="fixed inset-0 z-30 bg-admin-ink/60 md:hidden"
        />
      )}

      {/* Colonna laterale: pannello scorrevole su mobile, statica da md */}
      <aside
        id="admin-nav-mobile"
        ref={pannelloRef}
        className={[
          "z-40 flex flex-col bg-admin-ink",
          // mobile: fuori schermo finché non si apre
          // pt-[68px]: altezza della barra superiore, così la prima
          // voce non finisce sotto di essa.
          "fixed inset-y-0 left-0 w-64 pt-[68px] transition-transform duration-200 motion-reduce:transition-none",
          aperto ? "translate-x-0" : "-translate-x-full",
          // desktop: 232px, invariata la staticità rispetto a prima
          "md:static md:w-[232px] md:flex-shrink-0 md:translate-x-0 md:pt-0",
        ].join(" ")}
      >
        <div className="hidden border-b border-cream-text/10 px-6 py-6 md:block">
          <p className="font-serif text-lg font-medium leading-tight text-cream-text">
            Vizio
          </p>
          <p className="mt-0.5 font-sans text-[9px] tracking-[0.18em] uppercase text-muted-dark">
            Gestione
          </p>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {/* Scegliere una voce chiude il pannello: su mobile resterebbe
              aperto sopra la pagina appena caricata. */}
          <SidebarNav onNavigate={chiudi} contatori={contatori} />
        </div>

        <div className="border-t border-cream-text/10 px-6 py-5">
          <SignOutButton />
        </div>
      </aside>

      {/* [&_.font-serif]:font-sans — § Tipografia in
          DASHBOARD_DESIGN_SYSTEM.md: Fraunces resta riservato al
          wordmark della sidebar qui sopra, non altrove nella
          dashboard. Le pagine sotto (non toccate in questo passaggio)
          hanno ancora .font-serif sui propri titoli h1: questa regola
          li riporta a Inter senza modificare un solo file di pagina —
          un override di stile scoped al contenitore, non un cambio di
          contenuto. */}
      <main className="min-w-0 flex-1 overflow-auto bg-admin-canvas [&_.font-serif]:font-sans">
        <AdminTopbar />
        {children}
      </main>
    </div>
  );
}
