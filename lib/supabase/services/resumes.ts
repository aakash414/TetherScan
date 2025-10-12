import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

export interface ResumeData {
  id?: string
  title: string
  content?: any
  html_content?: string | null
  pdf_url?: string | null
  is_default?: boolean
}

export const resumesService = {
  // Get all resumes for a user
  async getResumes(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get a specific resume
  async getResume(supabase: SupabaseClient<Database>, resumeId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get user's default resume
  async getDefaultResume(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Create a new resume
  async createResume(supabase: SupabaseClient<Database>, userId: string, resumeData: ResumeData) {
    // If this is set as default, unset other defaults first
    if (resumeData.is_default) {
      await supabase
        .from('resumes')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('is_default', true)
    }

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        ...resumeData,
        user_id: userId
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update a resume
  async updateResume(supabase: SupabaseClient<Database>, resumeId: string, resumeData: Partial<ResumeData>) {
    // If this is being set as default, unset other defaults first
    if (resumeData.is_default) {
      const { data: resume } = await supabase
        .from('resumes')
        .select('user_id')
        .eq('id', resumeId)
        .single()
      
      if (resume) {
        await supabase
          .from('resumes')
          .update({ is_default: false })
          .eq('user_id', resume.user_id)
          .eq('is_default', true)
      }
    }

    const { data, error } = await supabase
      .from('resumes')
      .update({
        ...resumeData,
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete a resume
  async deleteResume(supabase: SupabaseClient<Database>, resumeId: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId)
    
    if (error) throw error
  },

  // Set a resume as default
  async setDefaultResume(supabase: SupabaseClient<Database>, resumeId: string) {
    // Get the resume to find the user_id
    const { data: resume } = await supabase
      .from('resumes')
      .select('user_id')
      .eq('id', resumeId)
      .single()
    
    if (!resume) throw new Error('Resume not found')

    // Unset all other defaults for this user
    await supabase
      .from('resumes')
      .update({ is_default: false })
      .eq('user_id', resume.user_id)
      .eq('is_default', true)

    // Set this resume as default
    const { data, error } = await supabase
      .from('resumes')
      .update({ is_default: true })
      .eq('id', resumeId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Generate a resume from user profile
  async generateResumeFromProfile(supabase: SupabaseClient<Database>, userId: string, title: string) {
    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_user_profile_for_resume', { target_user_id: userId })
    
    if (profileError) throw profileError

    // Create resume with profile data
    const resumeData: ResumeData = {
      title,
      content: profileData,
      is_default: false
    }

    return this.createResume(supabase, userId, resumeData)
  }
}