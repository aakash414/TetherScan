"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { JobCard } from "@/components/job-card"
import { JobDetailsDialog } from "@/components/job-details-dialog";
import { Dialog } from "@/components/ui/dialog";
import { AddJobDialog } from "@/components/add-job-dialog"
import { Job, JobFormData, JobStatus, JobsState, Column, jobStatusEnum } from "@/lib/types"
import { jobsService } from "@/lib/supabase/services/jobs"
import { createClient } from '@/lib/supabase/browser-client'

const columns: Column[] = [
  { id: "wishlist", title: "Wishlist", color: "bg-[#bddff9] dark:bg-blue-900" },
  { id: "applied", title: "Applied", color: "bg-[#d094e5] dark:bg-purple-900" },
  { id: "interviewing", title: "Interviewing", color: "bg-[#e8b89c] dark:bg-orange-900" },
  { id: "offered", title: "Offered", color: "bg-[#a3dcd4] dark:bg-green-900" },
  { id: "rejected", title: "Rejected", color: "bg-red-100 dark:bg-red-900" },
]

export function JobBoard({ initialJobs = [] }: { initialJobs: Job[] }) {
  const supabase = createClient();
  const [jobs, setJobs] = useState<JobsState>({
    wishlist: [], applied: [], interviewing: [], offered: [], rejected: []
  });
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const categorizedJobs: JobsState = {
      wishlist: [], applied: [], interviewing: [], offered: [], rejected: []
    };
    initialJobs.forEach(job => {
      if (job.status && jobStatusEnum.options.includes(job.status)) {
        categorizedJobs[job.status].push(job);
      }
    });
    setJobs(categorizedJobs);
  }, [initialJobs]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const startColumnKey = source.droppableId as JobStatus;
    const endColumnKey = destination.droppableId as JobStatus;

    const startColumn = Array.from(jobs[startColumnKey]);
    const [movedItem] = startColumn.splice(source.index, 1);

    if (startColumnKey === endColumnKey) {
      startColumn.splice(destination.index, 0, movedItem);
      setJobs(prev => ({ ...prev, [startColumnKey]: startColumn }));
    } else {
      const endColumn = Array.from(jobs[endColumnKey]);
      endColumn.splice(destination.index, 0, movedItem);
      setJobs(prev => ({ ...prev, [startColumnKey]: startColumn, [endColumnKey]: endColumn }));
      jobsService.updateJob(supabase, movedItem.id, { status: endColumnKey });
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs(currentJobs => {
      const status = newJob.status;
      const column = [newJob, ...(currentJobs[status] || [])];
      return { ...currentJobs, [status]: column };
    });
  };

  const handleSaveJob = async (jobData: JobFormData, existingJobId?: string) => {
    if (existingJobId) {
      const updatedJob = await jobsService.updateJob(supabase, existingJobId, jobData);
      if (updatedJob) handleUpdateJob(updatedJob);
    } else {
      const newJob = await jobsService.createJob(supabase, jobData);
      if (newJob) handleJobCreated(newJob);
    }
  };

  const handleUpdateJob = (updatedJob: Job) => {
    setJobs(prevJobs => {
      const newJobs = { ...prevJobs };
      let oldStatus: JobStatus | null = null;

      for (const status in newJobs) {
        const key = status as JobStatus;
        if (newJobs[key].some(job => job.id === updatedJob.id)) {
          oldStatus = key;
          break;
        }
      }

      if (oldStatus) {
        if (oldStatus === updatedJob.status) {
          const column = newJobs[oldStatus].map(job => job.id === updatedJob.id ? updatedJob : job);
          newJobs[oldStatus] = column;
        } else {
          newJobs[oldStatus] = newJobs[oldStatus].filter(job => job.id !== updatedJob.id);
          newJobs[updatedJob.status] = [updatedJob, ...newJobs[updatedJob.status]];
        }
      }
      return newJobs;
    });
    setSelectedJob(updatedJob);
  };

  const handleJobCardClick = (job: Job) => {
    setSelectedJob(job);
    setDetailsOpen(true);
  };

  const handleCloseDialog = () => {
    setDetailsOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <AddJobDialog onSaveJob={handleSaveJob} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl p-4 h-full min-h-[150px] ${column.color}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#364442] capitalize">{column.title}</h3>
                    <span className="text-sm font-medium bg-[#364442]/5 text-[#364442]/80 rounded-full px-2.5 py-0.5">
                      {jobs[column.id]?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {jobs[column.id]?.map((job, idx) => (
                      <Draggable key={job.id} draggableId={job.id} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => handleJobCardClick(job)}
                          >
                            <JobCard
                              job={job}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Expanded Job Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        {selectedJob && (
          <JobDetailsDialog

            job={selectedJob}
            onJobUpdated={handleUpdateJob}
            onCloseDialog={() => setDetailsOpen(false)}
          />
        )}
      </Dialog>
    </div>
  )
}
