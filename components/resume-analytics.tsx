import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

export function ResumeAnalytics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resume Analytics</CardTitle>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Technical Skills Match</span>
              <span className="font-medium">85%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-[85%] rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Experience Match</span>
              <span className="font-medium">70%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-[70%] rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Education Match</span>
              <span className="font-medium">90%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-full w-[90%] rounded-full bg-emerald-500" />
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h4 className="mb-2 font-semibold">Improvement Suggestions</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Add more details about your React.js projects</li>
              <li>Include certifications in your technical skills section</li>
              <li>Highlight leadership experience in previous roles</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

