import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Building2, MapPin } from "lucide-react";

export interface JobDetails {
  id: string;
  company: string;
  location: string;
  remote: boolean;
  role: string;
  expectedSalaryMin?: string;
  expectedSalaryMax?: string;
  salaryFrequency?: string;
  jobDescription?: string;
  jobUrl?: string;
  notes?: string;
  status?: string;
}

interface JobDetailsDialogProps {
  job: JobDetails;
  trigger?: React.ReactNode;
}

export function JobDetailsDialog({ job, trigger }: JobDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl w-full p-6 bg-white rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>
            {job.role} @ {job.company}
          </DialogTitle>
          <DialogDescription>
            {job.status && (
              <>
                Status: <b>{job.status}</b> |
              </>
            )}
            {job.remote ? "Remote" : job.location}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          <div>
            <b>Role:</b> {job.role}
          </div>
          {(job.expectedSalaryMin || job.expectedSalaryMax) && (
            <div>
              <b>Salary:</b> {job.expectedSalaryMin && `₹${job.expectedSalaryMin}`}
              {job.expectedSalaryMin && job.expectedSalaryMax && " - "}
              {job.expectedSalaryMax && `₹${job.expectedSalaryMax}`}
              {" "}
              {job.salaryFrequency}
            </div>
          )}
          {job.jobUrl && (
            <div>
              <b>Job URL:</b>{" "}
              <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                {job.jobUrl}
              </a>
            </div>
          )}
          {job.jobDescription && (
            <div>
              <b>Description:</b>
              <br />
              <span className="text-sm whitespace-pre-line">{job.jobDescription}</span>
            </div>
          )}
          {job.notes && (
            <div>
              <b>Notes:</b>
              <br />
              <span className="text-sm whitespace-pre-line">{job.notes}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 mt-6">
          <button className="w-full px-4 py-2 rounded bg-[#006D77] text-white hover:bg-[#005a66] transition-colors">
            Generate Resume
          </button>
          <button className="w-full px-4 py-2 rounded bg-[#83C5BE] text-white hover:bg-[#6fa7a1] transition-colors">
            Generate Cover Letter
          </button>
          <button
            className="w-full px-4 py-2 rounded bg-gray-200 text-gray-700 cursor-not-allowed"
            disabled
          >
            More Actions (Coming Soon)
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
