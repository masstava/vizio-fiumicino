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
      className="flex min-h-11 w-full items-center font-sans text-sm text-muted-dark hover:text-cream-text transition-colors text-left md:min-h-0"
    >
      Esci
    </button>
  );
}
