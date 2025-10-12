import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Types for profile data
export interface UserProfileData {
  name?: string
  email?: string
  github_username?: string | null
  linkedin_id?: string | null
  portfolio_url?: string | null
  bio?: string | null
  profile_image?: string | null
}

export interface ExperienceData {
  id?: string
  title: string
  company: string
  start_date?: string | null
  end_date?: string | null
  description?: string | null
}

export interface EducationData {
  id?: string
  school: string
  degree: string
  field?: string | null
  start_date?: string | null
  end_date?: string | null
  grade?: string | null
  description?: string | null
}

export interface SkillData {
  id?: string
  name: string
  proficiency?: 'beginner' | 'intermediate' | 'advanced'
}

export interface ProjectData {
  id?: string
  title: string
  description?: string | null
  github_url?: string | null
  live_url?: string | null
}

export interface VolunteerData {
  id?: string
  organization: string
  role: string
  start_date?: string | null
  end_date?: string | null
  description?: string | null
}

export interface CertificationData {
  id?: string
  name: string
  issuer: string
  issue_date?: string | null
  expiry_date?: string | null
  certification_id?: string | null
  certification_url?: string | null
}

export interface LanguageData {
  id?: string
  language: string
  proficiency?: 'basic' | 'conversational' | 'fluent' | 'native'
}

// Profile service for server-side operations
export const profilesService = {
  // User profile operations
  async getUserProfile(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async upsertUserProfile(supabase: SupabaseClient<Database>, userId: string, profileData: UserProfileData) {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Experience operations
  async getExperiences(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertExperiences(supabase: SupabaseClient<Database>, userId: string, experiences: ExperienceData[]) {
    const experiencesToUpsert = experiences.map(exp => ({
      ...exp,
      user_id: userId,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('experiences')
      .upsert(experiencesToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Education operations
  async getEducation(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertEducation(supabase: SupabaseClient<Database>, userId: string, education: EducationData[]) {
    const educationToUpsert = education.map(edu => ({
      ...edu,
      user_id: userId,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('education')
      .upsert(educationToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Skills operations
  async getSkills(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    
    if (error) throw error
    return data
  },

  async upsertSkills(supabase: SupabaseClient<Database>, userId: string, skills: SkillData[]) {
    const skillsToUpsert = skills.map(skill => ({
      ...skill,
      user_id: userId
    }))

    const { data, error } = await supabase
      .from('skills')
      .upsert(skillsToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Projects operations
  async getProjects(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertProjects(supabase: SupabaseClient<Database>, userId: string, projects: ProjectData[]) {
    const projectsToUpsert = projects.map(project => ({
      ...project,
      user_id: userId,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('projects')
      .upsert(projectsToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Volunteer operations
  async getVolunteer(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('volunteer')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertVolunteer(supabase: SupabaseClient<Database>, userId: string, volunteer: VolunteerData[]) {
    const volunteerToUpsert = volunteer.map(vol => ({
      ...vol,
      user_id: userId,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('volunteer')
      .upsert(volunteerToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Certifications operations
  async getCertifications(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async upsertCertifications(supabase: SupabaseClient<Database>, userId: string, certifications: CertificationData[]) {
    const certificationsToUpsert = certifications.map(cert => ({
      ...cert,
      user_id: userId,
      updated_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('certifications')
      .upsert(certificationsToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Languages operations
  async getLanguages(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .eq('user_id', userId)
      .order('language')
    
    if (error) throw error
    return data
  },

  async upsertLanguages(supabase: SupabaseClient<Database>, userId: string, languages: LanguageData[]) {
    const languagesToUpsert = languages.map(lang => ({
      ...lang,
      user_id: userId
    }))

    const { data, error } = await supabase
      .from('languages')
      .upsert(languagesToUpsert)
      .select()
    
    if (error) throw error
    return data
  },

  // Get complete user profile using materialized view
  async getUserMasterProfile(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .from('user_master_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get user profile for resume generation using RPC
  async getUserProfileForResume(supabase: SupabaseClient<Database>, userId: string) {
    const { data, error } = await supabase
      .rpc('get_user_profile_for_resume', { target_user_id: userId })
    
    if (error) throw error
    return data
  },

  // Create a new user record
  async createUser(supabase: SupabaseClient<Database>, userId: string, email: string, name?: string) {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email,
        name: name || email.split('@')[0],
        role: 'user'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}