import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  isDragging?: boolean;
}

export function JobCard({ job, isDragging }: JobCardProps) {
  const formatSalary = (salary: string | number) => {
    const numericSalary = typeof salary === 'string' ? parseInt(salary, 10) : salary;
    if (isNaN(numericSalary)) return '';
    return new Intl.NumberFormat('en-IN').format(numericSalary);
  }

  return (
    <Card className={`group h-full bg-white/80 rounded-xl shadow-md card-hover-effect border-transparent hover:border-emerald-500/20 transition-all ${isDragging ? 'shadow-xl ring-2 ring-emerald-400' : ''}`}>
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-lg text-foreground group-hover:text-emerald-600 transition-colors">{job.role}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{job.location} {job.remote && "(Remote)"}</span>
          </div>
          {(job.expectedSalaryMin || job.expectedSalaryMax) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span>
                {job.expectedSalaryMin && `₹${formatSalary(job.expectedSalaryMin)}`}
                {job.expectedSalaryMin && job.expectedSalaryMax && " - "}
                {job.expectedSalaryMax && `₹${formatSalary(job.expectedSalaryMax)}`}
              </span>
              {job.salaryFrequency && <span className="text-xs text-gray-400 capitalize">{job.salaryFrequency}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
