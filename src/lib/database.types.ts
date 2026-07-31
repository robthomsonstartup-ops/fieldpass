export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          city: string;
          state: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          city: string;
          state: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          city?: string;
          state?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          age_group: string;
          play_levels: string[];
          travel_radius_miles: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          age_group: string;
          play_levels: string[];
          travel_radius_miles: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          age_group?: string;
          play_levels?: string[];
          travel_radius_miles?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
