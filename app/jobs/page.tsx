import { JobBoard } from "@/components/job-board"

export default function JobBoardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Job Board</h2>
      </div>
      <JobBoard />
    </div>
  )
}

