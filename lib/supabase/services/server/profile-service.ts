import { createSupabaseServerClient } from '../../server-client';
import { cookies } from 'next/headers';
import { profilesService } from '../profiles';
import type { Database } from '@/lib/database.types';

const getServerClient = () => {
  const cookieStore = cookies();
  return createSupabaseServerClient(cookieStore);
};

// Server-side profile operations using our clean service layer
export async function getUserProfileForResume(userId: string) {
  const supabase = getServerClient();
  return profilesService.getUserProfileForResume(supabase, userId);
}

export async function getUserMasterProfile(userId: string) {
  const supabase = getServerClient();
  return profilesService.getUserMasterProfile(supabase, userId);
}

export async function createUser(userId: string, email: string, name?: string) {
  const supabase = getServerClient();
  return profilesService.createUser(supabase, userId, email, name);
}

export async function upsertUserProfile(userId: string, profileData: any) {
  const supabase = getServerClient();
  return profilesService.upsertUserProfile(supabase, userId, profileData);
}

export async function upsertExperiences(userId: string, experiences: any[]) {
  const supabase = getServerClient();
  return profilesService.upsertExperiences(supabase, userId, experiences);
}

export async function upsertEducation(userId: string, education: any[]) {
  const supabase = getServerClient();
  return profilesService.upsertEducation(supabase, userId, education);
}

export async function upsertSkills(userId: string, skills: any[]) {
  const supabase = getServerClient();
  return profilesService.upsertSkills(supabase, userId, skills);
}

export async function upsertProjects(userId: string, projects: any[]) {
  const supabase = getServerClient();
  return profilesService.upsertProjects(supabase, userId, projects);
}

export async function upsertVolunteer(userId: string, volunteer: any[]) {
  const supabase = getServerClient();
  return profilesService.upsertVolunteer(supabase, userId, volunteer);
}

export async function upsertCertifications(userId: string, certifications: any[]) {
  const supabase = getServerClient();
  return profilesService.upsertCertifications(supabase, userId, certifications);
}
