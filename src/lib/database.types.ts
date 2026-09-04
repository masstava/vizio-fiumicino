export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      allergeni: {
        Row: {
          id: number
          nome_en: string
          nome_it: string
        }
        Insert: {
          id: number
          nome_en: string
          nome_it: string
        }
        Update: {
          id?: number
          nome_en?: string
          nome_it?: string
        }
        Relationships: []
      }
      badge: {
        Row: {
          id: string
          piatto_id: string
          testo: string
          testo_en: string | null
        }
        Insert: {
          id?: string
          piatto_id: string
          testo: string
          testo_en?: string | null
        }
        Update: {
          id?: string
          piatto_id?: string
          testo?: string
          testo_en?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "badge_piatto_id_fkey"
            columns: ["piatto_id"]
            isOneToOne: false
            referencedRelation: "piatti"
            referencedColumns: ["id"]
          },
        ]
      }
      campi_extra_evento: {
        Row: {
          etichetta: string
          evento_id: string
          id: string
          ordine: number
        }
        Insert: {
          etichetta: string
          evento_id: string
          id?: string
          ordine?: number
        }
        Update: {
          etichetta?: string
          evento_id?: string
          id?: string
          ordine?: number
        }
        Relationships: [
          {
            foreignKeyName: "campi_extra_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventi"
            referencedColumns: ["id"]
          },
        ]
      }
      capienza_config: {
        Row: {
          data: string
          evento_id: string | null
          fascia: string
          limite_coperti: number | null
        }
        Insert: {
          data: string
          evento_id?: string | null
          fascia: string
          limite_coperti?: number | null
        }
        Update: {
          data?: string
          evento_id?: string | null
          fascia?: string
          limite_coperti?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "capienza_config_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventi"
            referencedColumns: ["id"]
          },
        ]
      }
      categorie: {
        Row: {
          categoria_macro_id: string
          id: string
          nome: string
          nome_en: string | null
          ordine: number
        }
        Insert: {
          categoria_macro_id: string
          id?: string
          nome: string
          nome_en?: string | null
          ordine?: number
        }
        Update: {
          categoria_macro_id?: string
          id?: string
          nome?: string
          nome_en?: string | null
          ordine?: number
        }
        Relationships: [
          {
            foreignKeyName: "categorie_categoria_macro_id_fkey"
            columns: ["categoria_macro_id"]
            isOneToOne: false
            referencedRelation: "categorie_macro"
            referencedColumns: ["id"]
          },
        ]
      }
      categorie_macro: {
        Row: {
          id: string
          nome: string
          nome_en: string | null
          ordine: number
        }
        Insert: {
          id?: string
          nome: string
          nome_en?: string | null
          ordine?: number
        }
        Update: {
          id?: string
          nome?: string
          nome_en?: string | null
          ordine?: number
        }
        Relationships: []
      }
      contenuti_sito: {
        Row: {
          chiave: string
          valore: string | null
          valore_en: string | null
        }
        Insert: {
          chiave: string
          valore?: string | null
          valore_en?: string | null
        }
        Update: {
          chiave?: string
          valore?: string | null
          valore_en?: string | null
        }
        Relationships: []
      }
      coupon: {
        Row: {
          attivo: boolean
          codice: string
          creato_il: string
          descrizione: string | null
          email: string | null
          id: string
          tipo: string
          utilizzo_massimo: number | null
          valido_al: string | null
          valido_dal: string | null
        }
        Insert: {
          attivo?: boolean
          codice: string
          creato_il?: string
          descrizione?: string | null
          email?: string | null
          id?: string
          tipo: string
          utilizzo_massimo?: number | null
          valido_al?: string | null
          valido_dal?: string | null
        }
        Update: {
          attivo?: boolean
          codice?: string
          creato_il?: string
          descrizione?: string | null
          email?: string | null
          id?: string
          tipo?: string
          utilizzo_massimo?: number | null
          valido_al?: string | null
          valido_dal?: string | null
        }
        Relationships: []
      }
      coupon_utilizzi: {
        Row: {
          coupon_id: string
          id: string
          utilizzato_il: string
        }
        Insert: {
          coupon_id: string
          id?: string
          utilizzato_il?: string
        }
        Update: {
          coupon_id?: string
          id?: string
          utilizzato_il?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_utilizzi_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon"
            referencedColumns: ["id"]
          },
        ]
      }
      eventi: {
        Row: {
          attivo: boolean
          data_evento: string | null
          descrizione: string | null
          descrizione_en: string | null
          id: string
          titolo: string
          titolo_en: string | null
        }
        Insert: {
          attivo?: boolean
          data_evento?: string | null
          descrizione?: string | null
          descrizione_en?: string | null
          id?: string
          titolo: string
          titolo_en?: string | null
        }
        Update: {
          attivo?: boolean
          data_evento?: string | null
          descrizione?: string | null
          descrizione_en?: string | null
          id?: string
          titolo?: string
          titolo_en?: string | null
        }
        Relationships: []
      }
      limite_richieste_newsletter: {
        Row: {
          creata_il: string
          id: number
          ip: string
        }
        Insert: {
          creata_il?: string
          id?: number
          ip: string
        }
        Update: {
          creata_il?: string
          id?: number
          ip?: string
        }
        Relationships: []
      }
      limite_richieste_prenotazione: {
        Row: {
          creata_il: string
          id: number
          ip: string
        }
        Insert: {
          creata_il?: string
          id?: number
          ip: string
        }
        Update: {
          creata_il?: string
          id?: number
          ip?: string
        }
        Relationships: []
      }
      media_pagine: {
        Row: {
          aggiornata_il: string
          pagina: string
          slot: string
          tipo: string
          url: string | null
        }
        Insert: {
          aggiornata_il?: string
          pagina: string
          slot?: string
          tipo?: string
          url?: string | null
        }
        Update: {
          aggiornata_il?: string
          pagina?: string
          slot?: string
          tipo?: string
          url?: string | null
        }
        Relationships: []
      }
      orari: {
        Row: {
          apertura: string | null
          chiusura: string | null
          giorno_settimana: number
          id: string
          ordine: number
        }
        Insert: {
          apertura?: string | null
          chiusura?: string | null
          giorno_settimana: number
          id?: string
          ordine?: number
        }
        Update: {
          apertura?: string | null
          chiusura?: string | null
          giorno_settimana?: number
          id?: string
          ordine?: number
        }
        Relationships: []
      }
      orari_config: {
        Row: {
          id: boolean
          nota: string | null
          valida_fino_al: string | null
        }
        Insert: {
          id?: boolean
          nota?: string | null
          valida_fino_al?: string | null
        }
        Update: {
          id?: boolean
          nota?: string | null
          valida_fino_al?: string | null
        }
        Relationships: []
      }
      piatti: {
        Row: {
          categoria_id: string
          descrizione: string | null
          descrizione_en: string | null
          disponibile: boolean
          foto_url: string | null
          id: string
          nome: string
          nome_en: string | null
          ordine: number
          prezzo: number | null
          prezzo_variabile: boolean
        }
        Insert: {
          categoria_id: string
          descrizione?: string | null
          descrizione_en?: string | null
          disponibile?: boolean
          foto_url?: string | null
          id?: string
          nome: string
          nome_en?: string | null
          ordine?: number
          prezzo?: number | null
          prezzo_variabile?: boolean
        }
        Update: {
          categoria_id?: string
          descrizione?: string | null
          descrizione_en?: string | null
          disponibile?: boolean
          foto_url?: string | null
          id?: string
          nome?: string
          nome_en?: string | null
          ordine?: number
          prezzo?: number | null
          prezzo_variabile?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "piatti_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorie"
            referencedColumns: ["id"]
          },
        ]
      }
      piatti_allergeni: {
        Row: {
          allergene_id: number
          piatto_id: string
        }
        Insert: {
          allergene_id: number
          piatto_id: string
        }
        Update: {
          allergene_id?: number
          piatto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "piatti_allergeni_allergene_id_fkey"
            columns: ["allergene_id"]
            isOneToOne: false
            referencedRelation: "allergeni"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "piatti_allergeni_piatto_id_fkey"
            columns: ["piatto_id"]
            isOneToOne: false
            referencedRelation: "piatti"
            referencedColumns: ["id"]
          },
        ]
      }
      piatti_anteprima_home: {
        Row: {
          ordine: number
          piatto_id: string
        }
        Insert: {
          ordine?: number
          piatto_id: string
        }
        Update: {
          ordine?: number
          piatto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "piatti_anteprima_home_piatto_id_fkey"
            columns: ["piatto_id"]
            isOneToOne: true
            referencedRelation: "piatti"
            referencedColumns: ["id"]
          },
        ]
      }
      piatti_in_evidenza: {
        Row: {
          ordine: number
          piatto_id: string
        }
        Insert: {
          ordine?: number
          piatto_id: string
        }
        Update: {
          ordine?: number
          piatto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "piatti_in_evidenza_piatto_id_fkey"
            columns: ["piatto_id"]
            isOneToOne: true
            referencedRelation: "piatti"
            referencedColumns: ["id"]
          },
        ]
      }
      prenotazioni: {
        Row: {
          aggiornata_il: string
          coperti: number
          creata_il: string
          data: string
          email: string | null
          evento_id: string | null
          fascia: string
          id: string
          locale: string
          nome: string
          note: string | null
          risposte_extra: Json | null
          stato: string
          telefono: string
          token_gestione: string
        }
        Insert: {
          aggiornata_il?: string
          coperti: number
          creata_il?: string
          data: string
          email?: string | null
          evento_id?: string | null
          fascia: string
          id?: string
          locale?: string
          nome: string
          note?: string | null
          risposte_extra?: Json | null
          stato?: string
          telefono: string
          token_gestione?: string
        }
        Update: {
          aggiornata_il?: string
          coperti?: number
          creata_il?: string
          data?: string
          email?: string | null
          evento_id?: string | null
          fascia?: string
          id?: string
          locale?: string
          nome?: string
          note?: string | null
          risposte_extra?: Json | null
          stato?: string
          telefono?: string
          token_gestione?: string
        }
        Relationships: [
          {
            foreignKeyName: "prenotazioni_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventi"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      annulla_prenotazione: {
        Args: { p_token: string }
        Returns: {
          coperti: number
          data: string
          email: string | null
          evento_titolo: string | null
          fascia: string
          id: string
          locale: string
          nome: string
          note: string | null
          risposte_extra: Json | null
          telefono: string
        }[]
      }
      capienza_del_giorno: {
        Args: { p_data: string }
        Returns: {
          fascia: string
          limite_coperti: number | null
          occupati: number
        }[]
      }
      crea_prenotazione: {
        Args: {
          p_coperti: number
          p_data: string
          p_email: string
          p_evento_id: string
          p_fascia: string
          p_locale: string
          p_nome: string
          p_note: string
          p_risposte_extra: Json
          p_telefono: string
        }
        Returns: {
          id: string
          token_gestione: string
        }[]
      }
      ip_chiamante: {
        Args: Record<string, never>
        Returns: string
      }
      iscriviti_newsletter: {
        Args: { p_email: string }
        Returns: string
      }
      prenotazione_da_token: {
        Args: { p_token: string }
        Returns: {
          coperti: number
          creata_il: string
          data: string
          evento_id: string | null
          evento_titolo: string | null
          evento_titolo_en: string | null
          fascia: string
          id: string
          nome: string
          note: string | null
          risposte_extra: Json | null
          stato: string
        }[]
      }
      reorder_piatti: {
        Args: { p_categoria_id: string; p_ordini: Json }
        Returns: undefined
      }
      riscatta_coupon: {
        Args: { p_codice: string }
        Returns: Json
      }
      save_evento: {
        Args: {
          p_attivo: boolean
          p_campi_extra: Json
          p_data_evento: string
          p_descrizione: string
          p_descrizione_en: string
          p_id: string
          p_titolo: string
          p_titolo_en: string
        }
        Returns: string
      }
      save_orari: { Args: { p_rows: Json }; Returns: undefined }
      save_piatto: {
        Args: {
          p_allergeni: number[]
          p_anteprima_home: boolean
          p_anteprima_home_ordine: number
          p_badges: Json
          p_categoria_id: string
          p_descrizione: string
          p_descrizione_en: string
          p_disponibile: boolean
          p_foto_url: string
          p_id: string
          p_in_evidenza: boolean
          p_in_evidenza_ordine: number
          p_nome: string
          p_nome_en: string
          p_prezzo: number
          p_prezzo_variabile: boolean
        }
        Returns: string
      }
      verifica_limite_richieste: {
        Args: Record<string, never>
        Returns: boolean
      }
      verifica_limite_richieste_newsletter: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
