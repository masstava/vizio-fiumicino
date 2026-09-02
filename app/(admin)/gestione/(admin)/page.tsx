import { createClient } from "@/src/lib/supabase/server";

export default async function GestionePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-8 md:p-12">
      <p className="font-serif text-2xl font-medium text-admin-text">Bentornato</p>
      {user?.email && (
        <p className="font-sans text-sm text-admin-text-2 mt-2">{user.email}</p>
      )}
    </div>
  );
}
