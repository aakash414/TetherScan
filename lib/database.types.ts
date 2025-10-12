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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          github_username: string | null
          linkedin_id: string | null
          portfolio_url: string | null
          bio: string | null
          profile_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: string
          github_username?: string | null
          linkedin_id?: string | null
          portfolio_url?: string | null
          bio?: string | null
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          github_username?: string | null
          linkedin_id?: string | null
          portfolio_url?: string | null
          bio?: string | null
          profile_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          id: string
          user_id: string
          company: string
          role: string
          location: string | null
          remote: boolean
          status: 'wishlist' | 'applied' | 'interviewing' | 'offered' | 'rejected'
          expected_salary_min: string | null
          expected_salary_max: string | null
          salary_frequency: 'hourly' | 'monthly' | 'yearly'
          job_url: string | null
          job_description: string | null
          notes: string | null
          attached_resume_id: string | null
          generated_resume_id: string | null
          generated_resume_title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          role: string
          location?: string | null
          remote?: boolean
          status?: 'wishlist' | 'applied' | 'interviewing' | 'offered' | 'rejected'
          expected_salary_min?: string | null
          expected_salary_max?: string | null
          salary_frequency?: 'hourly' | 'monthly' | 'yearly'
          job_url?: string | null
          job_description?: string | null
          notes?: string | null
          attached_resume_id?: string | null
          generated_resume_id?: string | null
          generated_resume_title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          role?: string
          location?: string | null
          remote?: boolean
          status?: 'wishlist' | 'applied' | 'interviewing' | 'offered' | 'rejected'
          expected_salary_min?: string | null
          expected_salary_max?: string | null
          salary_frequency?: 'hourly' | 'monthly' | 'yearly'
          job_url?: string | null
          job_description?: string | null
          notes?: string | null
          attached_resume_id?: string | null
          generated_resume_id?: string | null
          generated_resume_title?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_attached_resume_fkey"
            columns: ["attached_resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_generated_resume_fkey"
            columns: ["generated_resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          }
        ]
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: Json | null
          html_content: string | null
          pdf_url: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content?: Json | null
          html_content?: string | null
          pdf_url?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: Json | null
          html_content?: string | null
          pdf_url?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      experiences: {
        Row: {
          id: string
          user_id: string
          title: string
          company: string
          start_date: string | null
          end_date: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          company: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          company?: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      education: {
        Row: {
          id: string
          user_id: string
          school: string
          degree: string
          field: string | null
          start_date: string | null
          end_date: string | null
          grade: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          school: string
          degree: string
          field?: string | null
          start_date?: string | null
          end_date?: string | null
          grade?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          school?: string
          degree?: string
          field?: string | null
          start_date?: string | null
          end_date?: string | null
          grade?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      skills: {
        Row: {
          id: string
          user_id: string
          name: string
          proficiency: 'beginner' | 'intermediate' | 'advanced'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          proficiency?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          proficiency?: 'beginner' | 'intermediate' | 'advanced'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          github_url: string | null
          live_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          github_url?: string | null
          live_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          github_url?: string | null
          live_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      volunteer: {
        Row: {
          id: string
          user_id: string
          organization: string
          role: string
          start_date: string | null
          end_date: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization: string
          role: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization?: string
          role?: string
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          name: string
          issuer: string
          issue_date: string | null
          expiry_date: string | null
          certification_id: string | null
          certification_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          issuer: string
          issue_date?: string | null
          expiry_date?: string | null
          certification_id?: string | null
          certification_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          issuer?: string
          issue_date?: string | null
          expiry_date?: string | null
          certification_id?: string | null
          certification_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      languages: {
        Row: {
          id: string
          user_id: string
          language: string
          proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: string
          proficiency?: 'basic' | 'conversational' | 'fluent' | 'native'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          proficiency?: 'basic' | 'conversational' | 'fluent' | 'native'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "languages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      job_matches: {
        Row: {
          id: string
          job_id: string
          user_id: string
          resume_id: string | null
          match_score: number | null
          matching_skills: Json | null
          missing_skills: Json | null
          recommendations: string | null
          created_at: string
        }
        Insert: {
          id?: string
          job_id: string
          user_id: string
          resume_id?: string | null
          match_score?: number | null
          matching_skills?: Json | null
          missing_skills?: Json | null
          recommendations?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          user_id?: string
          resume_id?: string | null
          match_score?: number | null
          matching_skills?: Json | null
          missing_skills?: Json | null
          recommendations?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_matches_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      user_master_profiles: {
        Row: {
          id: string
          name: string
          email: string
          github_username: string | null
          linkedin_id: string | null
          portfolio_url: string | null
          bio: string | null
          profile_image: string | null
          created_at: string
          updated_at: string
          experiences: Json
          education: Json
          skills: Json
          projects: Json
          volunteer: Json
          certifications: Json
          languages: Json
        }
        Relationships: []
      }
    }
    Functions: {
      add_custom_role_to_jwt: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      set_user_role: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      get_user_profile_for_resume: {
        Args: {
          target_user_id: string
        }
        Returns: Json
      }
      refresh_user_master_profiles: {
        Args: {}
        Returns: undefined
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