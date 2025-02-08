import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderGit2, ExternalLink, Github } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution built with Next.js and Stripe. Features include product management, cart functionality, secure checkout, and order management. Implemented responsive design and optimized performance.",
    tags: ["Next.js", "React", "Stripe", "Tailwind CSS"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "A Trello-like task management application with drag-and-drop functionality. Includes real-time updates, task assignments, due dates, and project organization features.",
    tags: ["React", "Redux", "Node.js", "MongoDB"],
    demoUrl: "#",
    githubUrl: "#"
  },
  {
    id: 3,
    title: "Weather Forecast App",
    description: "A weather forecast application using OpenWeatherMap API. Provides detailed weather information, 5-day forecast, and location-based weather updates with interactive maps.",
    tags: ["React Native", "Expo", "API Integration"],
    demoUrl: "#",
    githubUrl: "#"
  },
]

export function ManualProjects() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-[#006D77]">Manual Projects</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#006D77]">
                <FolderGit2 className="h-5 w-5" />
                {project.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-[#E8F3F1] text-[#006D77]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="mt-auto flex justify-between">
              <Button variant="outline" size="sm" className="text-[#006D77]" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Demo
                </a>
              </Button>
              <Button variant="outline" size="sm" className="text-[#006D77]" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Source
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

