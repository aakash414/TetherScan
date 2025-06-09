import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { batchCalculateJobMatches } from '@/lib/supabase/services/job-matching';
import { createSupabaseServerClient } from '@/lib/supabase/server-client'; // For getting user
import { Job } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user or no user in session:', userError);
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { jobs } = (await request.json()) as { jobs: Job[] };

    if (!jobs || !Array.isArray(jobs)) {
      return NextResponse.json({ error: 'Invalid jobs data in request body' }, { status: 400 });
    }

    const jobMatchesMap = await batchCalculateJobMatches(user.id, jobs, cookieStore);
    
    // Convert Map to an array of [key, value] pairs for JSON serialization
    const jobMatchesArray = Array.from(jobMatchesMap.entries());

    return NextResponse.json({ jobMatches: jobMatchesArray });
  } catch (error) {
    console.error('Error in /api/job-matches:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 });
  }
}
