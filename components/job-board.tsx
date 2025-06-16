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
import { Lightbulb } from 'lucide-react'

const columns: Column[] = [
  { id: "wishlist", title: "Wishlist", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "applied", title: "Applied", color: "bg-purple-100 dark:bg-purple-900" },
  { id: "interviewing", title: "Interviewing", color: "bg-orange-100 dark:bg-orange-900" },
  { id: "offered", title: "Offered", color: "bg-green-100 dark:bg-green-900" },
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

  const handleMoveToPrevStatus = async (jobToMove: Job) => {
    const currentStatusIndex = columns.findIndex(c => c.id === jobToMove.status);
    if (currentStatusIndex <= 0) return;

    const prevStatusKey = columns[currentStatusIndex - 1].id;

    const updatedJobData = await jobsService.updateJob(supabase, jobToMove.id, { status: prevStatusKey });

    if (updatedJobData) {
      handleUpdateJob(updatedJobData);
    }
  };

  const handleMoveToNextStatus = async (jobToMove: Job) => {
    const currentStatusIndex = columns.findIndex(c => c.id === jobToMove.status);
    if (currentStatusIndex < 0 || currentStatusIndex >= columns.length - 1) return;

    const nextStatusKey = columns[currentStatusIndex + 1].id;

    const updatedJobData = await jobsService.updateJob(supabase, jobToMove.id, { status: nextStatusKey });

    if (updatedJobData) {
      handleUpdateJob(updatedJobData);
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
    <div className="flex flex-col">
      <div className="flex justify-end mb-4">
        <AddJobDialog onSaveJob={handleSaveJob} />
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-gray-700">
        <Lightbulb className="h-4 w-4 text-blue-500 flex-shrink-0" />
        <p>
          <span className="font-semibold">Pro Tip:</span> Click a card to view details, or drag and drop to change its status.
        </p>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start mb-10">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-col self-start rounded-xl p-4 min-h-[150px] md:min-h-[300px] ${column.color}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#364442] capitalize">{column.title}</h3>
                    <span className="text-sm font-medium bg-[#364442]/5 text-[#364442]/80 rounded-full px-2.5 py-0.5">
                      {jobs[column.id]?.length || 0}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 flex-grow">
                    {jobs[column.id]?.length > 0 ? (
                      jobs[column.id]?.map((job, idx) => {
                        const currentStatusIndex = columns.findIndex(c => c.id === job.status);

                        const prevColumn = currentStatusIndex > 0
                          ? columns[currentStatusIndex - 1]
                          : null;

                        const nextColumn = currentStatusIndex > -1 && currentStatusIndex < columns.length - 1
                          ? columns[currentStatusIndex + 1]
                          : null;

                        return (
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
                                  onMoveToPrev={() => handleMoveToPrevStatus(job)}
                                  prevStatusName={prevColumn?.title}
                                  onMoveToNext={() => handleMoveToNextStatus(job)}
                                  nextStatusName={nextColumn?.title}
                                />
                              </div>
                            )}
                          </Draggable>
                        )
                      })
                    ) : (
                      <div className="flex-grow flex items-center justify-center">
                        <div className="text-center text-xs text-gray-500 p-4 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600">
                          <p>Drag a job here</p>
                        </div>
                      </div>
                    )}
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
