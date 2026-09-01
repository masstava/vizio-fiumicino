import { createClient } from "@/src/lib/supabase/server";
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
  // dalla propria. Due letture indipendenti, partono insieme.
  const oggi = new Date().toISOString().slice(0, 10);
  const [{ count: piattiAttivi }, { count: eventiAttivi }] = await Promise.all([
    supabase
      .from("piatti")
      .select("id", { count: "exact", head: true })
      .eq("disponibile", true),
    // "Eventi futuri attivi": attivi E non ancora passati. Un evento
    // ricorrente (data_evento nullo) non ha mai una data passata — resta
    // sempre incluso.
    supabase
      .from("eventi")
      .select("id", { count: "exact", head: true })
      .eq("attivo", true)
      .or(`data_evento.is.null,data_evento.gte.${oggi}`),
  ]);

  return (
    <AdminShell
      contatori={{ menu: piattiAttivi ?? 0, eventi: eventiAttivi ?? 0 }}
    >
      {children}
    </AdminShell>
  );
}
