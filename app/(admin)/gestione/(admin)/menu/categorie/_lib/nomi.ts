// Validazione dei nomi di macro-categorie e sotto-categorie, condivisa
// fra l'editor (feedback immediato) e le server action (la verifica
// che conta). Modulo normale, non "use server": un file "use server"
// non deve esportare tipi (§ Server actions in DEFINITION_OF_DONE.md).

export interface NomiInput {
  nome: string;
  nomeEn: string;
}

export interface NomiPuliti {
  nome: string;
  /** null = nessuna traduzione: il sito ricade sul nome italiano (§12). */
  nomeEn: string | null;
}

export type Esito = { ok: true } | { ok: false; errore: string };

export function pulisciNomi(input: NomiInput): NomiPuliti | { errore: string } {
  const nome = input.nome.trim().replace(/\s+/g, " ");
  const nomeEn = input.nomeEn.trim().replace(/\s+/g, " ");
  if (!nome) return { errore: "Il nome in italiano è obbligatorio." };
  if (nome.length > 80 || nomeEn.length > 80) return { errore: "Nome troppo lungo (massimo 80 caratteri)." };
  return { nome, nomeEn: nomeEn || null };
}

// Senza distinguere maiuscole/minuscole: "Gin" e "GIN" nella stessa
// macro sarebbero indistinguibili nei filtri della dashboard, che
// lavorano sul nome.
export function nomeGiaUsato(
  nome: string,
  esistenti: { id: string; nome: string }[],
  escludiId?: string,
): boolean {
  const n = nome.toLocaleLowerCase("it-IT");
  return esistenti.some((e) => e.id !== escludiId && e.nome.trim().toLocaleLowerCase("it-IT") === n);
}

export function testoPiatti(n: number): string {
  return n === 1 ? "1 piatto usa" : `${n} piatti usano`;
}

export function testoSottoCategorie(n: number): string {
  return n === 1 ? "1 sotto-categoria" : `${n} sotto-categorie`;
}
