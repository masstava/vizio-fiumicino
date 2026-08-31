"use client";

import { usePathname } from "next/navigation";

// Intestazione di pagina, sopra il contenuto di ogni vista di
// /gestione — § "Topbar" in DASHBOARD_DESIGN_SYSTEM.md.
//
// Titolo e sottotitolo sono ricavati dal percorso, non passati dalla
// pagina: questo passaggio (1/6) è solo il contenitore, e non tocca
// il contenuto di nessuna pagina. Ogni pagina mostra ANCORA la
// propria intestazione in linea (invariata) — per questo giro le due
// convivono, in attesa che il passaggio dedicato a quella sezione
// rimuova l'intestazione ora ridondante dal corpo della pagina.
//
// Ricerca e azione primaria sono previste dalla specifica ma non
// filo qui: entrambe richiederebbero collegarsi a dati o comandi di
// una pagina specifica (filtrare una lista, creare un piatto), che è
// contenuto/logica di quella pagina — fuori scope per un passaggio
// che tocca solo il contenitore. Restano voci aperte, elencate in
// DASHBOARD_DESIGN_SYSTEM.md.
const VOCI: { prefisso: string; titolo: string; sottotitolo: string }[] = [
  { prefisso: "/gestione/menu", titolo: "Menu", sottotitolo: "Piatti, categorie e disponibilità" },
  { prefisso: "/gestione/contenuti", titolo: "Testi della home", sottotitolo: "Contenuti editabili della pagina iniziale" },
  { prefisso: "/gestione/orari", titolo: "Orari", sottotitolo: "Fasce orarie e note di apertura" },
  { prefisso: "/gestione/eventi", titolo: "Eventi", sottotitolo: "Calendario e schede evento" },
  { prefisso: "/gestione/prenotazioni", titolo: "Prenotazioni", sottotitolo: "Agenda e capienza del giorno" },
];

function vociPagina(pathname: string) {
  if (pathname === "/gestione") {
    return { titolo: "Dashboard", sottotitolo: "Panoramica dell'account" };
  }
  // startsWith, non uguaglianza: /gestione/menu/nuovo e
  // /gestione/menu/[id] restano "Menu" — la vista specifica non è
  // nota qui (richiederebbe leggere il piatto), stessa approssimazione
  // già accettata da SidebarNav per lo stato attivo.
  const voce = VOCI.find((v) => pathname.startsWith(v.prefisso));
  return voce ?? { titolo: "Gestione", sottotitolo: "" };
}

export function AdminTopbar() {
  const pathname = usePathname();
  const { titolo, sottotitolo } = vociPagina(pathname);

  return (
    <div className="border-b border-admin-line bg-admin-surface px-6 py-5 md:px-10">
      <h1 className="font-sans text-[18px] font-semibold text-admin-text">{titolo}</h1>
      {sottotitolo && (
        <p className="mt-0.5 font-sans text-[12.5px] text-admin-text-3">{sottotitolo}</p>
      )}
    </div>
  );
}
