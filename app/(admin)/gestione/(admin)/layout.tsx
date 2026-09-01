import { createClient } from "@/src/lib/supabase/server";
import { AdminShell } from "./_components/AdminShell";

export default async function GestioneAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Contatore reale per la voce "Menu" della sidebar — vedi § Sidebar
  // in DASHBOARD_DESIGN_SYSTEM.md. Vive nel layout (non nella pagina
  // /gestione/menu) perché la sidebar è visibile da ogni sezione, non
  // solo da quella.
  const { count: piattiAttivi } = await supabase
    .from("piatti")
    .select("id", { count: "exact", head: true })
    .eq("disponibile", true);

  return (
    <AdminShell contatori={{ menu: piattiAttivi ?? 0 }}>{children}</AdminShell>
  );
}
