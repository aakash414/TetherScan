import { AddProjectDialog } from "@/components/add-project-dialog"
import { GitHubProjects } from "@/components/github-projects"
import { DecorativeStars } from "@/components/decorative-stars"
import { ManualProjects } from "@/components/manual-projects"

export default function ProjectsPage() {
  return (
    <div className="relative space-y-8">
      <DecorativeStars />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#006D77]">Projects</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Showcase your portfolio and track your projects
          </p>
        </div>
        <AddProjectDialog />
      </div>
      <GitHubProjects />
      <ManualProjects />
    </div>
  )
}

