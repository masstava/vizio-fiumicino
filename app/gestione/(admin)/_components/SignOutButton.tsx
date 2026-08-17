"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/gestione/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="font-sans text-sm text-muted-dark hover:text-cream-text transition-colors w-full text-left"
    >
      Esci
    </button>
  );
}
