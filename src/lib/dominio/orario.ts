// Tipi di dominio degli orari di apertura.
//
// Nel progetto convivono più forme di "orario", e NON vanno unificate
// tutte: descrivono momenti diversi della stessa informazione.
//
//   qui                                  → il sito pubblico
//   .../orari/_components/types.ts       → lo stato del form in
//                                          dashboard, dove i campi
//                                          possono essere vuoti
//                                          (apertura/chiusura nullable)
//   src/lib/pdf/OrariDocument.tsx        → la forma attesa dal
//                                          generatore di PDF
//
// Accorparle costringerebbe il sito a gestire campi nullable che sul
// sito non esistono mai. Quello che invece era una duplicazione vera
// — FasciaOraria definita identica sia qui sia dentro Footer.tsx —
// è stato risolto: ora esiste solo in questo file.

/** Una fascia di apertura. "HH:MM", confrontabile lessicograficamente. */
export interface FasciaOraria {
  apertura: string;
  chiusura: string;
}

/** Un giorno così come viene mostrato sul sito: etichetta già tradotta. */
export interface GiornoOrario {
  nome: string;
  chiuso: boolean;
  fasce: FasciaOraria[];
}

/**
 * Le fasce di un giorno indicizzate per numero, forma richiesta dal
 * calcolo aperto/chiuso.
 * giorno_settimana: 0 = Lunedì ... 6 = Domenica (stessa convenzione di
 * /gestione/orari e della route del PDF orari).
 */
export interface FasceGiorno {
  giorno_settimana: number;
  fasce: FasciaOraria[];
}
