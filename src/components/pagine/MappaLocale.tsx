import { CONTATTI } from "@/src/lib/contatti";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Mappa incorporata di Google, forma standard senza chiave API.
//
// L'indirizzo arriva dalla fonte unica: scriverlo qui creerebbe un
// secondo posto da aggiornare, che è esattamente ciò che il principio
// NAP vieta.
//
// loading="lazy": l'iframe è sotto la piega e non deve contendere
// banda al primo contenuto utile.
//
// ATTENZIONE, da risolvere con la CMP: questo iframe contatta Google
// al caricamento e può impostare cookie PRIMA di qualunque consenso.
// Quando arriverà la gestione del consenso va messo dietro un
// caricamento su clic, non lasciato così.
export function MappaLocale({ locale }: { locale: Locale }) {
  const t = getDizionario(locale);
  const query = encodeURIComponent(
    `${CONTATTI.nome}, ${CONTATTI.indirizzo.completo}`,
  );

  return (
    <div className="overflow-hidden rounded-[2px] border border-ink/10">
      <iframe
        title={t.paginaContatti.mappaTitolo}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-64 w-full border-0 md:h-80"
      />
    </div>
  );
}
