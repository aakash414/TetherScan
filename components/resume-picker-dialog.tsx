"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ResumeLatexPreview } from "@/components/resume-latex-preview";
import { ResumeUploadMinimal } from "@/components/resume-upload-minimal";
import { getResumes } from "@/lib/supabase/services/resume";

interface ResumePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  onSelectResume: (resume: any) => void;
}

export function ResumePickerDialog({ open, onOpenChange, userId, onSelectResume }: ResumePickerDialogProps) {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (open) fetchResumes();
    // eslint-disable-next-line
  }, [open]);

  async function fetchResumes() {
    setLoading(true);
    const { data, error } = await getResumes(userId);
    if (!error) setResumes(data || []);
    setLoading(false);
  }

  async function handleUpload(title: string, extractedData: any) {
    setUploading(true);
    await fetchResumes();
    setUploading(false);
    setShowUpload(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select or Upload Resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!showUpload ? (
            <>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Your Resumes</span>
                <Button size="sm" onClick={() => setShowUpload(true)} disabled={uploading}>
                  Upload New
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                {loading ? (
                  <div>Loading...</div>
                ) : resumes.length === 0 ? (
                  <div className="col-span-2 text-muted-foreground">No resumes found.</div>
                ) : resumes.map(resume => (
                  <div
                    key={resume.id}
                    className={`border rounded p-2 cursor-pointer hover:border-primary ${selectedResume?.id === resume.id ? "border-primary" : ""}`}
                    onClick={() => setSelectedResume(resume)}
                  >
                    <div className="font-medium truncate">{resume.title}</div>
                    <Button size="sm" className="mt-2" onClick={e => { e.stopPropagation(); onSelectResume(resume); onOpenChange(false); }}>
                      Select
                    </Button>
                  </div>
                ))}
              </div>
              {selectedResume && (
                <div className="mt-4 border rounded p-2 bg-muted">
                  <ResumeLatexPreview resume={selectedResume} />
                </div>
              )}
            </>
          ) : (
            <ResumeUploadMinimal onUpload={handleUpload} uploading={uploading} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
