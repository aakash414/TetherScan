import { createClient } from '../client';

/**
 * Fetches user profile data from the user_master_profile materialized view
 * This replaces multiple separate queries to user-related tables
 */
export async function getUserMasterProfile(userId: string) {
  const supabase = createClient();
  return supabase
    .from('user_master_profile')
    .select('*')
    .eq('user_id', userId)
    .single();
}

/**
 * Refreshes the user_master_profile materialized view
 * Call this function after any update to user profile data
 */
export async function refreshUserMasterProfile() {
  const supabase = createClient();
  return supabase.rpc('refresh_user_master_profile');
}
