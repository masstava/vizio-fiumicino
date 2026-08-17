import { SidebarNav } from "./_components/SidebarNav";
import { SignOutButton } from "./_components/SignOutButton";

export default function GestioneAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-dark flex flex-col">
        {/* Testata */}
        <div className="px-6 py-6 border-b border-cream-text/10">
          <p className="font-serif text-lg font-medium text-cream-text leading-tight">
            Vizio Bistrot
          </p>
          <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-muted-dark mt-0.5">
            Gestione
          </p>
        </div>

        {/* Navigazione */}
        <div className="flex-1 py-3">
          <SidebarNav />
        </div>

        {/* Footer sidebar */}
        <div className="px-6 py-5 border-t border-cream-text/10">
          <SignOutButton />
        </div>
      </aside>

      {/* Area principale */}
      <main className="flex-1 bg-cream overflow-auto">{children}</main>
    </div>
  );
}
