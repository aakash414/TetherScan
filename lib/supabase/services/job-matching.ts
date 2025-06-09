import { getUserMasterProfile } from './user-profile';
import { Job } from '@/lib/types';

/**
 * Calculates a match score between a user's profile and a job
 * using the user_master_profile materialized view
 */
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// ... other imports ...

export async function calculateJobMatch(userId: string, job: Job, cookieStore: ReadonlyRequestCookies): Promise<{
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}> {
  // Get user profile from the materialized view
  const { data: userProfile, error } = await getUserMasterProfile(userId, cookieStore);

  if (error || !userProfile) {
    console.error('Error fetching user profile for job matching:', error);
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }

  // Extract job skills using the helper function
  // const jobSkills = extractJobSkills(job.jobDescription, userProfile); // FIXME: extractJobSkills is not defined
  const jobSkills: string[] = []; // Temporary empty array

  // Get user skills from the materialized view
  const userSkills = userProfile.skills?.map((s: { skill_name: string }) => s.skill_name.toLowerCase()) || [];

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
}

/**
 * Batch calculates match scores for multiple jobs
 */
export async function batchCalculateJobMatches(userId: string, jobs: Job[], cookieStore: ReadonlyRequestCookies): Promise<Map<string, {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}>> {
  const results = new Map();

  // Get user profile once for all jobs
  const { data: userProfile, error } = await getUserMasterProfile(userId, cookieStore);

  if (error || !userProfile) {
    console.error('Error fetching user profile for batch job matching:', error);
    return results;
  }

  // Get user skills from the materialized view
  const userSkills = userProfile.skills?.map((s: { skill_name: string }) => s.skill_name.toLowerCase()) || [];

  // Process each job
  for (const job of jobs) {
    // Extract job skills from job description
    const jobDescription = job.jobDescription?.toLowerCase() || '';
    const jobSkillsSet = new Set<string>();

    // Check user skills in job description
    if (userProfile.skills && userProfile.skills.length > 0) {
      userProfile.skills.forEach((skill: { skill_name: string; proficiency: string }) => {
        if (jobDescription.includes(skill.skill_name.toLowerCase())) {
          jobSkillsSet.add(skill.skill_name.toLowerCase());
        }
      });
    }

    // Add common tech skills that might be in the job description
    const commonTechSkills = [
      'javascript', 'typescript', 'react', 'node', 'python', 'java', 'c#', 'c++',
      'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'aws', 'azure', 'gcp',
      'docker', 'kubernetes', 'ci/cd', 'git', 'agile', 'scrum', 'rest', 'graphql'
    ];

    commonTechSkills.forEach(skill => {
      if (jobDescription.includes(skill)) {
        jobSkillsSet.add(skill);
      }
    });

    // Convert to array
    const jobSkills = Array.from(jobSkillsSet);

    // Calculate matched skills
    const matchedSkills = userSkills.filter((skill: string) =>
      jobSkills.some((jobSkill: string) => jobSkill.includes(skill) || skill.includes(jobSkill))
    );

    // Calculate missing skills
    const missingSkills = jobSkills.filter((skill: string) =>
      !userSkills.some((userSkill: string) => userSkill.includes(skill) || skill.includes(userSkill))
    );

    // Calculate match score
    const score = jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

    // Store result
    results.set(job.id, {
      score,
      matchedSkills,
      missingSkills
    });
  }

  return results;
}
