import { createSupabaseServerClient } from '../../server-client';
import { cookies } from 'next/headers';
import { UserData } from '@/types/user';

const getServerClient = () => {
  const cookieStore = cookies();
  return createSupabaseServerClient(cookieStore);
};

export async function getUserProfileForResume(userId: string) {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .rpc('get_user_profile_for_resume', { target_user_id: userId });
  if (error) throw error;
  return data;
}

// Add other server-side profile operations here
