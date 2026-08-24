import { AdminShell } from "./_components/AdminShell";

export default function GestioneAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
