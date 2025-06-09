import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin } from 'lucide-react'
import { JobMatchIndicator } from "@/components/job-match-indicator"
import { JobDetailsDialog } from "@/components/job-details-dialog"

interface JobCardProps {
  job: {
    id: string
    company: string
    location: string
    remote: boolean
    role: string
    expectedSalaryMin: string
    expectedSalaryMax: string
    salaryFrequency: string
    jobDescription?: string
  }
  showMatchScore?: boolean
  userId?: string
}

export function JobCard({ job, showMatchScore = false, userId }: JobCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h4 className="font-semibold text-[#006D77]">{job.role}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {job.company}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {job.location} {job.remote && "(Remote)"}
          </div>
          {(job.expectedSalaryMin || job.expectedSalaryMax) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {job.expectedSalaryMin && `₹${job.expectedSalaryMin}`}
              {job.expectedSalaryMin && job.expectedSalaryMax && " - "}
              {job.expectedSalaryMax && `₹${job.expectedSalaryMax}`}
              {" "}
              {job.salaryFrequency}
            </div>
          )}
          {/* Job match indicator temporarily disabled
          {showMatchScore && userId && (
            <div className="mt-2">
              <JobMatchIndicator job={job} userId={userId} />
            </div>
          )}
          */}
          <JobDetailsDialog job={job} trigger={<button className="mt-2 px-4 py-2 rounded bg-[#006D77] text-white hover:bg-[#005a66] transition-colors">View Details</button>} />
        </div>
      </CardContent>
    </Card>
  )
}
