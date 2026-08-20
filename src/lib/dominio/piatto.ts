// Tipi di dominio del piatto, per il sito pubblico.
//
// Sono organizzati per QUANTO del piatto serve, non per componente che
// li disegna: prima vivevano dentro FeaturedDishSlide, CompactDishCard
// e DishDetailDialog, cioè il modello dati era di proprietà del
// componente che lo mostrava. Con sette pagine pubbliche in arrivo
// significava che ognuna avrebbe importato il proprio tipo da un
// componente di presentazione diverso.
//
// Nomi e campi seguono le colonne del database (nome, descrizione,
// foto_url), così il passaggio riga → interfaccia resta leggibile.

/** Il minimo per mostrare un piatto: anteprime, slider, card. */
export interface PiattoAnteprima {
  id: string;
  nome: string;
  descrizione: string | null;
  foto_url: string | null;
  /** Facoltativo: non tutte le viste lo leggono. */
  badge?: string | null;
}

/** Anteprima in cui il badge è sempre stato letto (può valere null). */
export interface PiattoConBadge extends PiattoAnteprima {
  badge: string | null;
}

/** Scheda di dettaglio: aggiunge gli allergeni per esteso. */
export interface PiattoDettaglio extends PiattoAnteprima {
  /**
   * Allergeni già tradotti e scritti per esteso. Assenti in home:
   * l'anteprima non li legge di proposito. Li passerà la pagina menu
   * completo.
   */
  allergeni?: string[];
}
