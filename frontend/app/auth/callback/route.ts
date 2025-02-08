import { NextResponse } from "next/server"

import { createClient } from "@/frontend/lib/supabase/server"

export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url)

  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    // Create a Supabase client
    const supabase = await createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get the user session
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // Check if user exists in our users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (!existingUser) {
          // New user - redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      // If successful, redirect to the 'next' path or home
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something went wrong, redirect to sign-in
  return NextResponse.redirect(`${origin}/signin`)
}