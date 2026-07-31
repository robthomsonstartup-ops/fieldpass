export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          user_id: string
          name: string
          city: string
          state: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          city: string
          state: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          city?: string
          state?: string
          created_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          organization_id: string
          name: string
          age_group: string
          play_level: string[] | null
          travel_radius_miles: number | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          age_group: string
          play_level?: string[] | null
          travel_radius_miles?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          age_group?: string
          play_level?: string[] | null
          travel_radius_miles?: number | null
          status?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      fields: {
        Row: {
          id: string
          organization_id: string
          name: string
          address: string | null
          city: string | null
          state: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          address?: string | null
          city?: string | null
          state?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          address?: string | null
          city?: string | null
          state?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fields_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      availability_posts: {
        Row: {
          id: string
          team_id: string
          field_id: string | null
          date_start: string
          date_end: string
          game_format: string
          host_type: string | null
          num_games_desired: number | null
          notes: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          field_id?: string | null
          date_start: string
          date_end: string
          game_format: string
          host_type?: string | null
          num_games_desired?: number | null
          notes?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          field_id?: string | null
          date_start?: string
          date_end?: string
          game_format?: string
          host_type?: string | null
          num_games_desired?: number | null
          notes?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_posts_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      game_requests: {
        Row: {
          id: string
          requester_team_id: string
          recipient_team_id: string
          availability_post_id: string | null
          proposed_date: string
          num_games: number
          message: string | null
          game_format: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          requester_team_id: string
          recipient_team_id: string
          availability_post_id?: string | null
          proposed_date: string
          num_games: number
          message?: string | null
          game_format: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          requester_team_id?: string
          recipient_team_id?: string
          availability_post_id?: string | null
          proposed_date?: string
          num_games?: number
          message?: string | null
          game_format?: string
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_requests_requester_team_id_fkey"
            columns: ["requester_team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_requests_recipient_team_id_fkey"
            columns: ["recipient_team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      conversations: {
        Row: {
          id: string
          team_1_id: string
          team_2_id: string
          game_request_id: string
          created_at: string
        }
        Insert: {
          id?: string
          team_1_id: string
          team_2_id: string
          game_request_id: string
          created_at?: string
        }
        Update: {
          id?: string
          team_1_id?: string
          team_2_id?: string
          game_request_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_game_request_id_fkey"
            columns: ["game_request_id"]
            referencedRelation: "game_requests"
            referencedColumns: ["id"]
          }
        ]
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
