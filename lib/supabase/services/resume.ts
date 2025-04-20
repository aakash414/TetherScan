import { createClient } from '../client';

export async function getResumes(userId: string) {
  const supabase = createClient();
  return supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
}

export async function addResume(userId: string, title: string, extractedData: any) {
  const supabase = createClient();
  return supabase
    .from('resumes')
    .insert([
      {
        user_id: userId,
        title,
        extracted_data: JSON.stringify(extractedData),
      },
    ])
    .select()
    .single();
}

export async function deleteResume(resumeId: string) {
  const supabase = createClient();
  return supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId);
}

export async function updateResume(resumeId: string, title: string, extractedData: any) {
  const supabase = createClient();
  return supabase
    .from('resumes')
    .update({
      title,
      extracted_data: JSON.stringify(extractedData),
      updated_at: new Date().toISOString(),
    })
    .eq('id', resumeId)
    .select()
    .single();
}
