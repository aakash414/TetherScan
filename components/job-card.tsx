import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  isDragging?: boolean;
  onMoveToNext?: () => void;
  nextStatusName?: string;
  onMoveToPrev?: () => void;
  prevStatusName?: string;
}

export function JobCard({ job, isDragging, onMoveToNext, nextStatusName, onMoveToPrev, prevStatusName }: JobCardProps) {
  const formatSalary = (salary: string | number) => {
    const numericSalary = typeof salary === 'string' ? parseInt(salary, 10) : salary;
    if (isNaN(numericSalary)) return '';
    return new Intl.NumberFormat('en-IN').format(numericSalary);
  }

  return (
    <Card className={`group h-56 bg-white/80 rounded-xl shadow-md card-hover-effect border-transparent hover:border-emerald-500/20 transition-all ${isDragging ? 'shadow-xl ring-2 ring-emerald-400' : ''}`}>
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div>
            <h4 title={job.role} className="font-bold text-lg text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">{job.role}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span>{job.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{job.location} {job.remote && "(Remote)"}</span>
          </div>
          {/* {(job.expectedSalaryMin || job.expectedSalaryMax) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <span>
                {job.expectedSalaryMin && `₹${formatSalary(job.expectedSalaryMin)}`}
                {job.expectedSalaryMin && job.expectedSalaryMax && " - "}
                {job.expectedSalaryMax && `₹${formatSalary(job.expectedSalaryMax)}`}
              </span>
              {job.salaryFrequency && <span className="text-xs text-gray-400 capitalize">{job.salaryFrequency}</span>}
            </div>
          )} */}
        </div>
        {(onMoveToPrev || onMoveToNext) && (
          <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
            {onMoveToPrev && prevStatusName ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs pl-0 font-semibold text-slate-500 hover:text-slate-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToPrev();
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {prevStatusName}
              </Button>
            ) : <div />}
            {onMoveToNext && nextStatusName && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveToNext();
                }}
              >
                {nextStatusName}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
