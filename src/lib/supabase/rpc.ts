import type { Database } from "@/src/lib/database.types";

/**
 * Argomenti di una funzione Postgres, con i parametri riportati a
 * nullable.
 *
 * Il generatore di tipi di Supabase emette gli argomenti delle
 * funzioni sempre non-nullable, perché non modella la nullabilità dei
 * parametri PL/pgSQL. Nelle nostre funzioni però il NULL è parte del
 * contratto: `save_piatto` si dirama proprio su `p_id is null` per
 * distinguere inserimento da aggiornamento, e descrizione, prezzo o
 * foto possono legittimamente mancare (sono `text`/`numeric` semplici,
 * senza `not null`).
 *
 * Tipizzare l'oggetto degli argomenti con questo tipo mantiene il
 * controllo sui nomi delle chiavi e sui tipi dei valori: l'unica cosa
 * che resta asserita al passaggio a `.rpc()` è che il NULL è ammesso.
 */
export type ArgomentiRpc<N extends keyof Database["public"]["Functions"]> = {
  [K in keyof Database["public"]["Functions"][N]["Args"]]:
    | Database["public"]["Functions"][N]["Args"][K]
    | null;
};

/** Firma stretta attesa da `.rpc()`, per il cast al punto di chiamata. */
export type ArgomentiRpcStretti<
  N extends keyof Database["public"]["Functions"],
> = Database["public"]["Functions"][N]["Args"];
