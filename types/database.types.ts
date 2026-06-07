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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      booking_items: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          item_id: string
          item_type: string
          line_total: number
          position: number | null
          quantity: number
          title: string
          tour_departure_id: string | null
          unit_price: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          line_total: number
          position?: number | null
          quantity?: number
          title: string
          tour_departure_id?: string | null
          unit_price: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          line_total?: number
          position?: number | null
          quantity?: number
          title?: string
          tour_departure_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_items_tour_departure_id_fkey"
            columns: ["tour_departure_id"]
            isOneToOne: false
            referencedRelation: "tour_departures"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          created_at: string
          currency: string
          end_date: string | null
          guest_email: string | null
          guest_name: string | null
          id: string
          notes: string | null
          party_size: number
          payment_status: string
          start_date: string | null
          status: string
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          end_date?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          notes?: string | null
          party_size?: number
          payment_status?: string
          start_date?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          end_date?: string | null
          guest_email?: string | null
          guest_name?: string | null
          id?: string
          notes?: string | null
          party_size?: number
          payment_status?: string
          start_date?: string | null
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          is_public: boolean
          location: string | null
          name: string | null
          phone: string | null
          role: string
          socials: Json
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          is_public?: boolean
          location?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          socials?: Json
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          name?: string | null
          phone?: string | null
          role?: string
          socials?: Json
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          rating: number
          subject_id: string
          subject_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          rating: number
          subject_id: string
          subject_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          rating?: number
          subject_id?: string
          subject_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          active: boolean
          ascent_m: number
          created_at: string
          days: number
          description: Json
          difficulty: string
          distance_km: number
          dog_friendly: boolean
          duration_hours: number
          gradient: string | null
          highlights: Json
          id: string
          image: string | null
          lat: number
          lng: number
          name: string
          region: string
          seasons: Json
          summary: string
          terrain: Json
          updated_at: string
        }
        Insert: {
          active?: boolean
          ascent_m: number
          created_at?: string
          days: number
          description?: Json
          difficulty: string
          distance_km: number
          dog_friendly: boolean
          duration_hours: number
          gradient?: string | null
          highlights?: Json
          id: string
          image?: string | null
          lat: number
          lng: number
          name: string
          region: string
          seasons?: Json
          summary: string
          terrain?: Json
          updated_at?: string
        }
        Update: {
          active?: boolean
          ascent_m?: number
          created_at?: string
          days?: number
          description?: Json
          difficulty?: string
          distance_km?: number
          dog_friendly?: boolean
          duration_hours?: number
          gradient?: string | null
          highlights?: Json
          id?: string
          image?: string | null
          lat?: number
          lng?: number
          name?: string
          region?: string
          seasons?: Json
          summary?: string
          terrain?: Json
          updated_at?: string
        }
        Relationships: []
      }
      stays: {
        Row: {
          active: boolean
          amenities: Json
          created_at: string
          gradient: string | null
          id: string
          lat: number
          lng: number
          max_guests: number
          name: string
          price_per_night: number
          rating: number
          region: string
          summary: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          amenities?: Json
          created_at?: string
          gradient?: string | null
          id: string
          lat: number
          lng: number
          max_guests?: number
          name: string
          price_per_night: number
          rating: number
          region: string
          summary: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          amenities?: Json
          created_at?: string
          gradient?: string | null
          id?: string
          lat?: number
          lng?: number
          max_guests?: number
          name?: string
          price_per_night?: number
          rating?: number
          region?: string
          summary?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          confirmed_at: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          source: string | null
          status: string
          token: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          source?: string | null
          status?: string
          token?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          source?: string | null
          status?: string
          token?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tour_departures: {
        Row: {
          capacity: number
          created_at: string
          departure_date: string
          id: string
          price_per_person: number | null
          seats_remaining: number
          status: string
          tour_id: string
          updated_at: string
        }
        Insert: {
          capacity: number
          created_at?: string
          departure_date: string
          id?: string
          price_per_person?: number | null
          seats_remaining: number
          status?: string
          tour_id: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          created_at?: string
          departure_date?: string
          id?: string
          price_per_person?: number | null
          seats_remaining?: number
          status?: string
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_departures_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          active: boolean
          created_at: string
          days: number
          description: Json
          difficulty: string
          gradient: string | null
          group_size: string
          guided: boolean
          id: string
          image: string | null
          includes: Json
          lat: number
          lng: number
          name: string
          price_per_person: number
          region: string
          summary: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          days: number
          description?: Json
          difficulty: string
          gradient?: string | null
          group_size: string
          guided: boolean
          id: string
          image?: string | null
          includes?: Json
          lat: number
          lng: number
          name: string
          price_per_person: number
          region: string
          summary: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          days?: number
          description?: Json
          difficulty?: string
          gradient?: string | null
          group_size?: string
          guided?: boolean
          id?: string
          image?: string | null
          includes?: Json
          lat?: number
          lng?: number
          name?: string
          price_per_person?: number
          region?: string
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          location: string | null
          socials: Json | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          location?: string | null
          socials?: Json | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          location?: string | null
          socials?: Json | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_booking_availability: {
        Args: {
          p_end: string
          p_items: Json
          p_party_size: number
          p_start: string
        }
        Returns: Json
      }
      create_booking: {
        Args: {
          p_end: string
          p_guest_email: string
          p_guest_name: string
          p_items: Json
          p_party_size: number
          p_start: string
        }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
  public: {
    Enums: {},
  },
} as const
