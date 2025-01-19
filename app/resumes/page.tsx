import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Trash2 } from 'lucide-react'

export default function ResumesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Resumes</h2>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Resumes</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {["Software Engineer", "Product Manager", "Data Scientist"].map((title) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {title} Resume
                  </CardTitle>
                  <CardDescription>Last updated: 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label>Match Score</Label>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full w-[85%] rounded-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>85% match to job market</span>
                      <span>17 keywords matched</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

