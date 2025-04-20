import { createClient } from '../client'
import type { Job, JobFormData } from '@/lib/types'

export const jobsService = {
  async createJob(job: JobFormData) {
    const supabase = createClient()
    // Log the job payload
    console.log('[jobsService.createJob] Payload:', job)
    // Log Supabase env vars
    console.log('[jobsService.createJob] SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('[jobsService.createJob] SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing')
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert(job)
        .select()
        .single()
      if (error) {
        // Log the error response
        console.error('[jobsService.createJob] Supabase error:', error)
        throw error
      }
      // Log the returned data
      console.log('[jobsService.createJob] Created job:', data)
      return data
    } catch (err) {
      // Log any thrown error
      console.error('[jobsService.createJob] Thrown error:', err)
      throw err
    }
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