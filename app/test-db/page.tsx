import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function TestDbPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("allergeni")
    .select("id, nome_it")
    .order("id");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-serif font-semibold">Test connessione DB</h1>

      {error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Errore</p>
          <pre className="mt-1 text-sm">{error.message}</pre>
        </div>
      ) : (
        <div className="rounded border border-green-300 bg-green-50 p-4 text-green-800">
          <p className="font-semibold">Connessione OK</p>
          <p className="mt-1 text-sm">
            Tabella <code>allergeni</code>: {data.length} righe
          </p>
        </div>
      )}
    </main>
  );
}
