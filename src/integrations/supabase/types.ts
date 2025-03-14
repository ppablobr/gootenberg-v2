export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          event_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          event_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          event_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      google_news: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_url: string | null
          link_1: string | null
          link_2: string | null
          news_url: string | null
          position: number | null
          published_at: string | null
          source: string | null
          status: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at: string
          id?: string
          image_url?: string | null
          link_1?: string | null
          link_2?: string | null
          news_url?: string | null
          position?: number | null
          published_at?: string | null
          source?: string | null
          status?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          link_1?: string | null
          link_2?: string | null
          news_url?: string | null
          position?: number | null
          published_at?: string | null
          source?: string | null
          status?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          description: string | null
          features: string | null
          id: string
          is_popular: boolean | null
          plan_name: string | null
          price: number | null
        }
        Insert: {
          description?: string | null
          features?: string | null
          id?: string
          is_popular?: boolean | null
          plan_name?: string | null
          price?: number | null
        }
        Update: {
          description?: string | null
          features?: string | null
          id?: string
          is_popular?: boolean | null
          plan_name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      texts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          id: number
          image_url: string | null
          keywords: string | null
          language: string | null
          meta_description: string | null
          original_text: string | null
          original_url: string | null
          source_url: string | null
          status: string | null
          subtitle: string | null
          text_type: string | null
          title: string | null
          type: Database["public"]["Enums"]["text_type"]
          updated_at: string | null
          user_id: string | null
          wordpress_link: string | null
          wordpress_post_id: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          keywords?: string | null
          language?: string | null
          meta_description?: string | null
          original_text?: string | null
          original_url?: string | null
          source_url?: string | null
          status?: string | null
          subtitle?: string | null
          text_type?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["text_type"]
          updated_at?: string | null
          user_id?: string | null
          wordpress_link?: string | null
          wordpress_post_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          keywords?: string | null
          language?: string | null
          meta_description?: string | null
          original_text?: string | null
          original_url?: string | null
          source_url?: string | null
          status?: string | null
          subtitle?: string | null
          text_type?: string | null
          title?: string | null
          type?: Database["public"]["Enums"]["text_type"]
          updated_at?: string | null
          user_id?: string | null
          wordpress_link?: string | null
          wordpress_post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "texts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_production: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          email: string | null
          google_news_id: string | null
          id: string
          image_url: string | null
          keywords: string | null
          news_date: string | null
          news_source: string | null
          news_title: string | null
          news_url: string | null
          published_at: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          google_news_id?: string | null
          id?: string
          image_url?: string | null
          keywords?: string | null
          news_date?: string | null
          news_source?: string | null
          news_title?: string | null
          news_url?: string | null
          published_at?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          google_news_id?: string | null
          id?: string
          image_url?: string | null
          keywords?: string | null
          news_date?: string | null
          news_source?: string | null
          news_title?: string | null
          news_url?: string | null
          published_at?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          avatar_url: string | null
          email: string | null
          id: string
          language_preference: string
          last_updated: string | null
          name: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          language_preference?: string
          last_updated?: string | null
          name?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          language_preference?: string
          last_updated?: string | null
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          billing_period: string | null
          created_at: string
          email: string | null
          id: number
          plan_id: string | null
          status: string | null
          trial: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_period?: string | null
          created_at?: string
          email?: string | null
          id?: number
          plan_id?: string | null
          status?: string | null
          trial?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_period?: string | null
          created_at?: string
          email?: string | null
          id?: number
          plan_id?: string | null
          status?: string | null
          trial?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      wordpress_settings: {
        Row: {
          active: boolean | null
          created_at: string
          email: string | null
          id: string
          password: string | null
          token: string | null
          updated_at: string | null
          url: string | null
          user_id: string | null
          username: string | null
          wordpress_username: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          password?: string | null
          token?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
          username?: string | null
          wordpress_username?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          email?: string | null
          id?: string
          password?: string | null
          token?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
          username?: string | null
          wordpress_username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_access: {
        Args: {
          resource_user_id: string
        }
        Returns: boolean
      }
      delete_user_data:
        | {
            Args: Record<PropertyKey, never>
            Returns: undefined
          }
        | {
            Args: {
              user_id_input: string
            }
            Returns: undefined
          }
      log_user_deletion:
        | {
            Args: {
              user_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              user_id_input: string
              details_input: Json
            }
            Returns: undefined
          }
      update_texts_updated_at: {
        Args: {
          text_id: number
        }
        Returns: undefined
      }
      update_wordpress_settings_updated_at: {
        Args: {
          setting_id: number
        }
        Returns: undefined
      }
    }
    Enums: {
      text_status: "published" | "in_progress" | "in_review"
      text_type: "rewrite" | "optimize" | "news"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
