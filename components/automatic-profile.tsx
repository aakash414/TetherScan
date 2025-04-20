"use client"

import { useState } from "react"
import { ResumeUpload } from "@/components/resume-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { UserData } from "@/types/user"

interface AutomaticProfileProps {
  userData: UserData;
  onResumeData: (data: Partial<UserData>) => void;
  uploadStatus: string;
  setUploadStatus: (status: string) => void;
}

export function AutomaticProfile({ userData, onResumeData, uploadStatus, setUploadStatus }: AutomaticProfileProps) {
  const [linkedInUrl, setLinkedInUrl] = useState("")

  return (
    <Tabs defaultValue="resume" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="resume">Upload Resume</TabsTrigger>
        <TabsTrigger value="linkedin">LinkedIn Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="resume">
        <ResumeUpload
          userData={userData}
          onUpdateUserData={onResumeData}
          uploadStatus={uploadStatus}
          setUploadStatus={setUploadStatus}
        />
      </TabsContent>

      <TabsContent value="linkedin">
        <div className="space-y-4">
          <Input
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}