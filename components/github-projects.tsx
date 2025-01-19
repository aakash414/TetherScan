"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderGit2, ExternalLink, Github, RefreshCw } from 'lucide-react'

interface GitHubProject {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
}

export function GitHubProjects() {
  const [projects, setProjects] = useState<GitHubProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/github-projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }
      setProjects(data)
    } catch (error) {
      console.error('Error fetching GitHub projects:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch projects')
      setProjects([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-[#006D77]">GitHub Projects</h3>
        <Button onClick={fetchProjects} disabled={loading} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      {loading ? (
        <p>Loading GitHub projects...</p>
      ) : error ? (
        <div className="text-red-500">
          <p>{error}</p>
          <Button onClick={fetchProjects} className="mt-2" variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#006D77]">
                  <FolderGit2 className="h-5 w-5" />
                  {project.name}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.topics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="bg-[#E8F3F1] text-[#006D77]">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto flex justify-between">
                {project.homepage && (
                  <Button variant="outline" size="sm" className="text-[#006D77]" asChild>
                    <a href={project.homepage} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Demo
                    </a>
                                          </Button>
                )}
                <Button variant="outline" size="sm" className="text-[#006D77]" >
                  <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Source
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
