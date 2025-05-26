import { getUserProfileForResume } from "@/lib/supabase/services/profile";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { user_id: string } }) {
  try {
    const data = await getUserProfileForResume(params.user_id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
