'use client';

import { createClient } from '../../browser-client';
import { profilesService } from '../profiles';
import type { Database } from '@/lib/database.types';

const supabase = createClient();

export async function createUser(userId: string, email: string | undefined, name?: string) {
  return profilesService.createUser(supabase, userId, email || '', name);
}

export async function upsertUserProfile(user: any, userData: any) {
  const profileData = {
    name: userData.name || user.user_metadata?.full_name,
    email: userData.email || user.email,
    github_username: userData.github,
    linkedin_id: userData.linkedin,
    portfolio_url: userData.portfolio,
    bio: userData.bio,
    profile_image: userData.profile_image
  };
  
  return profilesService.upsertUserProfile(supabase, user.id, profileData);
}

export async function upsertExperiences(user: any, experiences: any[]) {
  const experienceData = experiences.map(exp => ({
    id: exp.id,
    title: exp.title,
    company: exp.company,
    start_date: exp.startDate,
    end_date: exp.endDate === 'Present' ? null : exp.endDate,
    description: exp.description
  }));
  
  return profilesService.upsertExperiences(supabase, user.id, experienceData);
}

export async function upsertEducation(user: any, education: any[]) {
  const educationData = education.map(edu => ({
    school: edu.school,
    degree: edu.degree,
    field: edu.field,
    start_date: edu.startDate,
    end_date: edu.endDate,
    grade: edu.grade,
    description: edu.description
  }));
  
  return profilesService.upsertEducation(supabase, user.id, educationData);
}

export async function upsertSkills(user: any, skills: any[]) {
  const skillData = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    proficiency: skill.proficiency
  }));
  
  return profilesService.upsertSkills(supabase, user.id, skillData);
}

export async function upsertProjects(user: any, projects: any[]) {
  const projectData = projects.map(project => ({
    id: project.id,
    title: project.name,
    description: project.description,
    github_url: project.githubUrl,
    live_url: project.liveUrl
  }));
  
  return profilesService.upsertProjects(supabase, user.id, projectData);
}

export async function upsertVolunteer(user: any, volunteer: any[]) {
  const volunteerData = volunteer.map(vol => ({
    id: vol.id,
    organization: vol.organization,
    role: vol.role,
    start_date: vol.startDate,
    end_date: vol.endDate,
    description: vol.description
  }));
  
  return profilesService.upsertVolunteer(supabase, user.id, volunteerData);
}

export async function upsertCertifications(user: any, certifications: any[]) {
  const certificationData = certifications.map(cert => ({
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    issue_date: cert.issueDate,
    expiry_date: cert.expiryDate,
    certification_id: cert.certificationId,
    certification_url: cert.certificationUrl
  }));
  
  return profilesService.upsertCertifications(supabase, user.id, certificationData);
}

export async function getAuthenticatedUserProfile() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw authError || new Error('Not authenticated');
  
  return profilesService.getUserMasterProfile(supabase, user.id);
}

// Get user profile for resume generation
export async function getUserProfileForResume(userId: string) {
  return profilesService.getUserProfileForResume(supabase, userId);
}
