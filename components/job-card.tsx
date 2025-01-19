import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, DollarSign } from 'lucide-react'

interface JobCardProps {
  job: {
    company: string
    location: string
    remote: boolean
    role: string
    expectedSalaryMin: string
    expectedSalaryMax: string
    salaryFrequency: string
  }
}

export function JobCard({ job }: JobCardProps) {
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
              <DollarSign className="h-4 w-4" />
              {job.expectedSalaryMin && `$${job.expectedSalaryMin}`}
              {job.expectedSalaryMin && job.expectedSalaryMax && " - "}
              {job.expectedSalaryMax && `$${job.expectedSalaryMax}`}
              {" "}
              {job.salaryFrequency}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

