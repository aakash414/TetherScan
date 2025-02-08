import { JobBoard } from "@/components/job-board"
import { StatsCards } from "@/components/stats-cards"
import { ResumeAnalytics } from "@/components/resume-analytics"
import { DecorativeStars } from "@/components/decorative-stars"

export default function DashboardPage() {
  return (
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
  )
}

