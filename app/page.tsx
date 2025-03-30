"use client"

import { useAuth } from '@/contexts/auth-context'
import LandingPage from './landing/page'
import { DecorativeStars } from "@/components/decorative-stars"
import { StatsCards } from "@/components/stats-cards"
import { JobBoard } from "@/components/job-board"
import { ResumeAnalytics } from "@/components/resume-analytics"

export default function Home() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  return user ? (
    <div className="relative space-y-8">
      <DecorativeStars />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#006D77]">Welcome Back</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Track your job applications and improve your chances
          </p>
        </div>
      </div>
      <StatsCards />
      <div className="grid gap-8 lg:grid-cols-2">
        <JobBoard />
        <ResumeAnalytics />
      </div>
    </div>
  ) : <LandingPage />
}

