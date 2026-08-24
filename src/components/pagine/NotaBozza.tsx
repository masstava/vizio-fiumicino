import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";

// Riquadro per i dati che NON sono né nella specifica né nel
// database (provenienza delle carni, razze, tempi di frollatura).
//
// È volutamente vistoso: l'alternativa era riempire quei punti con
// dettagli plausibili ma inventati, che una volta online diventano
// affermazioni commerciali false. Meglio un segnaposto che si vede.
//
// Contrasto verificato: text-dark su fondo gold/25 sopra crema resta
// ben oltre 4,5:1; il bordo serve solo a delimitare, non porta
// informazione.
export function NotaBozza({
  testo,
  locale,
}: {
  testo: string;
  locale: Locale;
}) {
  const t = getDizionario(locale);
  return (
    <aside className="mt-8 max-w-2xl rounded-[2px] border border-gold bg-gold/25 px-4 py-3">
      <p className="font-sans text-[10px] font-medium uppercase tracking-widest text-dark">
        {t.bozza.etichetta}
      </p>
      <p className="mt-1.5 font-sans text-sm leading-relaxed text-dark">
        {testo}
      </p>
    </aside>
  );
}
