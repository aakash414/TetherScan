"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAuthenticatedUserProfile } from '@/lib/supabase/services/client/profile-service'

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const profile = await getAuthenticatedUserProfile();
        if (profile) {
          setUser(profile);
        } else {
          router.push('/signin');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

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
            {user?.skills && user.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mt-4">Skills</h3>
                <div className="mt-1 flex flex-wrap gap-2">
                  {user.skills.map((skill: any, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                      {skill.skill_name} ({skill.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
