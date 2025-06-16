

import { JobBoard } from '@/components/job-board'
import { StatsCards } from '@/components/stats-cards'
import { DecorativeStars } from '@/components/decorative-stars'
import { createClient } from '@/lib/supabase/server'
import { jobsService } from '@/lib/supabase/services/jobs'
import LandingPage from './landing/page'
export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let jobs = [];
  if (user) {
    const data = await jobsService.getJobs(supabase);
    jobs = data || [];
  }

  return user ? (
    <div className="relative space-y-8 px-8 md:pt-12">
      <DecorativeStars />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#006D77]">Welcome Back</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Track your job applications and improve your chances
          </p>
        </div>
      </div>
      <StatsCards jobs={jobs} />
      <JobBoard initialJobs={jobs} />
    </div>
  ) : <LandingPage />
}
