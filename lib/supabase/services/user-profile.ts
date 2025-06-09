import { createSupabaseServerClient } from '../server-client';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

/**
 * Fetches user profile data from the user_profiles table
 * This replaces multiple separate queries to user-related tables
 */
export async function getUserMasterProfile(userId: string, cookieStore: ReadonlyRequestCookies) {
  const supabase = createSupabaseServerClient(cookieStore);

  // First try to get the profile without using .single() to avoid errors
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId);

  console.log(`Fetched raw data for user ${userId}:`, JSON.stringify(data, null, 2));
  console.log(`Fetch error for user ${userId}:`, error ? JSON.stringify(error, null, 2) : 'No error object');

  if (error) {
    console.error('Error object present while fetching user profile:', JSON.stringify(error, null, 2));
    return { data: null, error };
  }

  if (!data || data.length === 0) {
    console.warn(`No data returned for user ${userId}, or data array is empty.`);
  }

  // Return the first item if available, or null if no profile found
  return { data: data && data.length > 0 ? data[0] : null, error: null };
}

/**
 * Refreshes the user_master_profile materialized view
 * Call this function after any update to user profile data
 */
export async function refreshUserMasterProfile(cookieStore: ReadonlyRequestCookies) {
  const supabase = createSupabaseServerClient(cookieStore);
  return supabase.rpc('refresh_user_master_profile');
}
