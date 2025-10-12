import { Job } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Helper function to extract skills from job description
function extractJobSkills(jobDescription: string): string[] {
  if (!jobDescription) return [];
  
  // Common tech skills and keywords to look for
  const skillKeywords = [
    // Programming languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin',
    // Frontend
    'react', 'vue', 'angular', 'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
    // Backend
    'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails',
    // Databases
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab',
    // Other
    'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'testing', 'ci/cd'
  ];
  
  const foundSkills: string[] = [];
  const lowerDescription = jobDescription.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (lowerDescription.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
}

export const jobMatchingService = {
  async calculateJobMatch(supabase: SupabaseClient<Database>, userId: string, job: Job): Promise<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  }> {
    // Get user profile from the materialized view
    const { data: userProfile, error } = await supabase
      .from('user_master_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !userProfile) {
      console.error('Error fetching user profile for job matching:', error);
      return { score: 0, matchedSkills: [], missingSkills: [] };
    }

    // Extract job skills from job description
    const jobSkills = extractJobSkills(job.jobDescription || '');

    // Get user skills from the materialized view
    const userSkills = (userProfile.skills as any[])?.map((s: { name: string }) => s.name.toLowerCase()) || [];

    // Calculate matched skills
    const matchedSkills = userSkills.filter((skill: string) =>
      jobSkills.some((jobSkill: string) => jobSkill.includes(skill) || skill.includes(jobSkill))
    );

    // Calculate missing skills
    const missingSkills = jobSkills.filter((skill: string) =>
      !userSkills.some((userSkill: string) => userSkill.includes(skill) || skill.includes(userSkill))
    );

    // Calculate match score (percentage of job skills matched)
    const score = jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

    return {
      score,
      matchedSkills,
      missingSkills
    };
  },

  async batchCalculateJobMatches(supabase: SupabaseClient<Database>, userId: string, jobs: Job[]): Promise<Map<string, {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  }>> {
    const results = new Map();

    // Get user profile once for all jobs
    const { data: userProfile, error } = await supabase
      .from('user_master_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !userProfile) {
      console.error('Error fetching user profile for batch job matching:', error);
      return results;
    }

    // Get user skills from the materialized view
    const userSkills = (userProfile.skills as any[])?.map((s: { name: string }) => s.name.toLowerCase()) || [];

    // Process each job
    for (const job of jobs) {
      const matchResult = await this.calculateJobMatch(supabase, userId, job);
      results.set(job.id, matchResult);
    }

    return results;
  },

  // Store job match result in database
  async storeJobMatch(supabase: SupabaseClient<Database>, jobId: string, userId: string, resumeId: string | null, matchResult: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  }) {
    const { data, error } = await supabase
      .from('job_matches')
      .upsert({
        job_id: jobId,
        user_id: userId,
        resume_id: resumeId,
        match_score: matchResult.score,
        matching_skills: matchResult.matchedSkills,
        missing_skills: matchResult.missingSkills
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get stored job match
  async getJobMatch(supabase: SupabaseClient<Database>, jobId: string, userId: string) {
    const { data, error } = await supabase
      .from('job_matches')
      .select('*')
      .eq('job_id', jobId)
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }
}
