import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Check } from "lucide-react"

interface ResumeUploadProps {
  onResumeData: (data: any) => void
  uploadStatus: string
  setUploadStatus: (status: string) => void
}

export function ResumeUpload({ onResumeData, uploadStatus, setUploadStatus }: ResumeUploadProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadStatus("uploading")

    // Simulate file upload and data extraction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulated extracted data
    const extractedData = {
      name: "John Doe",
      email: "john.doe@example.com",
      github: "https://github.com/johndoe",
      linkedin: "https://www.linkedin.com/in/johndoe",
      bio: "Experienced software developer with a passion for creating efficient and scalable applications.",
    }

    onResumeData(extractedData)
    setUploadStatus("uploaded")
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
          className={`flex cursor-pointer items-center space-x-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ${
            uploadStatus === "uploaded" ? "bg-green-100" : ""
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

