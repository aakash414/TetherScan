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
      users: {
        Row: {
          id: string
          email: string
          name: string
          github_username: string | null
          linkedin_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          github_username?: string | null
          linkedin_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          github_username?: string | null
          linkedin_id?: string | null
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          file_path: string
          resume_text: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_path: string
          resume_text?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_path?: string
          resume_text?: string | null
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          source_url: string
          is_github: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description: string
          source_url: string
          is_github: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          source_url?: string
          is_github?: boolean
          updated_at?: string
        }
      }
      job_applications: {
        Row: {
          id: string
          user_id: string
          company_name: string
          job_title: string
          job_description: string
          status: 'wishlist' | 'applied' | 'interviewed' | 'offered'
          resume_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          job_title: string
          job_description: string
          status: 'wishlist' | 'applied' | 'interviewed' | 'offered'
          resume_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          job_title?: string
          job_description?: string
          status?: 'wishlist' | 'applied' | 'interviewed' | 'offered'
          resume_id?: string | null
          updated_at?: string
        }
      }
      suggestions: {
        Row: {
          id: string
          user_id: string
          job_application_id: string
          resume_id: string | null
          suggestion_text: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_application_id: string
          resume_id?: string | null
          suggestion_text: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_application_id?: string
          resume_id?: string | null
          suggestion_text?: string
        }
      }
    }
  }
}
