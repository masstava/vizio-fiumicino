"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";
import { DishRow } from "@/src/components/ui/DishRow";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import type { PiattoRiga } from "@/src/lib/dominio";

export interface CategoriaMenu {
  id: string;
  nome: string;
  piatti: PiattoRiga[];
}

export interface MacroMenu {
  id: string;
  /** Nome già tradotto nella lingua della pagina. */
  nome: string;
  /**
   * Nome originale del database, non tradotto. Serve a chi deve
   * riconoscere una macro specifica per nome (per esempio la
   * pre-selezione oraria della vista al tavolo): "nome" cambia con la
   * lingua e non è utilizzabile come chiave.
   */
  chiave?: string;
  categorie: CategoriaMenu[];
}

export function MenuCompleto({ macro }: { macro: MacroMenu[] }) {
  if (macro.length === 0) return null;

  return (
    <Tabs defaultValue={macro[0].id}>
      {/* Scorrevole in orizzontale: con quattro macro-categorie a 380px
          le etichette non ci starebbero affiancate. */}
      <TabsList className="mb-10 w-full justify-start overflow-x-auto">
        {macro.map((m) => (
          <TabsTrigger key={m.id} value={m.id}>
            {m.nome}
          </TabsTrigger>
        ))}
      </TabsList>

      {macro.map((m) => (
        <TabsContent
          key={m.id}
          value={m.id}
          // forceMount: tutte le schede restano nell'HTML e vengono
          // solo nascoste via CSS. Il comportamento predefinito di
          // Radix monta solo quella attiva — su una pagina di menu
          // significherebbe che tre quarti del menu non esistono per i
          // motori di ricerca né per la ricerca nella pagina del
          // browser, proprio sul contenuto che più deve essere
          // trovato.
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {/* type="multiple" con tutte le categorie aperte: la
              struttura si vede subito e si può richiudere ciò che non
              interessa. Partire chiusi nasconderebbe il menu a chi è
              arrivato qui proprio per leggerlo. */}
          <Accordion
            type="multiple"
            defaultValue={m.categorie.map((c) => c.id)}
            className="space-y-2"
          >
            {m.categorie.map((c) => (
              <AccordionItem key={c.id} value={c.id}>
                <AccordionTrigger>{c.nome}</AccordionTrigger>
                <AccordionContent>
                  {c.piatti.map((p) => (
                    <DishRow key={p.id} dish={p} tone="light" />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      ))}
    </Tabs>
  );
}
