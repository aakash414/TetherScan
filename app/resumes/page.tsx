"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, FileText } from 'lucide-react'
import { ResumeUploadMinimal } from '@/components/resume-upload-minimal'
import { ResumeLatexPreview } from '@/components/resume-latex-preview'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { getResumes, addResume, deleteResume } from '@/lib/supabase/services/resume'
import { createClient } from '@/lib/supabase/client'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedResume, setSelectedResume] = useState<any | null>(null)

  useEffect(() => {
    (async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        fetchResumes(user.id)
      }
    })()
  }, [])

  async function fetchResumes(uid: string) {
    setLoading(true)
    const { data, error } = await getResumes(uid)
    if (!error) setResumes(data || [])
    setLoading(false)
  }

  async function handleUpload(title: string, extractedData: any) {
    if (!userId) return
    setUploading(true)
    await addResume(userId, title, extractedData)
    await fetchResumes(userId)
    setUploading(false)
  }

  async function handleDelete(id: string) {
    if (!userId) return
    await deleteResume(id)
    await fetchResumes(userId)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Resumes</h2>
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="upload">Upload Resume</TabsTrigger>
        </TabsList>
        <TabsContent value="manual">
          <div className="text-muted-foreground p-8 text-center">Manual entry coming soon.</div>
        </TabsContent>
        <TabsContent value="upload">
          <ResumeUploadMinimal onUpload={handleUpload} uploading={uploading} />
        </TabsContent>
      </Tabs>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : resumes.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">No resumes found.</div>
        ) : resumes.map(resume => (
          <Card key={resume.id} className="cursor-pointer" onClick={() => { setSelectedResume(resume); setModalOpen(true); }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {resume.title}
              </CardTitle>
              <CardDescription>
                Last updated: {resume.updated_at ? new Date(resume.updated_at).toLocaleString() : 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="truncate text-xs text-muted-foreground">
                {resume.extracted_data ? resume.extracted_data.slice(0, 120) + (resume.extracted_data.length > 120 ? '...' : '') : 'No data'}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {/* <Button variant="outline">Edit</Button> */}
              <Button variant="destructive" size="icon" onClick={e => { e.stopPropagation(); handleDelete(resume.id); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl">
          <ResumeLatexPreview resume={selectedResume} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

