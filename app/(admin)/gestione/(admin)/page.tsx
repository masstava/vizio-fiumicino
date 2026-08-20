import { createClient } from "@/src/lib/supabase/server";

export default async function GestionePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Dashboard
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink">Bentornato</h1>
      {user?.email && (
        <p className="font-sans text-sm text-muted mt-2">{user.email}</p>
      )}
    </div>
  );
}
