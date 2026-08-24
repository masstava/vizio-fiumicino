import Image from "next/image";
import { Badge } from "@/src/components/ui/Badge";
import { ImagePlaceholder } from "@/src/components/ui/ImagePlaceholder";

export interface PiattoIconaDati {
  id: string;
  nome: string;
  descrizione: string | null;
  foto_url: string | null;
  /** Badge realmente presenti sul piatto, nell'ordine del database. */
  badges: string[];
}

// Il piatto-icona della pagina, letto dal database e non riscritto a
// mano: nome, descrizione, foto e badge sono quelli del menu, quindi
// la pagina non può raccontare un piatto diverso da quello servito.
//
// A differenza di EditorialDishCard mostra TUTTI i badge invece del
// primo: qui sono il dettaglio tecnico verificabile (frollatura,
// lavorazione) attorno a cui gira la sezione, non una decorazione.
// Nessun prezzo: sta nella pagina menu, non in una pagina editoriale.
export function PiattoIcona({ piatto }: { piatto: PiattoIconaDati }) {
  return (
    <div className="grid gap-6 rounded-[2px] border border-cream-text/10 p-5 md:grid-cols-2 md:items-center md:gap-12 md:p-10">
      <div className="aspect-[4/3] overflow-hidden rounded-[2px]">
        {piatto.foto_url ? (
          <Image
            src={piatto.foto_url}
            alt={piatto.nome}
            width={640}
            height={480}
            className="h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder seed={piatto.id} aspectRatio="4 / 3" />
        )}
      </div>
      <div>
        <h3 className="font-serif text-2xl font-medium text-cream-text md:text-3xl">
          {piatto.nome}
        </h3>
        {piatto.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {piatto.badges.map((testo) => (
              <Badge key={testo} variant="dark">
                {testo}
              </Badge>
            ))}
          </div>
        )}
        {piatto.descrizione && (
          <p className="mt-3 font-sans text-sm leading-relaxed text-muted-dark">
            {piatto.descrizione}
          </p>
        )}
      </div>
    </div>
  );
}
