import {
  CHIAVE_LOCALSTORAGE,
  DURATA_GIORNI,
  NOME_COOKIE,
  TUTTO_NEGATO,
  VERSIONE_CONSENSO,
  type ConsensoSalvato,
  type Scelte,
} from "./tipi";

// =============================================================
// Persistenza del consenso — §14.1
// =============================================================
// Due copie della stessa informazione, con ruoli diversi:
//
//   localStorage  → fonte di verità lato client, contiene la scelta
//                   completa (versione, categorie, date).
//   cookie        → specchio compatto, leggibile dal server. Serve a
//                   chi dovrà decidere lato server se emettere un
//                   tag, senza aspettare l'idratazione.
//
// Il cookie è uno specchio, non una seconda fonte: in caso di
// disaccordo vince localStorage, che è quello che l'utente ha
// effettivamente prodotto cliccando.

function normalizza(scelte: Scelte): Scelte {
  // "necessary" non è negoziabile: qualunque cosa arrivi da storage
  // manomesso, resta true.
  return { ...scelte, necessary: true };
}

export function leggiConsenso(): ConsensoSalvato | null {
  if (typeof window === "undefined") return null;
  try {
    const grezzo = window.localStorage.getItem(CHIAVE_LOCALSTORAGE);
    if (!grezzo) return null;

    const salvato = JSON.parse(grezzo) as Partial<ConsensoSalvato>;
    if (!salvato || typeof salvato !== "object") return null;

    // Versione diversa: le finalità sono cambiate, il vecchio consenso
    // non copre le nuove. Si richiede da capo.
    if (salvato.versione !== VERSIONE_CONSENSO) return null;

    if (!salvato.scadeIl || new Date(salvato.scadeIl) <= new Date()) return null;
    if (!salvato.scelte) return null;

    return {
      versione: VERSIONE_CONSENSO,
      scelte: normalizza({ ...TUTTO_NEGATO, ...salvato.scelte }),
      salvatoIl: salvato.salvatoIl ?? new Date().toISOString(),
      scadeIl: salvato.scadeIl,
    };
  } catch {
    // localStorage negato (finestra privata, impostazioni del browser)
    // o JSON corrotto: si tratta come "nessuna scelta".
    return null;
  }
}

export function scriviConsenso(scelte: Scelte): ConsensoSalvato {
  const ora = new Date();
  const scadenza = new Date(ora.getTime() + DURATA_GIORNI * 24 * 60 * 60 * 1000);

  const record: ConsensoSalvato = {
    versione: VERSIONE_CONSENSO,
    scelte: normalizza(scelte),
    salvatoIl: ora.toISOString(),
    scadeIl: scadenza.toISOString(),
  };

  try {
    window.localStorage.setItem(CHIAVE_LOCALSTORAGE, JSON.stringify(record));
  } catch {
    // Se localStorage non è scrivibile resta il cookie: il consenso
    // vale comunque per questa e per le prossime visite.
  }

  scriviCookieSpecchio(record);
  return record;
}

// Specchio compatto: "1|1|0|1|0" = versione | necessary | functional |
// analytics | marketing. Compatto di proposito — un cookie va su ogni
// richiesta, JSON qui sarebbe peso inutile a ogni navigazione.
function scriviCookieSpecchio(record: ConsensoSalvato): void {
  if (typeof document === "undefined") return;
  const s = record.scelte;
  const b = (v: boolean) => (v ? "1" : "0");
  const valore = [
    record.versione,
    b(s.necessary),
    b(s.functional),
    b(s.analytics),
    b(s.marketing),
  ].join("|");

  const secondi = DURATA_GIORNI * 24 * 60 * 60;
  // Nessun flag Secure in chiaro su http: in sviluppo il cookie non
  // verrebbe scritto. In produzione il sito è su https e il browser
  // lo tratta comunque come cookie di prima parte.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${NOME_COOKIE}=${valore}; Max-Age=${secondi}; Path=/; SameSite=Lax${secure}`;
}

/** Cancella la scelta: usata dai test e da un eventuale "revoca tutto". */
export function dimenticaConsenso(): void {
  try {
    window.localStorage.removeItem(CHIAVE_LOCALSTORAGE);
  } catch {
    /* niente da fare */
  }
  if (typeof document !== "undefined") {
    document.cookie = `${NOME_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}
