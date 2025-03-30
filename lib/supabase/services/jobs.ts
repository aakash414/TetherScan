import { createClient } from '../client'
import type { Job, JobFormData } from '@/lib/types'

export const jobsService = {
  async createJob(job: JobFormData) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getJobs() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      
    if (error) throw error
    return data
  },
  // ... other job-related operations
} 