'use client';

import { createClient } from '../../browser-client';
import { UserData } from '@/types/user';

const supabase = createClient();

type WithUserId<T> = T & { user_id: string };

// Extended types to include database-specific fields
type DatabaseUserProfile = Omit<UserData, 'experiences' | 'education' | 'skills' | 'projects' | 'volunteer' | 'certifications'> & {
  website?: string;
  location?: string;
  phone?: string;
  bio?: string;
};

type DatabaseExperience = UserData['experiences'][number] & {
  start_date: string;
  end_date: string | null;
  current: boolean;
};

type DatabaseEducation = UserData['education'][number] & {
  start_date: string;
  end_date: string | null;
  current: boolean;
};

type DatabaseProject = UserData['projects'][number] & {
  start_date: string;
  end_date: string | null;
  current: boolean;
};

type DatabaseVolunteer = UserData['volunteer'][number] & {
  start_date: string;
  end_date: string | null;
  current: boolean;
};

type DatabaseCertification = UserData['certifications'][number] & {
  issue_date: string;
  expiry_date: string | null;
};

export async function upsertUserProfile(user: any, userData: UserData) {
  const profileData: Record<string, any> = {
    name: userData.name || user.user_metadata?.full_name,
    email: userData.email || user.email,
    github: userData.github,
    linkedin: userData.linkedin,
    bio: userData.bio,
    updated_at: new Date().toISOString()
  };

  // Only include optional fields if they exist
  if ('website' in userData) profileData.website = userData.website;
  if ('location' in userData) profileData.location = userData.location;
  if ('phone' in userData) profileData.phone = userData.phone;
  
  // Add ID separately to avoid type issues
  const dataToUpsert = {
    ...profileData,
    id: user.id
  };

  const result = await supabase
    .from('users')
    .upsert(dataToUpsert)
    .select()
    .single();
    
  if (result.error) throw result.error;
  return result.data;
}

export async function upsertExperiences(user: any, experiences: UserData['experiences'] = []) {
  if (!experiences?.length) return [];
  
  try {
    // Delete existing experiences
    const { error: deleteError } = await supabase
      .from('experiences')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) throw deleteError;
    
    // Insert new experiences
    const experiencesToInsert = experiences.map<WithUserId<DatabaseExperience>>(exp => ({
      ...exp,
      user_id: user.id,
      start_date: exp.startDate,
      end_date: exp.endDate || null,
      current: 'current' in exp ? !!exp.current : false,
      id: undefined // Let the database generate the ID
    }));
    
    const { data, error } = await supabase
      .from('experiences')
      .upsert(experiencesToInsert)
      .select();
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error upserting experiences:', error);
    throw error;
  }
}

export async function upsertEducation(user: any, education: UserData['education'] = []) {
  if (!education?.length) return [];
  
  try {
    // Delete existing education
    const { error: deleteError } = await supabase
      .from('education')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) throw deleteError;
    
    // Insert new education
    const educationToInsert = education.map<WithUserId<DatabaseEducation>>(edu => ({
      ...edu,
      user_id: user.id,
      start_date: edu.startDate,
      end_date: edu.endDate || null,
      current: 'current' in edu ? !!edu.current : false,
      id: undefined // Let the database generate the ID
    }));
    
    const { data, error } = await supabase
      .from('education')
      .upsert(educationToInsert)
      .select();
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error upserting education:', error);
    throw error;
  }
}

export async function upsertSkills(user: any, skills: UserData['skills']) {
  if (!skills?.length) return [];
  
  // Delete existing skills
  await supabase.from('skills').delete().eq('user_id', user.id);
  
  // Insert new skills
  const skillsWithUserId = skills.map(skill => ({
    ...skill,
    user_id: user.id
  }));
  
  const { data, error } = await supabase
    .from('skills')
    .upsert(skillsWithUserId)
    .select();
    
  if (error) throw error;
  return data || [];
}

export async function upsertProjects(user: any, projects: UserData['projects'] = []) {
  if (!projects?.length) return [];
  
  try {
    // Delete existing projects
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) throw deleteError;
    
    // Insert new projects
    const projectsToInsert = projects.map<WithUserId<Omit<DatabaseProject, 'startDate' | 'endDate' | 'current'>>>(project => {
      const projectData: any = {
        ...project,
        user_id: user.id,
        id: undefined // Let the database generate the ID
      };
      
      // Only include date fields if they exist in the project data
      if ('startDate' in project) projectData.start_date = project.startDate;
      if ('endDate' in project) projectData.end_date = project.endDate || null;
      if ('current' in project) projectData.current = !!project.current;
      
      return projectData;
    });
    
    const { data, error } = await supabase
      .from('projects')
      .upsert(projectsToInsert)
      .select();
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error upserting projects:', error);
    throw error;
  }
}

export async function upsertVolunteer(user: any, volunteer: UserData['volunteer'] = []) {
  if (!volunteer?.length) return [];
  
  try {
    // Delete existing volunteer experiences
    const { error: deleteError } = await supabase
      .from('volunteer')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) throw deleteError;
    
    // Insert new volunteer experiences
    const volunteerToInsert = volunteer.map<WithUserId<DatabaseVolunteer>>(vol => ({
      ...vol,
      user_id: user.id,
      start_date: vol.startDate,
      end_date: vol.endDate || null,
      current: 'current' in vol ? !!vol.current : false,
      id: undefined // Let the database generate the ID
    }));
    
    const { data, error } = await supabase
      .from('volunteer')
      .upsert(volunteerToInsert)
      .select();
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error upserting volunteer experiences:', error);
    throw error;
  }
}

export async function upsertCertifications(user: any, certifications: UserData['certifications'] = []) {
  if (!certifications?.length) return [];
  
  try {
    // Delete existing certifications
    const { error: deleteError } = await supabase
      .from('certifications')
      .delete()
      .eq('user_id', user.id);
    
    if (deleteError) throw deleteError;
    
    // Insert new certifications
    const certificationsToInsert = certifications.map<WithUserId<DatabaseCertification>>(cert => ({
      ...cert,
      user_id: user.id,
      issue_date: cert.issueDate,
      expiry_date: cert.expiryDate || null,
      id: undefined // Let the database generate the ID
    }));
    
    const { data, error } = await supabase
      .from('certifications')
      .upsert(certificationsToInsert)
      .select();
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error upserting certifications:', error);
    throw error;
  }
}
