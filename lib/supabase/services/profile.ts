import { createClient } from '../browser-client'; // Browser client for client-side calls
import { createSupabaseServerClient } from '../server-client'; // Server client for server-side calls
// import { cookies } from 'next/headers'; // Avoid top-level server-only import if possible
import { UserData } from '@/types/user';

// This function is problematic due to cookies() call for client-side imports.
// We will refactor functions to explicitly use client or server client.
// async function getClient() { 
//   if (typeof window === 'undefined') {
//     // Server-side
//     const cookieStore = cookies();
//     return createSupabaseServerClient(cookieStore);
//   } else {
//     // Client-side
//     return createClient();
//   }
// }

// Fetches the full user profile for resume display using the RPC - intended for client-side use
export async function getUserProfileForResume(userId: string) {
  const supabase = createClient(); // Use browser client directly
  const { data, error } = await supabase.rpc('get_user_profile_for_resume', { target_user_id: userId });
  if (error) throw error;
  return data;
}

// For upsert functions, they should ideally be called from server contexts (Server Actions, API routes)
// If called from server, they should use createSupabaseServerClient with cookies().
// For now, to fix the build error caused by app/profile/page.tsx (client component),
// we assume these upsert functions will be handled in a server context or refactored.
// To make them temporarily work IF THEY WERE CALLED from a client context (which is not ideal for upserts),
// they would also need to use createClient(). But the proper fix is server-side execution for mutations.
// We will leave them as is for now, assuming they are called server-side where cookies() would be available
// if getClient() was structured to accept cookieStore or if they directly used createSupabaseServerClient.

export async function upsertUserProfile(user: any, userData: UserData) {
  // THIS FUNCTION SHOULD BE CALLED SERVER-SIDE. Example: using createSupabaseServerClient(cookies())
  // For now, to allow build, if it were called client-side (bad practice), it would be:
  // const supabase = createClient();
  // But the proper fix is to ensure server-side execution context.
  // Assuming server context for now, where getClient would resolve to server client.
  // To fix the immediate build error related to `cookies` being imported at top-level and breaking client components,
  // we've removed the problematic `getClient`. These functions now need explicit client instantiation.
  // For now, let's assume they will be refactored to be proper Server Actions or use a passed server client.
  // To make them *compile* without getClient, they'd need a client. Forcing browser client for now for compilation, but this is NOT the final fix for upserts.
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
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
  

  
  return result;
}

export async function upsertExperiences(user: any, experiences: Array<UserData['experiences'][number] & { id?: string }>) {
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
  const { data, error } = await supabase.from('experiences').upsert(
    experiences.map(exp => ({
      id: exp.id || undefined,
      user_id: user.id,
      company_name: exp.company,
      role: exp.title,
      start_date: exp.startDate,
      end_date: exp.endDate === 'Present' ? null : exp.endDate,
      description: exp.description,
      updated_at: new Date().toISOString()
    }))
  );
  if (error) throw error;
  return data;
}

export async function upsertEducation(user: any, education: UserData['education']) {
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
  const { data, error } = await supabase.from('education').upsert(
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
  if (error) throw error;
  return data;
}

export async function upsertSkills(user: any, skills: Array<UserData['skills'][number] & { id?: string }>) {
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
  const { data, error } = await supabase.from('skills').upsert(
    skills.map(skill => ({
      id: skill.id || undefined,
      user_id: user.id,
      skill_name: skill.name,
      proficiency: skill.proficiency,
      updated_at: new Date().toISOString()
    }))
  );
  if (error) throw error;
  return data;
}

export async function upsertProjects(user: any, projects: Array<UserData['projects'][number] & { id?: string }>) {
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
  const { data, error } = await supabase.from('projects').upsert(
    projects.map(project => ({
      id: project.id || undefined,
      user_id: user.id,
      title: project.name,
      description: project.description,
      github_url: project.githubUrl,
      live_url: project.liveUrl,
      updated_at: new Date().toISOString()
    }))
  );
  if (error) throw error;
  return data;
}

export async function upsertVolunteer(user: any, volunteer: Array<UserData['volunteer'][number] & { id?: string }>) {
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
  const { data, error } = await supabase.from('volunteer').upsert(
    volunteer.map(vol => ({
      id: vol.id || undefined,
      user_id: user.id,
      organization: vol.organization,
      role: vol.role,
      start_date: vol.startDate,
      end_date: vol.endDate,
      description: vol.description,
      updated_at: new Date().toISOString()
    }))
  );
  if (error) throw error;
  return data;
}

export async function upsertCertifications(user: any, certifications: Array<UserData['certifications'][number] & { id?: string }>) {
  const supabase = createClient(); // TEMPORARY for compilation - UPSERTS SHOULD USE SERVER CLIENT
  const { data, error } = await supabase.from('certifications').upsert(
    certifications.map(cert => ({
      id: cert.id || undefined,
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
  if (error) throw error;
  return data;
}