import { JobBoard } from "@/components/job-board"
import { DecorativeStars } from "@/components/decorative-stars"

export default function JobBoardPage() {
  return (
    <div className="relative space-y-8">
      <DecorativeStars />
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-[#006D77]">Job Board</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Track and manage your job applications from start to finish.
        </p>
      </div>
      <JobBoard initialJobs={[]} />
    </div>
  )
}

