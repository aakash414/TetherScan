'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export default function SignInPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkUser()
  }, [router, supabase.auth])

  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f8f8f8] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 relative">
        <div
          className="text-center space-y-2 animate-[fade-in_0.8s_ease-out]"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Welcome to Job Tracker
          </h1>
          <p className="text-lg text-gray-600">
            Track your job applications, manage resumes, and get personalized recommendations
            to land your dream job.
          </p>
        </div>

        <div
          className="mt-12 relative animate-[slide-up_0.8s_ease-out_0.2s_both]"
        >
          <Button
            variant="outline"
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
            onClick={handleSignIn}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our{" "}
            <span className="text-gray-900 hover:underline cursor-pointer">Terms</span>
            {" "}and{" "}
            <span className="text-gray-900 hover:underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>

        <div
          className="absolute -z-10 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 -top-32 -left-32 animate-[pulse_8s_ease-in-out_infinite]"
        />
        <div
          className="absolute -z-10 w-64 h-64 bg-gradient-to-r from-pink-100 to-yellow-100 rounded-full blur-3xl opacity-30 -bottom-32 -right-32 animate-[pulse_8s_ease-in-out_infinite_reverse]"
        />
      </div>
    </div>
  )
}
