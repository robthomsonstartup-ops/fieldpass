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
          play_level: string | null
          travel_radius_miles: number | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          age_group: string
          play_level?: string | null
          travel_radius_miles?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          age_group?: string
          play_level?: string | null
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
      availability_posts: {
        Row: {
          id: string
          team_id: string
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
      requests: {
        Row: {
          id: string
          post_id: string
          sender_team_id: string
          recipient_team_id: string
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          sender_team_id: string
          recipient_team_id: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          sender_team_id?: string
          recipient_team_id?: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "availability_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_sender_team_id_fkey"
            columns: ["sender_team_id"]
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_recipient_team_id_fkey"
            columns: ["recipient_team_id"]
            referencedRelation: "teams"
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
