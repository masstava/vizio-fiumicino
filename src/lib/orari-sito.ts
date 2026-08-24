import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/lib/database.types";
import type { GiornoOrario } from "@/src/lib/dominio";
import type { Locale } from "@/src/lib/i18n/config";
import { getDizionario } from "@/src/lib/i18n/dizionari";
import { isApertoOra } from "@/src/lib/orari";

/** Tutto ciò che serve al Footer, in una sola lettura. */
export interface OrariSito {
  settimana: GiornoOrario[];
  apertoOra: boolean;
  nota: string | null;
}

// Il footer compare su ogni pagina pubblica e ha sempre bisogno degli
// stessi tre dati. Raccolti qui una volta invece di ricopiare la
// stessa sequenza di fetch in ogni pagina nuova.
//
// La home continua a farlo per conto suo: è fuori dallo scope di
// questo step e funziona: unificarla è un accorpamento da fare a
// parte, non di straforo.
export async function getOrariSito(
  supabase: SupabaseClient<Database>,
  locale: Locale,
): Promise<OrariSito> {
  const t = getDizionario(locale);

  const [{ data: righe }, { data: config }] = await Promise.all([
    supabase
      .from("orari")
      .select("giorno_settimana, apertura, chiusura")
      .order("giorno_settimana")
      .order("ordine"),
    supabase.from("orari_config").select("nota").maybeSingle(),
  ]);

  const fasceByGiorno = new Map<number, { apertura: string; chiusura: string }[]>();
  (righe ?? []).forEach((r) => {
    if (!r.apertura || !r.chiusura) return;
    const arr = fasceByGiorno.get(r.giorno_settimana) ?? [];
    arr.push({
      apertura: r.apertura.slice(0, 5),
      chiusura: r.chiusura.slice(0, 5),
    });
    fasceByGiorno.set(r.giorno_settimana, arr);
  });

  const settimana: GiornoOrario[] = t.giorni.map((nome, giorno) => {
    const fasce = fasceByGiorno.get(giorno) ?? [];
    return { nome, chiuso: fasce.length === 0, fasce };
  });

  const apertoOra = isApertoOra(
    Array.from(fasceByGiorno.entries()).map(([giorno_settimana, fasce]) => ({
      giorno_settimana,
      fasce,
    })),
  );

  return { settimana, apertoOra, nota: config?.nota ?? null };
}
