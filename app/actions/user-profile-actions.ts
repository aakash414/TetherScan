"use server";

import { cookies } from 'next/headers';
import { getUserMasterProfile as fetchUserMasterProfileServer } from '@/lib/supabase/services/user-profile'; // Renamed import

export async function getUserMasterProfileForClient(userId: string) {
  const cookieStore = await cookies(); // Diagnostic: Awaiting if TS thinks it's a Promise
  try {
    // Call the original server-side function
    const result = await fetchUserMasterProfileServer(userId, cookieStore);
    return result; // Should be { data: UserProfile | null, error: any }
  } catch (error) {
    console.error('Error in getUserMasterProfileForClient server action:', error);
    // Ensure the returned shape matches success cases for client-side handling
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'Unknown error in server action' 
      } 
    };
  }
}
