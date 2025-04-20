"use client"

import { useState } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCard } from "@/components/job-card"
import { AddJobDialog } from "@/components/add-job-dialog"
import { Job, JobStatus, JobsState, Column } from "@/lib/types"
import { jobsService } from "@/lib/supabase/services/jobs"

const columns: Column[] = [
  { id: "wishlist", title: "Wishlist", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "applied", title: "Applied", color: "bg-purple-100 dark:bg-purple-900" },
  { id: "interviewing", title: "Interviewing", color: "bg-orange-100 dark:bg-orange-900" },
  { id: "offered", title: "Offered", color: "bg-green-100 dark:bg-green-900" },
  { id: "rejected", title: "Rejected", color: "bg-red-100 dark:bg-red-900" },
]

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function JobBoard() {
  const [jobs, setJobs] = useState<JobsState>({
    wishlist: [],
    applied: [],
    interviewing: [],
    offered: [],
    rejected: []
  })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    // Fetch jobs from Supabase and organize by status
    jobsService.getJobs().then((allJobs: Job[]) => {
      const grouped: JobsState = {
        wishlist: [],
        applied: [],
        interviewing: [],
        offered: [],
        rejected: []
      }
      allJobs.forEach(job => {
        grouped[job.status].push(job)
      })
      setJobs(grouped)
    }).catch(err => {
      console.error('Failed to fetch jobs from Supabase:', err)
    })
  }, [])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    if (source.droppableId === destination.droppableId) return

    const sourceColumn = [...jobs[source.droppableId as JobStatus]]
    const destColumn = [...jobs[destination.droppableId as JobStatus]]
    const [removed] = sourceColumn.splice(source.index, 1)
    destColumn.splice(destination.index, 0, removed)

    setJobs({
      ...jobs,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    })
  }

  const handleAddJob = async (newJob: Job) => {
    try {
      const savedJob = await jobsService.createJob(newJob)
      const status = savedJob.status as JobStatus
      setJobs(prev => ({
        ...prev,
        [status]: [...prev[status], savedJob]
      }))
    } catch (error) {
      console.error('Failed to save job to Supabase:', error)
    }
  }

  return (
    <>
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-[#006D77]">Job Board</CardTitle>
          <AddJobDialog onAddJob={handleAddJob} />
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-5 gap-4">
              {columns.map((column) => (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`rounded-lg p-4 ${column.color}`}
                    >
                      <h3 className="mb-4 font-semibold text-[#006D77]">{column.title}</h3>
                      <div className="space-y-4">
                        {jobs[column.id].map((job, idx) => (
                          <Draggable key={job.id} draggableId={job.id} index={idx}>
                            {(provided) => {
                              let dragTimeout: NodeJS.Timeout | null = null;
                              let wasDragged = false;
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="cursor-pointer group relative"
                                  onClick={(e) => {
                                    if (!wasDragged) {
                                      setSelectedJob(job)
                                      setDetailsOpen(true)
                                    }
                                    wasDragged = false
                                  }}
                                >
                                  {/* Drag handle icon at top right */}
                                  <span
                                    {...provided.dragHandleProps}
                                    className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-gray-200 cursor-grab active:cursor-grabbing opacity-70 group-hover:opacity-100"
                                    title="Drag to move"
                                    onMouseDown={() => {
                                      dragTimeout = setTimeout(() => { wasDragged = true }, 100)
                                    }}
                                    onMouseUp={() => {
                                      if (dragTimeout) clearTimeout(dragTimeout)
                                      setTimeout(() => { wasDragged = false }, 100)
                                    }}
                                  >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-move"><circle cx="8" cy="8" r="7.5" stroke="#006D77" /><path d="M8 4v8m0-8-2 2m2-2 2 2m-2 6 2-2m-2 2-2-2m-4-2h8m-8 0 2-2m-2 2 2 2m6-2-2-2m2 2-2 2" /></svg>
                                  </span>
                                  <JobCard job={job} />
                                </div>
                              )
                            }}
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
        </CardContent>
      </Card>

      {/* Expanded Job Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-xl">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedJob.role} @ {selectedJob.company}</DialogTitle>
                <DialogDescription>
                  Status: <b>{selectedJob.status}</b> | {selectedJob.remote ? "Remote" : selectedJob.location}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                <div><b>Role:</b> {selectedJob.role}</div>
                <div><b>Salary:</b> {selectedJob.expectedSalaryMin && `$${selectedJob.expectedSalaryMin}`}{selectedJob.expectedSalaryMin && selectedJob.expectedSalaryMax && " - "}{selectedJob.expectedSalaryMax && `$${selectedJob.expectedSalaryMax}`} {selectedJob.salaryFrequency}</div>
                <div><b>Job URL:</b> <a href={selectedJob.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">{selectedJob.jobUrl}</a></div>
                <div><b>Description:</b><br />{selectedJob.jobDescription}</div>
                <div><b>Notes:</b><br />{selectedJob.notes}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
