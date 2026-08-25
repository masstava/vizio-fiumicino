import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/src/lib/database.types";
import type { EventoInEvidenza } from "@/src/lib/dominio";
import { campoLocalizzato, campoLocalizzatoOpzionale } from "@/src/lib/i18n/campi";
import type { Locale } from "@/src/lib/i18n/config";

// Eventi attivi con una data da oggi in poi, in ordine di data.
//
// Stessa regola già usata in home per il singolo evento in evidenza
// (attivo + data non nulla + data ≥ oggi a Roma), qui però restituisce
// l'elenco invece del solo prossimo: la pagina dedicata li mostra
// tutti.
//
// Il confronto si fa sulla data di ROMA e non su quella del server:
// una funzione che gira in UTC dopo la mezzanotte italiana
// nasconderebbe l'evento di stasera.
export async function getEventiFuturi(
  supabase: SupabaseClient<Database>,
  locale: Locale,
): Promise<EventoInEvidenza[]> {
  const oggiRoma = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const { data } = await supabase
    .from("eventi")
    .select("id, titolo, titolo_en, descrizione, descrizione_en, data_evento")
    .eq("attivo", true)
    .not("data_evento", "is", null)
    .gte("data_evento", oggiRoma)
    .order("data_evento");

  return (data ?? []).map((e) => ({
    id: e.id,
    titolo: campoLocalizzato(e.titolo, e.titolo_en, locale),
    descrizione: campoLocalizzatoOpzionale(
      e.descrizione,
      e.descrizione_en,
      locale,
    ),
    data_evento: e.data_evento,
  }));
}

// "2026-09-12" → "sabato 12 settembre".
//
// Il mezzogiorno UTC nella costruzione della data non è un dettaglio:
// con la mezzanotte, un fuso indietro rispetto a UTC farebbe
// arretrare la data di un giorno.
//
// Duplica la funzione scritta in linea dentro ExperienceEventi.tsx
// (componente della home, fuori scope in questo step). Da unificare
// quando si toccherà quel file.
export function formatDataEvento(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "it-IT", {
    timeZone: "Europe/Rome",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}
