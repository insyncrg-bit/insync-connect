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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      connection_requests: {
        Row: {
          created_at: string
          id: string
          requester_type: string
          requester_user_id: string
          status: string
          sync_note: string | null
          target_type: string
          target_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requester_type: string
          requester_user_id: string
          status?: string
          sync_note?: string | null
          target_type: string
          target_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requester_type?: string
          requester_user_id?: string
          status?: string
          sync_note?: string | null
          target_type?: string
          target_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      engagement_tracking: {
        Row: {
          action_date: string
          action_type: string
          application_id: string | null
          id: string
          investor_id: string | null
          metadata: Json | null
        }
        Insert: {
          action_date?: string
          action_type: string
          application_id?: string | null
          id?: string
          investor_id?: string | null
          metadata?: Json | null
        }
        Update: {
          action_date?: string
          action_type?: string
          application_id?: string | null
          id?: string
          investor_id?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_tracking_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "founder_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagement_tracking_investor_id_fkey"
            columns: ["investor_id"]
            isOneToOne: false
            referencedRelation: "investors"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          location: string | null
          max_attendees: number | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          title?: string
        }
        Relationships: []
      }
      founder_applications: {
        Row: {
          application_sections: Json | null
          business_model: string
          calendly_link: string | null
          company_name: string
          created_at: string
          current_ask: string
          email: string
          founder_name: string
          funding_goal: string
          id: string
          location: string
          logo_url: string | null
          pitchdeck_url: string | null
          stage: string
          status: string | null
          team_members: Json | null
          traction: string
          updated_at: string
          user_id: string | null
          vertical: string
          website: string | null
        }
        Insert: {
          application_sections?: Json | null
          business_model: string
          calendly_link?: string | null
          company_name: string
          created_at?: string
          current_ask: string
          email: string
          founder_name: string
          funding_goal: string
          id?: string
          location: string
          logo_url?: string | null
          pitchdeck_url?: string | null
          stage: string
          status?: string | null
          team_members?: Json | null
          traction: string
          updated_at?: string
          user_id?: string | null
          vertical: string
          website?: string | null
        }
        Update: {
          application_sections?: Json | null
          business_model?: string
          calendly_link?: string | null
          company_name?: string
          created_at?: string
          current_ask?: string
          email?: string
          founder_name?: string
          funding_goal?: string
          id?: string
          location?: string
          logo_url?: string | null
          pitchdeck_url?: string | null
          stage?: string
          status?: string | null
          team_members?: Json | null
          traction?: string
          updated_at?: string
          user_id?: string | null
          vertical?: string
          website?: string | null
        }
        Relationships: []
      }
      investor_applications: {
        Row: {
          aum: string | null
          b2b_b2c: string | null
          b2b_b2c_why: string | null
          board_involvement: string | null
          buyer_persona_required: boolean | null
          buyer_persona_who: string | null
          calendly_link: string | null
          check_sizes: Json | null
          conflicts_policy: string | null
          contacts: Json | null
          created_at: string
          customer_types: Json | null
          customer_verticals: string | null
          decision_process: string | null
          fast_signals: Json | null
          feedback_when: string | null
          firm_description: string | null
          firm_name: string
          follow_on_reserves: string | null
          follow_on_when: string | null
          fund_type: string | null
          fund_vintage: string | null
          geographic_focus: string | null
          geographic_focus_detail: string | null
          geographies_covered: Json | null
          gives_no_with_feedback: boolean | null
          hard_nos: Json | null
          hq_location: string | null
          id: string
          invests_in_competitors: boolean | null
          lead_follow: string | null
          minimum_traction: Json | null
          nda_conditions: string | null
          non_negotiables: Json | null
          operating_support: Json | null
          ownership_target: string | null
          pain_severity: string | null
          partner_categories: string | null
          portfolio_count: string | null
          portfolio_list: string | null
          public_profile: boolean | null
          ranked_metrics: Json | null
          regulated_industries: string | null
          revenue_models: Json | null
          sector_tags: Json | null
          signs_ndas: boolean | null
          stage_focus: Json | null
          status: string | null
          sub_themes: Json | null
          sub_themes_other: string | null
          support_style: string | null
          talent_networks: Json | null
          thesis_statement: string | null
          time_to_decision: string | null
          time_to_first_response: string | null
          top_investments: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          aum?: string | null
          b2b_b2c?: string | null
          b2b_b2c_why?: string | null
          board_involvement?: string | null
          buyer_persona_required?: boolean | null
          buyer_persona_who?: string | null
          calendly_link?: string | null
          check_sizes?: Json | null
          conflicts_policy?: string | null
          contacts?: Json | null
          created_at?: string
          customer_types?: Json | null
          customer_verticals?: string | null
          decision_process?: string | null
          fast_signals?: Json | null
          feedback_when?: string | null
          firm_description?: string | null
          firm_name: string
          follow_on_reserves?: string | null
          follow_on_when?: string | null
          fund_type?: string | null
          fund_vintage?: string | null
          geographic_focus?: string | null
          geographic_focus_detail?: string | null
          geographies_covered?: Json | null
          gives_no_with_feedback?: boolean | null
          hard_nos?: Json | null
          hq_location?: string | null
          id?: string
          invests_in_competitors?: boolean | null
          lead_follow?: string | null
          minimum_traction?: Json | null
          nda_conditions?: string | null
          non_negotiables?: Json | null
          operating_support?: Json | null
          ownership_target?: string | null
          pain_severity?: string | null
          partner_categories?: string | null
          portfolio_count?: string | null
          portfolio_list?: string | null
          public_profile?: boolean | null
          ranked_metrics?: Json | null
          regulated_industries?: string | null
          revenue_models?: Json | null
          sector_tags?: Json | null
          signs_ndas?: boolean | null
          stage_focus?: Json | null
          status?: string | null
          sub_themes?: Json | null
          sub_themes_other?: string | null
          support_style?: string | null
          talent_networks?: Json | null
          thesis_statement?: string | null
          time_to_decision?: string | null
          time_to_first_response?: string | null
          top_investments?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          aum?: string | null
          b2b_b2c?: string | null
          b2b_b2c_why?: string | null
          board_involvement?: string | null
          buyer_persona_required?: boolean | null
          buyer_persona_who?: string | null
          calendly_link?: string | null
          check_sizes?: Json | null
          conflicts_policy?: string | null
          contacts?: Json | null
          created_at?: string
          customer_types?: Json | null
          customer_verticals?: string | null
          decision_process?: string | null
          fast_signals?: Json | null
          feedback_when?: string | null
          firm_description?: string | null
          firm_name?: string
          follow_on_reserves?: string | null
          follow_on_when?: string | null
          fund_type?: string | null
          fund_vintage?: string | null
          geographic_focus?: string | null
          geographic_focus_detail?: string | null
          geographies_covered?: Json | null
          gives_no_with_feedback?: boolean | null
          hard_nos?: Json | null
          hq_location?: string | null
          id?: string
          invests_in_competitors?: boolean | null
          lead_follow?: string | null
          minimum_traction?: Json | null
          nda_conditions?: string | null
          non_negotiables?: Json | null
          operating_support?: Json | null
          ownership_target?: string | null
          pain_severity?: string | null
          partner_categories?: string | null
          portfolio_count?: string | null
          portfolio_list?: string | null
          public_profile?: boolean | null
          ranked_metrics?: Json | null
          regulated_industries?: string | null
          revenue_models?: Json | null
          sector_tags?: Json | null
          signs_ndas?: boolean | null
          stage_focus?: Json | null
          status?: string | null
          sub_themes?: Json | null
          sub_themes_other?: string | null
          support_style?: string | null
          talent_networks?: Json | null
          thesis_statement?: string | null
          time_to_decision?: string | null
          time_to_first_response?: string | null
          top_investments?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      investors: {
        Row: {
          active: boolean | null
          bio: string | null
          check_size: string
          created_at: string
          firm_name: string
          id: string
          investment_stage: string
          logo_url: string | null
          name: string
          portfolio_count: number | null
          sectors: Json | null
        }
        Insert: {
          active?: boolean | null
          bio?: string | null
          check_size: string
          created_at?: string
          firm_name: string
          id?: string
          investment_stage: string
          logo_url?: string | null
          name: string
          portfolio_count?: number | null
          sectors?: Json | null
        }
        Update: {
          active?: boolean | null
          bio?: string | null
          check_size?: string
          created_at?: string
          firm_name?: string
          id?: string
          investment_stage?: string
          logo_url?: string | null
          name?: string
          portfolio_count?: number | null
          sectors?: Json | null
        }
        Relationships: []
      }
      mentors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          expertise: Json | null
          id: string
          name: string
          title: string
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          expertise?: Json | null
          id?: string
          name: string
          title: string
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          expertise?: Json | null
          id?: string
          name?: string
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_user_id: string
          sender_user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_user_id: string
          sender_user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_user_id?: string
          sender_user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
