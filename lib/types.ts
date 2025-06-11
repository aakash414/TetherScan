import { z } from 'zod'

export const jobStatusEnum = z.enum(['wishlist', 'applied', 'interviewing', 'offered', 'rejected'])
export const salaryFrequencyEnum = z.enum(['hourly', 'monthly', 'yearly'])

export type JobStatus = z.infer<typeof jobStatusEnum>
export type SalaryFrequency = z.infer<typeof salaryFrequencyEnum>

export interface Job {
  id: string
  company: string
  location: string
  remote: boolean
  role: string
  status: JobStatus
  expectedSalaryMin: string
  expectedSalaryMax: string
  salaryFrequency: SalaryFrequency
  jobUrl: string
  jobDescription: string
  notes?: string | undefined;
  user_id?: string;
  attachedResumeId?: string | null;
  generated_resume_id?: string | null;
  generated_resume_title?: string | null;
  created_at?: string;
}

export interface JobFormData extends Omit<Job, 'id'> {
  attachedResumeId?: string | null;
}

export interface JobsState {
  wishlist: Job[]
  applied: Job[]
  interviewing: Job[]
  offered: Job[]
  rejected: Job[]
}

export interface Column {
  id: JobStatus
  title: string
  color: string
}
