"use client";

import { usePathname } from "next/navigation";
import { TOPBAR_SLOT_ID } from "./TopbarSlot";

// Intestazione di pagina, sopra il contenuto di ogni vista di
// /gestione — § "Topbar" in DASHBOARD_DESIGN_SYSTEM.md.
//
// Titolo e sottotitolo sono ricavati dal percorso, non passati dalla
// pagina: la shell non conosce il contenuto di nessuna pagina. Dove
// due viste condividono un prefisso ma non il senso (lista piatti vs.
// modifica/crea un piatto), la voce più specifica va PRIMA nell'elenco
// — il primo match vince.
//
// Il div #admin-topbar-slot è sempre presente (anche vuoto): è il
// bersaglio dei portali di TopbarSlot, con cui una pagina inserisce la
// propria ricerca o azione primaria nella topbar senza che la topbar
// conosca quella pagina in anticipo — solo le sezioni che li usano
// davvero (v. ogni pagina) vi portano contenuto.
const VOCI: { match: (p: string) => boolean; titolo: string; sottotitolo: string }[] = [
  { match: (p) => p === "/gestione", titolo: "Dashboard", sottotitolo: "Panoramica dell'account" },
  { match: (p) => p === "/gestione/menu/nuovo", titolo: "Nuovo piatto", sottotitolo: "Aggiungi un piatto al menu" },
  { match: (p) => p.startsWith("/gestione/menu/"), titolo: "Modifica piatto", sottotitolo: "Modifica i dati del piatto" },
  { match: (p) => p === "/gestione/menu", titolo: "Menu", sottotitolo: "Piatti, categorie e disponibilità" },
  { match: (p) => p === "/gestione/contenuti/foto", titolo: "Gestione sito", sottotitolo: "Foto delle pagine" },
  { match: (p) => p === "/gestione/contenuti/testi", titolo: "Gestione sito", sottotitolo: "Testi della home" },
  { match: (p) => p.startsWith("/gestione/contenuti"), titolo: "Gestione sito", sottotitolo: "Piatti e drink in home" },
  { match: (p) => p.startsWith("/gestione/orari"), titolo: "Orari", sottotitolo: "Fasce orarie e note di apertura" },
  { match: (p) => p === "/gestione/eventi/nuovo", titolo: "Nuovo evento", sottotitolo: "Aggiungi un evento al calendario" },
  { match: (p) => p.startsWith("/gestione/eventi/"), titolo: "Modifica evento", sottotitolo: "Modifica i dati dell'evento" },
  { match: (p) => p === "/gestione/eventi", titolo: "Eventi", sottotitolo: "Calendario e schede evento" },
  { match: (p) => p.startsWith("/gestione/prenotazioni"), titolo: "Prenotazioni", sottotitolo: "Agenda e capienza del giorno" },
];

function vociPagina(pathname: string) {
  const voce = VOCI.find((v) => v.match(pathname));
  return voce ?? { titolo: "Gestione", sottotitolo: "" };
}

export function AdminTopbar() {
  const pathname = usePathname();
  const { titolo, sottotitolo } = vociPagina(pathname);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-admin-line bg-admin-surface px-6 py-5 md:px-10">
      <div>
        <h1 className="font-sans text-[18px] font-semibold text-admin-text">{titolo}</h1>
        {sottotitolo && (
          <p className="mt-0.5 font-sans text-[12.5px] text-admin-text-3">{sottotitolo}</p>
        )}
      </div>
      <div id={TOPBAR_SLOT_ID} className="flex flex-wrap items-center gap-3" />
    </div>
  );
}
