import { UserMasterProfile } from '@/types/user-master-profile';
import { UserData } from '@/types/user';

/**
 * Maps the user_master_profile materialized view data to the UserData format
 * used by the frontend components
 */
export function mapMasterProfileToUserData(profile: UserMasterProfile): UserData {
  return {
    name: profile.name,
    email: profile.email,
    github: profile.github_username || '',
    linkedin: profile.linkedin_id || '',
    portfolio: profile.portfolio_url || '',
    bio: profile.bio || '',
    profile_image: profile.profile_image || '',
    
    // Map work experience
    experiences: profile.work_experience?.map(exp => ({
      title: exp.role,
      company: exp.company_name,
      startDate: exp.start_date,
      endDate: exp.end_date || 'Present',
      description: exp.description || '',
    })) || [],
    
    // Map education
    education: profile.education?.map(edu => ({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.start_date,
      endDate: edu.end_date,
      grade: edu.grade || '',
      description: edu.description || '',
    })) || [],
    
    // Map skills
    skills: profile.skills?.map(skill => ({
      name: skill.skill_name,
      proficiency: skill.proficiency as "beginner" | "intermediate" | "advanced",
    })) || [],
    
    // Map projects
    projects: profile.projects?.map(proj => ({
      name: proj.title,
      description: proj.description,
      githubUrl: proj.github_url || '',
      liveUrl: proj.live_url || '',
    })) || [],
    
    // Map volunteer experience
    volunteer: profile.volunteer_experience?.map(vol => ({
      organization: vol.organization,
      role: vol.role,
      startDate: vol.start_date,
      endDate: vol.end_date || 'Present',
      description: vol.description || '',
    })) || [],
    
    // Map certifications
    certifications: profile.certifications?.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issue_date,
      expiryDate: cert.expiry_date || '',
      certificationId: cert.certification_id || '',
      certificationUrl: cert.certification_url || '',
    })) || [],
    
    // Languages is not in the materialized view, so we'll return an empty array
    languages: [],
  };
}
