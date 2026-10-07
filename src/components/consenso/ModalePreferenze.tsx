"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Switch } from "@/src/components/ui/Switch";
import { useRegistraOverlay } from "@/src/components/overlay/OverlayContext";
import { CATEGORIE, type Categoria, type Scelte } from "@/src/lib/consenso/tipi";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { useConsenso } from "./ConsensoContext";
import { focusSulContenuto, ID_PERSONALIZZA } from "./focus";

// Modale delle preferenze.
//
// PUNTO CENTRALE, da Linee guida del Garante 10/06/2021: chiudere non
// è consentire. La X, ESC e il clic fuori chiudono e basta — nessuna
// scrittura, nessun consenso registrato, e se l'utente non aveva
// ancora scelto il banner torna a comparire. L'unico percorso che
// salva è il pulsante "Salva preferenze".
//
// Per questo le spunte vivono in uno stato LOCALE: finché non si
// salva, muovere un interruttore non tocca il consenso effettivo.
//
// Ritorno del focus alla chiusura. Il modale si apre senza
// DialogTrigger (dal banner o da "Gestisci cookie"), e in quel caso
// Radix non sa dove riportare il focus: ricadeva su <body>. Qui si
// torna su chi l'ha aperto, se esiste ancora (il pulsante "Gestisci
// cookie"); altrimenti su "Personalizza", se il banner è tornato
// perché si è chiuso senza salvare; altrimenti, scelta fatta dal
// banner, sul contenuto della pagina.
export function ModalePreferenze({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const { preferenzeAperte, chiudiPreferenze, scelte, salva } = useConsenso();

  const [bozza, setBozza] = useState<Scelte>(scelte);

  // A ogni apertura si riparte dal consenso effettivo: modifiche
  // abbandonate in un'apertura precedente non devono ricomparire.
  useEffect(() => {
    if (preferenzeAperte) setBozza(scelte);
  }, [preferenzeAperte, scelte]);

  useRegistraOverlay(preferenzeAperte);

  const apertoDa = useRef<HTMLElement | null>(null);

  return (
    <Dialog
      open={preferenzeAperte}
      onOpenChange={(aperto) => {
        if (!aperto) chiudiPreferenze();
      }}
    >
      {/* DialogContent non ha padding proprio: lo mette chi lo usa.
          pr generoso nell'intestazione perché il pulsante di chiusura
          è in posizione assoluta nell'angolo e il titolo, senza, gli
          passava sotto. */}
      <DialogContent
        closeLabel={t.consenso.chiudi}
        className="p-5 md:p-6"
        // Radix chiama questo prima di spostare il focus nel modale:
        // activeElement è ancora il pulsante che lo ha aperto.
        onOpenAutoFocus={() => {
          apertoDa.current =
            document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }}
        onCloseAutoFocus={(evento) => {
          evento.preventDefault();
          const origine = apertoDa.current;
          apertoDa.current = null;
          if (origine?.isConnected && origine !== document.body) {
            origine.focus();
            return;
          }
          const personalizza = document.getElementById(ID_PERSONALIZZA);
          if (personalizza) personalizza.focus();
          else focusSulContenuto();
        }}
      >
        <DialogHeader className="pr-12 md:pr-10">
          <DialogTitle>{t.consenso.modaleTitolo}</DialogTitle>
          <DialogDescription>{t.consenso.modaleTesto}</DialogDescription>
        </DialogHeader>

        <div className="mt-2 divide-y divide-border">
          {CATEGORIE.map((categoria) => (
            <RigaCategoria
              key={categoria}
              categoria={categoria}
              attiva={bozza[categoria]}
              locale={locale}
              onChange={(v) => setBozza((p) => ({ ...p, [categoria]: v }))}
            />
          ))}
        </div>

        <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">
          {t.consenso.chiudiSenzaSalvare}
        </p>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => salva(bozza)}
            className="inline-flex min-h-11 items-center rounded-[2px] bg-bordeaux px-6 font-sans text-sm font-medium tracking-wide text-cream-text transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
          >
            {t.consenso.salva}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RigaCategoria({
  categoria,
  attiva,
  locale,
  onChange,
}: {
  categoria: Categoria;
  attiva: boolean;
  locale: Locale;
  onChange: (valore: boolean) => void;
}) {
  const t = getDizionario(locale);
  const voce = t.consenso.categorie[categoria];
  const bloccata = categoria === "necessary";

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="font-sans text-sm font-medium text-foreground">
          {voce.nome}
        </p>
        <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground">
          {voce.descrizione}
        </p>
      </div>
      <div className="flex-shrink-0 pt-0.5">
        {bloccata ? (
          // Nessun interruttore disattivato: un interruttore spento e
          // non cliccabile si legge come "si può accendere ma non ora".
          // Qui è una dichiarazione, non una scelta.
          <span className="font-sans text-xs text-muted-foreground">
            {t.consenso.sempreAttivo}
          </span>
        ) : (
          <Switch
            checked={attiva}
            onChange={onChange}
            label={voce.nome}
            labelNascosta
          />
        )}
      </div>
    </div>
  );
}
