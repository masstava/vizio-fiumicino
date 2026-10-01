"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import {
  nomeGiaUsato,
  pulisciNomi,
  testoPiatti,
  testoSottoCategorie,
  type Esito,
  type NomiInput,
} from "./_lib/nomi";

// Editor categorie (§ Menu → Categorie). Ogni action restituisce un
// Esito invece di lanciare per gli errori previsti (nome mancante,
// duplicato, eliminazione bloccata): sono messaggi per l'utente, non
// guasti. Lancia solo per errori inattesi del database.
//
// Il blocco delle eliminazioni ha due livelli: qui si conta e si
// risponde con il numero reale; sotto, le FK "on delete restrict"
// (migration 20260910000000) fanno rifiutare al database stesso
// qualunque delete di una categoria ancora in uso — il conteggio può
// essere superato da un piatto aggiunto un istante dopo, la FK no.

const VIOLAZIONE_FK = "23503";

function aggiorna() {
  revalidatePath("/gestione/menu");
  revalidatePath("/gestione/menu/categorie");
}

async function contaPiatti(supabase: Awaited<ReturnType<typeof createClient>>, categoriaId: string) {
  const { count, error } = await supabase
    .from("piatti")
    .select("id", { count: "exact", head: true })
    .eq("categoria_id", categoriaId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function contaSottoCategorie(supabase: Awaited<ReturnType<typeof createClient>>, macroId: string) {
  const { count, error } = await supabase
    .from("categorie")
    .select("id", { count: "exact", head: true })
    .eq("categoria_macro_id", macroId);
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// ---------------------------------------------------------------
// Macro-categorie
// ---------------------------------------------------------------

export async function creaMacro(input: NomiInput): Promise<Esito> {
  const nomi = pulisciNomi(input);
  if ("errore" in nomi) return { ok: false, errore: nomi.errore };

  const supabase = await createClient();
  const { data: esistenti, error } = await supabase.from("categorie_macro").select("id, nome, ordine");
  if (error) throw new Error(error.message);
  if (nomeGiaUsato(nomi.nome, esistenti ?? [])) {
    return { ok: false, errore: `Esiste già una macro-categoria "${nomi.nome}".` };
  }

  const ordine = Math.max(-1, ...(esistenti ?? []).map((m) => m.ordine)) + 1;
  const { error: errIns } = await supabase
    .from("categorie_macro")
    .insert({ nome: nomi.nome, nome_en: nomi.nomeEn, ordine });
  if (errIns) throw new Error(errIns.message);
  aggiorna();
  return { ok: true };
}

export async function rinominaMacro(id: string, input: NomiInput): Promise<Esito> {
  const nomi = pulisciNomi(input);
  if ("errore" in nomi) return { ok: false, errore: nomi.errore };

  const supabase = await createClient();
  const { data: esistenti, error } = await supabase.from("categorie_macro").select("id, nome");
  if (error) throw new Error(error.message);
  if (nomeGiaUsato(nomi.nome, esistenti ?? [], id)) {
    return { ok: false, errore: `Esiste già una macro-categoria "${nomi.nome}".` };
  }

  const { error: errUpd } = await supabase
    .from("categorie_macro")
    .update({ nome: nomi.nome, nome_en: nomi.nomeEn })
    .eq("id", id);
  if (errUpd) throw new Error(errUpd.message);
  aggiorna();
  return { ok: true };
}

export async function eliminaMacro(id: string): Promise<Esito> {
  const supabase = await createClient();

  // Una macro con ruolo (cucina/bar) alimenta home e vetrina del bar,
  // e il ruolo non si riassegna dalla dashboard: eliminarla lo
  // perderebbe senza modo di rimetterlo.
  const { data: macro, error: errMacro } = await supabase
    .from("categorie_macro")
    .select("ruolo")
    .eq("id", id)
    .single();
  if (errMacro) throw new Error(errMacro.message);
  if (macro.ruolo) {
    return {
      ok: false,
      errore: `Non si può eliminare: è la macro-categoria ${macro.ruolo === "bar" ? "del bar" : "della cucina"}, usata da home e vetrina del bar. Puoi rinominarla.`,
    };
  }

  const n = await contaSottoCategorie(supabase, id);
  if (n > 0) {
    return {
      ok: false,
      errore: `Non si può eliminare: contiene ${testoSottoCategorie(n)}. Spostale in un'altra macro-categoria o eliminale prima.`,
    };
  }

  const { error } = await supabase.from("categorie_macro").delete().eq("id", id);
  if (error?.code === VIOLAZIONE_FK) {
    const ora = await contaSottoCategorie(supabase, id);
    return { ok: false, errore: `Non si può eliminare: contiene ${testoSottoCategorie(ora)}. Spostale in un'altra macro-categoria o eliminale prima.` };
  }
  if (error) throw new Error(error.message);
  aggiorna();
  return { ok: true };
}

export async function riordinaMacro(idsInOrdine: string[]): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("riordina_categorie_macro", {
    p_ordini: idsInOrdine.map((id, ordine) => ({ id, ordine })),
  });
  if (error) throw new Error(error.message);
  aggiorna();
}

// ---------------------------------------------------------------
// Sotto-categorie
// ---------------------------------------------------------------

async function nomiNellaMacro(supabase: Awaited<ReturnType<typeof createClient>>, macroId: string) {
  const { data, error } = await supabase
    .from("categorie")
    .select("id, nome, ordine")
    .eq("categoria_macro_id", macroId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function creaCategoria(macroId: string, input: NomiInput): Promise<Esito> {
  const nomi = pulisciNomi(input);
  if ("errore" in nomi) return { ok: false, errore: nomi.errore };

  const supabase = await createClient();
  const esistenti = await nomiNellaMacro(supabase, macroId);
  if (nomeGiaUsato(nomi.nome, esistenti)) {
    return { ok: false, errore: `In questa macro-categoria esiste già "${nomi.nome}".` };
  }

  const ordine = Math.max(-1, ...esistenti.map((c) => c.ordine)) + 1;
  const { error } = await supabase
    .from("categorie")
    .insert({ categoria_macro_id: macroId, nome: nomi.nome, nome_en: nomi.nomeEn, ordine });
  if (error) throw new Error(error.message);
  aggiorna();
  return { ok: true };
}

export async function rinominaCategoria(id: string, input: NomiInput): Promise<Esito> {
  const nomi = pulisciNomi(input);
  if ("errore" in nomi) return { ok: false, errore: nomi.errore };

  const supabase = await createClient();
  const { data: riga, error } = await supabase
    .from("categorie")
    .select("categoria_macro_id")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  if (nomeGiaUsato(nomi.nome, await nomiNellaMacro(supabase, riga.categoria_macro_id), id)) {
    return { ok: false, errore: `In questa macro-categoria esiste già "${nomi.nome}".` };
  }

  const { error: errUpd } = await supabase
    .from("categorie")
    .update({ nome: nomi.nome, nome_en: nomi.nomeEn })
    .eq("id", id);
  if (errUpd) throw new Error(errUpd.message);
  aggiorna();
  return { ok: true };
}

export async function spostaCategoria(id: string, macroId: string): Promise<Esito> {
  const supabase = await createClient();
  const { data: riga, error } = await supabase.from("categorie").select("nome").eq("id", id).single();
  if (error) throw new Error(error.message);
  if (nomeGiaUsato(riga.nome, await nomiNellaMacro(supabase, macroId), id)) {
    return { ok: false, errore: `La macro-categoria di destinazione ha già una sotto-categoria "${riga.nome}". Rinominala prima di spostarla.` };
  }

  // In coda alla macro di destinazione, macro e posizione nello stesso
  // statement (RPC). I piatti seguono la categoria da soli.
  const { error: errRpc } = await supabase.rpc("sposta_categoria", {
    p_categoria_id: id,
    p_categoria_macro_id: macroId,
  });
  if (errRpc) throw new Error(errRpc.message);
  aggiorna();
  return { ok: true };
}

export async function eliminaCategoria(id: string): Promise<Esito> {
  const supabase = await createClient();
  const n = await contaPiatti(supabase, id);
  if (n > 0) {
    return {
      ok: false,
      errore: `Non si può eliminare: ${testoPiatti(n)} questa sotto-categoria. Spostali in un'altra sotto-categoria o eliminali prima.`,
    };
  }

  const { error } = await supabase.from("categorie").delete().eq("id", id);
  if (error?.code === VIOLAZIONE_FK) {
    const ora = await contaPiatti(supabase, id);
    return { ok: false, errore: `Non si può eliminare: ${testoPiatti(ora)} questa sotto-categoria. Spostali in un'altra sotto-categoria o eliminali prima.` };
  }
  if (error) throw new Error(error.message);
  aggiorna();
  return { ok: true };
}

export async function riordinaCategorie(macroId: string, idsInOrdine: string[]): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("riordina_categorie", {
    p_categoria_macro_id: macroId,
    p_ordini: idsInOrdine.map((id, ordine) => ({ id, ordine })),
  });
  if (error) throw new Error(error.message);
  aggiorna();
}
