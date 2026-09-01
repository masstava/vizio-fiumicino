import { createClient } from "@/src/lib/supabase/server";
import { oggiEOraRoma } from "@/src/lib/prenotazioni/disponibilita";
import { AdminShell } from "./_components/AdminShell";

export default async function GestioneAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Contatori reali per le voci della sidebar — vedi § Sidebar in
  // DASHBOARD_DESIGN_SYSTEM.md. Vivono nel layout (non nella singola
  // pagina) perché la sidebar è visibile da ogni sezione, non solo
  // dalla propria. Tre letture indipendenti, partono insieme.
  //
  // "Oggi" nel fuso di Roma (stesso helper già usato da
  // /gestione/prenotazioni), non la data UTC del server: un contatore
  // "di oggi" calcolato in UTC potrebbe cambiare giorno alcune ore
  // prima o dopo la mezzanotte reale — corretto qui rispetto alla
  // prima versione di questo file (passaggio 3/6), che usava la data
  // UTC del server per il contatore eventi.
  const oggi = oggiEOraRoma().data;
  const [{ count: piattiAttivi }, { count: eventiAttivi }, { count: prenotazioniOggi }] =
    await Promise.all([
      supabase
        .from("piatti")
        .select("id", { count: "exact", head: true })
        .eq("disponibile", true),
      // "Eventi futuri attivi": attivi E non ancora passati. Un evento
      // ricorrente (data_evento nullo) non ha mai una data passata —
      // resta sempre incluso.
      supabase
        .from("eventi")
        .select("id", { count: "exact", head: true })
        .eq("attivo", true)
        .or(`data_evento.is.null,data_evento.gte.${oggi}`),
      // "Prenotazioni di oggi": della data odierna, non cancellate —
      // scelta motivata fra le due offerte dalla specifica ("di oggi"
      // o "in attesa"): "in attesa" non esiste nel modello dati reale
      // (stato è confermata/cancellata/completata/no-show), "di oggi"
      // sì ed è il numero che chi apre la dashboard al mattino vuole
      // vedere per primo.
      supabase
        .from("prenotazioni")
        .select("id", { count: "exact", head: true })
        .eq("data", oggi)
        .neq("stato", "cancellata"),
    ]);

  return (
    <AdminShell
      contatori={{
        menu: piattiAttivi ?? 0,
        eventi: eventiAttivi ?? 0,
        prenotazioni: prenotazioniOggi ?? 0,
      }}
    >
      {children}
    </AdminShell>
  );
}
