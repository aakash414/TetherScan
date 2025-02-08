"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from '@/frontend/lib/supabase/client'
export default function ProfilePage() {
  const [user, setUser] = useState<{
    id: string
    name: string
    email: string
    github_username: string | null
    created_at: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get the current authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError || !authUser) {
          router.push('/signin')
          return
        }

        // Check if user exists in our users table
        const supabaseClient = await supabase
        const { data: userData, error: dbError } = await supabaseClient
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .single()

        if (dbError) {
          console.error('Error fetching user:', dbError)
          return
        }

        // If user doesn't exist in our table, create them
        if (!userData) {
          const newUser = {
            email: authUser.email,
            name: authUser.user_metadata.full_name || authUser.email?.split('@')[0] || 'Anonymous',
          }

          const { data: insertedUser, error: insertError } = await supabaseClient
            .from('users')
            .insert([newUser])
            .select()
            .single()

          if (insertError) {
            console.error('Error creating user:', insertError)
            return
          }

          setUser(insertedUser)
        } else {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://avatar.vercel.sh/${user?.email}`} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{user?.name}</CardTitle>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Member since</h3>
              <p className="mt-1">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            {user?.github_username && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">GitHub Username</h3>
                <p className="mt-1">{user.github_username}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
