import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check } from "lucide-react"
import { uploadResume, extractResumeText } from "@/lib/supabase/storage"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ResumeUploadProps {
  onResumeData: (data: any) => void
  uploadStatus: string
  setUploadStatus: (status: string) => void
}

export function ResumeUpload({ onResumeData, uploadStatus, setUploadStatus }: ResumeUploadProps) {
  const { toast } = useToast()
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadStatus("uploading")

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      // Upload file to Supabase Storage
      const fileUrl = await uploadResume(file, user.id)

      // Extract text from resume
      const extractedText = await extractResumeText(file)

      // Get user's Google profile data
      const { email, user_metadata } = user
      const name = user_metadata?.full_name || email?.split('@')[0] || ''

      // Combine data
      const extractedData = {
        name,
        email,
        resume_url: fileUrl,
        extracted_text: extractedText,
      }

      onResumeData(extractedData)
      setUploadStatus("uploaded")

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading resume:', error)
      setUploadStatus("idle")
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700">
        Upload your resume (PDF)
      </Label>
      <div className="flex items-center space-x-4">
        <Input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          disabled={uploadStatus === "uploading"}
          className="hidden"
        />
        <Label
          htmlFor="resume-upload"
          className={`flex cursor-pointer items-center space-x-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ${uploadStatus === "uploaded" ? "bg-green-100" : ""
            }`}
        >
          {uploadStatus === "uploaded" ? <Check className="h-4 w-4 text-green-600" /> : <Upload className="h-4 w-4" />}
          <span>{uploadStatus === "uploaded" ? "Resume uploaded" : "Choose file"}</span>
        </Label>
        {uploadStatus === "uploading" && (
          <p className="text-sm text-muted-foreground animate-pulse">Uploading and extracting data...</p>
        )}
      </div>
    </div>
  )
}
