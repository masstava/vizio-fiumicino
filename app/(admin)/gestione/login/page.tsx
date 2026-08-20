"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase/client";
import { Button } from "@/src/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Credenziali non valide. Verifica email e password.");
      setLoading(false);
      return;
    }

    router.push("/gestione");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <div className="w-full max-w-[340px]">
        {/* Intestazione */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-medium text-cream-text">
            Vizio Bistrot
          </h1>
          <p className="font-sans text-xs tracking-[0.18em] uppercase text-muted-dark mt-1.5">
            Gestione
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="font-sans text-[10px] tracking-widest uppercase text-muted-dark block mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-cream-text/20 rounded-[2px] px-3 py-2.5 font-sans text-sm text-cream-text placeholder:text-muted-dark focus:outline-none focus:border-cream-text/50 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="font-sans text-[10px] tracking-widest uppercase text-muted-dark block mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-cream-text/20 rounded-[2px] px-3 py-2.5 font-sans text-sm text-cream-text placeholder:text-muted-dark focus:outline-none focus:border-cream-text/50 transition-colors"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="font-sans text-sm text-red-400 pt-1"
            >
              {error}
            </p>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center"
            >
              {loading ? "Accesso in corso…" : "Accedi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
