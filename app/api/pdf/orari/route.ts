import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/src/lib/supabase/server";
import { OrariDocument, type OrarioGiorno } from "@/src/lib/pdf/OrariDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GIORNI_LABELS = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
] as const;

function toDisplayTime(value: string | null | undefined): string | null {
  return value ? value.slice(0, 5) : null;
}

// Il cartello ha spazio per una riga di titolo e una di sottotitolo:
// oltre queste lunghezze il testo non ci starebbe comunque.
//
// Il taglio però serve soprattutto a un'altra cosa: questa route è
// pubblica e non autenticata, e generare un PDF costa CPU. Senza un
// limite, una querystring da decine di migliaia di caratteri farebbe
// comporre a react-pdf un documento enorme a ogni richiesta — un modo
// facile per bruciare tempo di esecuzione.
const MAX_TITOLO = 120;
const MAX_SOTTOTITOLO = 200;

function parametroTesto(
  valore: string | null,
  maxLunghezza: number,
): string | undefined {
  const pulito = valore?.trim();
  if (!pulito) return undefined;
  return pulito.slice(0, maxLunghezza);
}

export async function GET(request: NextRequest) {
  const titolo = parametroTesto(
    request.nextUrl.searchParams.get("titolo"),
    MAX_TITOLO,
  );
  const sottotitolo = parametroTesto(
    request.nextUrl.searchParams.get("sottotitolo"),
    MAX_SOTTOTITOLO,
  );

  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("orari")
    .select("giorno_settimana, ordine, apertura, chiusura")
    .order("giorno_settimana")
    .order("ordine");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const byDay = new Map<
    number,
    { apertura: string | null; chiusura: string | null }[]
  >();
  (rows ?? []).forEach((r) => {
    const arr = byDay.get(r.giorno_settimana) ?? [];
    arr.push({
      apertura: toDisplayTime(r.apertura),
      chiusura: toDisplayTime(r.chiusura),
    });
    byDay.set(r.giorno_settimana, arr);
  });

  const giorni: OrarioGiorno[] = GIORNI_LABELS.map((nome, giorno) => {
    const fasce = byDay.get(giorno) ?? [];
    const chiuso =
      fasce.length === 0 || fasce.every((f) => !f.apertura && !f.chiusura);
    return { nome, chiuso, fasce };
  });

  // OrariDocument non usa hook: chiamarlo come funzione pura restituisce
  // direttamente l'elemento <Document>, il tipo che renderToBuffer si
  // aspetta (passare il componente wrapper via JSX/createElement non
  // tipizza correttamente con le definizioni di @react-pdf/renderer).
  const buffer = await renderToBuffer(
    OrariDocument({ giorni, titolo, sottotitolo }),
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="orari-vizio.pdf"',
    },
  });
}
