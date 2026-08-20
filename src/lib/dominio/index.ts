// Punto unico da cui importare i tipi di dominio del sito pubblico.
//
//   import type { PiattoConBadge } from "@/src/lib/dominio";
//
// Restano volutamente FUORI da qui due famiglie di tipi che
// descrivono momenti diversi degli stessi dati e che accorpare
// peggiorerebbe le cose (vedi la nota in orario.ts): lo stato dei
// form di dashboard e le forme attese dal generatore di PDF.
export type {
  PiattoAnteprima,
  PiattoConBadge,
  PiattoDettaglio,
  PiattoRiga,
} from "./piatto";
export type { EventoInEvidenza } from "./evento";
export type { FasciaOraria, GiornoOrario, FasceGiorno } from "./orario";
