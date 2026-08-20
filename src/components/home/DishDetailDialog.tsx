"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/Badge";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

export interface DishDetail {
  id: string;
  nome: string;
  descrizione: string | null;
  foto_url: string | null;
  badge?: string | null;
  /** Allergeni per esteso, già tradotti. Assenti in home: l'anteprima
   *  non li legge di proposito. Li passerà la pagina menu completo. */
  allergeni?: string[];
}

// Scheda di dettaglio del piatto: foto grande, descrizione estesa e,
// dove i dati ci sono, gli allergeni per esteso.
//
// Serve soprattutto alle card compatte della griglia, che per stare
// strette mostrano solo il nome: senza questo, di quel piatto non si
// saprebbe nulla senza uscire dalla pagina.
//
// Il contenuto del dialogo è sempre lo stesso, chiaro: un overlay che
// cambia colore con la sezione sottostante sarebbe incoerente.
export function DishDetailDialog({
  dish,
  locale,
  children,
}: {
  dish: DishDetail;
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = getDizionario(locale);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent closeLabel={t.piatto.chiudi} className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden">
          {dish.foto_url ? (
            <Image
              src={dish.foto_url}
              alt={dish.nome}
              width={800}
              height={600}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder seed={dish.id} aspectRatio="4 / 3" />
          )}
        </div>

        <div className="p-5 md:p-6">
          <DialogHeader>
            <DialogTitle>{dish.nome}</DialogTitle>
            {dish.badge && (
              <div>
                <Badge variant="light">{dish.badge}</Badge>
              </div>
            )}
          </DialogHeader>

          <DialogDescription className="mt-3">
            {dish.descrizione || t.piatto.nessunaDescrizione}
          </DialogDescription>

          {dish.allergeni && dish.allergeni.length > 0 && (
            <div className="mt-5 border-t border-border pt-4">
              <Popover>
                <PopoverTrigger className="font-sans text-xs tracking-widest uppercase text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t.piatto.allergeni}
                </PopoverTrigger>
                {/* Popover e non tooltip: l'elenco allergeni deve
                    restare leggibile anche da telefono, dove l'hover
                    non esiste. */}
                <PopoverContent align="start">
                  <ul className="space-y-1 font-sans text-xs leading-relaxed">
                    {dish.allergeni.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
