import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, context: any) { // Temporarily use any for diagnostics
  try {
    const { params } = context; // Assuming context will have params
    const cookieStore = cookies();
    const supabase = createSupabaseServerClient(cookieStore);
    const { data, error } = await supabase.rpc('get_user_profile_for_resume', { 
      target_user_id: params.user_id 
    });
    
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
