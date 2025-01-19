import { BarChart2, BriefcaseIcon, FileText, FolderGit2, Home } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const routes = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Job Board", path: "/jobs", icon: BriefcaseIcon },
  { name: "Analytics", path: "/analytics", icon: BarChart2 },
  { name: "Resumes", path: "/resumes", icon: FileText },
  { name: "Projects", path: "/projects", icon: FolderGit2 },
]

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                route.path === "/" && "bg-muted"
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.name}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

