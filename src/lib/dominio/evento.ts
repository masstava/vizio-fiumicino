// Tipi di dominio degli eventi, per il sito pubblico.

/**
 * Evento mostrato in home. titolo e descrizione arrivano già risolti
 * nella lingua attiva, con ricaduta sull'italiano se manca la
 * traduzione: il componente non deve sapere nulla di titolo_en.
 */
export interface EventoInEvidenza {
  id: string;
  titolo: string;
  descrizione: string | null;
  data_evento: string | null;
}
