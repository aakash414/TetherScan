"use client"

import { useState } from "react"
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { JobCard } from "@/components/job-card"
import { AddJobDialog } from "@/components/add-job-dialog"
import { Job, JobStatus, JobsState, Column } from "@/frontend/lib/types"

const columns: Column[] = [
  { id: "wishlist", title: "Wishlist", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "applied", title: "Applied", color: "bg-purple-100 dark:bg-purple-900" },
  { id: "interviewing", title: "Interviewing", color: "bg-orange-100 dark:bg-orange-900" },
  { id: "offered", title: "Offered", color: "bg-green-100 dark:bg-green-900" },
  { id: "rejected", title: "Rejected", color: "bg-red-100 dark:bg-red-900" },
]

export function JobBoard() {
  const [jobs, setJobs] = useState<JobsState>({
    wishlist: [],
    applied: [],
    interviewing: [],
    offered: [],
    rejected: []
  })

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

  const handleAddJob = (newJob: Job) => {
    setJobs(prev => ({
      ...prev,
      [newJob.status]: [...prev[newJob.status], newJob]
    }))
  }

  return (
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
                      {jobs[column.id].map((job: Job, index: number) => (
                        <Draggable
                          key={job.id}
                          draggableId={job.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <JobCard job={job} />
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
      </CardContent>
    </Card>
  )
}
