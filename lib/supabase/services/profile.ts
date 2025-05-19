import { createClient } from '../client';
import { UserData } from '@/types/user';
import { refreshUserMasterProfile } from './user-profile';

export async function upsertUserProfile(user: any, userData: UserData) {
  const supabase = createClient();
  const result = await supabase.from('users').upsert({
    id: user.id,
    name: userData.name || user.user_metadata?.full_name,
    email: userData.email || user.email,
    github_username: userData.github,
    linkedin_id: userData.linkedin,
    portfolio_url: userData.portfolio,
    bio: userData.bio,
    profile_image: userData.profile_image,
    updated_at: new Date().toISOString()
  });
  
  // Refresh the materialized view after updating user data
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}

export async function upsertExperiences(user: any, experiences: UserData['experiences']) {
  const supabase = createClient();
  const result = await supabase.from('work_experience').upsert(
    experiences.map(exp => ({
      user_id: user.id,
      company_name: exp.company,
      role: exp.title,
      start_date: exp.startDate,
      end_date: exp.endDate === 'Present' ? null : exp.endDate,
      description: exp.description,
      updated_at: new Date().toISOString()
    }))
  );
  
  // Refresh the materialized view after updating experiences
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}

export async function upsertEducation(user: any, education: UserData['education']) {
  const supabase = createClient();
  const result = await supabase.from('education').upsert(
    education.map(edu => ({
      user_id: user.id,
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      start_date: edu.startDate,
      end_date: edu.endDate,
      grade: edu.grade,
      description: edu.description,
      updated_at: new Date().toISOString()
    }))
  );
  
  // Refresh the materialized view after updating education
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}

export async function upsertSkills(user: any, skills: UserData['skills']) {
  const supabase = createClient();
  const result = await supabase.from('skills').upsert(
    skills.map(skill => ({
      user_id: user.id,
      skill_name: skill.name,
      proficiency: skill.proficiency,
      updated_at: new Date().toISOString()
    }))
  );
  
  // Refresh the materialized view after updating skills
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}

export async function upsertProjects(user: any, projects: UserData['projects']) {
  const supabase = createClient();
  const result = await supabase.from('projects').upsert(
    projects.map(proj => ({
      user_id: user.id,
      title: proj.name,
      description: proj.description,
      github_url: proj.githubUrl,
      live_url: proj.liveUrl,
      updated_at: new Date().toISOString()
    }))
  );
  
  // Refresh the materialized view after updating projects
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}

export async function upsertVolunteer(user: any, volunteer: UserData['volunteer']) {
  const supabase = createClient();
  const result = await supabase.from('volunteer').upsert(
    volunteer.map(vol => ({
      user_id: user.id,
      organization: vol.organization,
      role: vol.role,
      start_date: vol.startDate,
      end_date: vol.endDate,
      description: vol.description,
      updated_at: new Date().toISOString()
    }))
  );
  
  // Refresh the materialized view after updating volunteer experience
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}

export async function upsertCertifications(user: any, certifications: UserData['certifications']) {
  const supabase = createClient();
  const result = await supabase.from('certifications').upsert(
    certifications.map(cert => ({
      user_id: user.id,
      name: cert.name,
      issuer: cert.issuer,
      issue_date: cert.issueDate,
      expiry_date: cert.expiryDate,
      certification_id: cert.certificationId,
      certification_url: cert.certificationUrl,
      updated_at: new Date().toISOString()
    }))
  );
  
  // Refresh the materialized view after updating certifications
  if (!result.error) {
    await refreshUserMasterProfile();
  }
  
  return result;
}