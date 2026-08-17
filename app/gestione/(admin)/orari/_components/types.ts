export interface OrarioFasciaRow {
  id: string;
  ordine: number;
  apertura: string | null;
  chiusura: string | null;
}

export interface OrarioGiornoRow {
  giorno_settimana: number;
  nome: string;
  fasce: OrarioFasciaRow[];
}
