import React, { useState, useEffect } from "react";
import HTMLResumeViewer from './resume/HTMLResumeViewer';
import { generateHTMLResume, generatePDFClientSide } from '@/lib/utils/html-resume-generator';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Building2, MapPin, Loader2, FileText, FileCheck, AlertCircle, Upload } from "lucide-react";
import { useDropzone } from 'react-dropzone';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/browser-client";
import { getResumeById, deleteResume, saveGeneratedHtmlResume } from "@/lib/supabase/services/resume";
import { jobsService } from "@/lib/supabase/services/jobs";
import { Job as JobType, JobFormData } from "@/lib/types";

interface JobDetailsDialogProps {
  job: JobType;
  onJobUpdated?: (updatedJob: JobType) => void;
  onCloseDialog?: () => void;
}

// Helper component for resume uploading
const ResumeUploader = ({ onUpload, isSaving, onCancel }: { onUpload: (content: string, isGenerated: boolean) => Promise<void>, isSaving: boolean, onCancel: () => void }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const handleParseAndUpload = async () => {
    if (!file) {
      toast({ title: 'No file selected', description: 'Please select a PDF file to upload.', variant: 'destructive' });
      return;
    }
    setIsParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const pdfjsLib = await import('pdfjs-dist/build/pdf');
      // @ts-ignore
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }
      await onUpload(fullText.trim(), false);
      setFile(null);
    } catch (err: any) {
      toast({ title: 'Error Parsing PDF', description: err.message, variant: 'destructive' });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div {...getRootProps()} className={`border-2 border-dashed p-6 rounded-md flex items-center justify-center cursor-pointer text-center ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'}`}>
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <Upload className="w-8 h-8" />
          {file ? (
            <span className="font-semibold text-emerald-600">{file.name}</span>
          ) : isDragActive ? (
            <span>Drop the PDF here...</span>
          ) : (
            <span>Drag & drop or click to select a PDF</span>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleParseAndUpload} disabled={isParsing || isSaving} className="flex-1">
          {(isParsing || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isParsing ? 'Parsing...' : isSaving ? 'Saving...' : 'Upload and Attach'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={isParsing || isSaving}>Cancel</Button>
      </div>
    </div>
  );
};

export function JobDetailsDialog({ job, onJobUpdated, onCloseDialog }: JobDetailsDialogProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();
  const [draft, setDraft] = useState<Partial<JobFormData>>({});

  const [isSaving, setIsSaving] = useState(false);
  const [resumeAction, setResumeAction] = useState<'upload' | 'generate' | null>(null);
  
  const [isLoadingAttachedResume, setIsLoadingAttachedResume] = useState(false);
  const [attachedResumeHtml, setAttachedResumeHtml] = useState<string | null>(null);
  const [attachedResumeError, setAttachedResumeError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [resumeHtml, setResumeHtml] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);

  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  useEffect(() => {
    setDraft({
      role: job.role, // Corrected: JobFormData uses 'role'
      company: job.company, // Corrected: JobFormData uses 'company'
      location: job.location,
      jobUrl: job.jobUrl,
      jobDescription: job.jobDescription,
      status: job.status,
      notes: job.notes,
      // Ensure all other relevant fields from JobType that are in JobFormData are mapped
      remote: job.remote,
      expectedSalaryMin: job.expectedSalaryMin,
      expectedSalaryMax: job.expectedSalaryMax,
      salaryFrequency: job.salaryFrequency,
      attachedResumeId: job.attachedResumeId,
      generated_resume_id: job.generated_resume_id,
      generated_resume_title: job.generated_resume_title,
    });
    setResumeAction(null);
    setAttachedResumeHtml(null);
    setResumeHtml(null);
  }, [job]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedJob = await jobsService.updateJob(supabase, job.id, draft);
      toast({ title: "Job Saved", description: "Your changes have been saved successfully." });
      if (onJobUpdated) {
        onJobUpdated(updatedJob);
      }
    } catch (error) {
      console.error("Failed to save job:", error);
      toast({ title: "Error", description: "Failed to save job details.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewAttachedResume = async () => {
    if (!job.attachedResumeId) return;
    setIsLoadingAttachedResume(true);
    setAttachedResumeError(null);
    try {
      const { data: resume, error } = await getResumeById(job.attachedResumeId);
      if (error) throw error;
      if (resume && resume.extracted_data) {
        setAttachedResumeHtml(resume.extracted_data as string);
        setResumeModalOpen(true);
      } else {
        throw new Error("Attached resume content not found or is empty.");
      }
    } catch (error: any) {
      setAttachedResumeError(error.message);
      toast({ title: "Error", description: `Could not load resume: ${error.message}`, variant: "destructive" });
    } finally {
      setIsLoadingAttachedResume(false);
    }
  };

  const handleResumeSave = async (resumeContent: string, isGenerated: boolean) => {
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    setIsSaving(true);
    try {
      if (job.attachedResumeId) {
        await deleteResume(job.attachedResumeId);
      }
      const resumeTitle = `Resume for ${job.role} at ${job.company}`;
      const { data: savedResume, error } = await saveGeneratedHtmlResume(user.id, resumeTitle, resumeContent, job.id);
      if (error) throw error;
      if (!savedResume) throw new Error("Failed to save resume.");
      
      const updatedJob = await jobsService.updateJob(supabase, job.id, { attachedResumeId: savedResume.id });
      
      toast({ title: "Resume Attached", description: "The new resume has been successfully attached to the job." });
      
      if (onJobUpdated) {
        onJobUpdated(updatedJob);
      }
      setResumeAction(null);
    } catch (error: any) {
      toast({ title: "Error Saving Resume", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!user) { toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" }); return; }
    setIsGenerating(true);
    setGenerationError(null);
    setResumeHtml(null);
    setAttachedResumeHtml(null);
    try {
      const response = await fetch('/api/generate-resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jobId: job.id }) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Failed to fetch resume data.'); }
      const result = await response.json();
      setResumeData(result.data);
      const html = generateHTMLResume(result.data.resume, result.data.metadata?.profileData || {}, result.data.metadata?.jobRequirements || {});
      setResumeHtml(html);
      setResumeModalOpen(true);
      toast({ title: "Resume generated!", description: `Tailored for ${job.role} at ${job.company}` });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate resume';
      setGenerationError(errorMessage);
      toast({ title: "Resume generation failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <DialogContent 
        className="max-w-3xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col p-0"
        onCloseAutoFocus={(e) => {
            if (JSON.stringify(draft) !== JSON.stringify(job)) {
                handleSave();
            }
            onCloseDialog?.();
        }}
      >
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 flex flex-row justify-between items-start">
            <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">{draft.role}</DialogTitle>
                {draft.company && <DialogDescription className="text-gray-500">{draft.company}</DialogDescription>}
            </div>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto p-6 space-y-6 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Position</h3>
                <Input value={draft.role || ''} onChange={e => setDraft({ ...draft, role: e.target.value })} />
            </div>
            <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Company</h3>
                <Input value={draft.company || ''} onChange={e => setDraft({ ...draft, company: e.target.value })} />
            </div>
            <div className="space-y-1">
                <h3 className="font-medium text-gray-900 flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-500" /> Location</h3>
                <Input value={draft.location || ''} placeholder="e.g. San Francisco, CA" onChange={e => setDraft({ ...draft, location: e.target.value })} />
            </div>
            <div className="space-y-1">
                <h3 className="font-medium text-gray-900 flex items-center"><Building2 className="w-4 h-4 mr-2 text-gray-500" /> Job URL</h3>
                <Input value={draft.jobUrl || ''} placeholder="Link to job posting" onChange={e => setDraft({ ...draft, jobUrl: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Job Description</h3>
            <Textarea rows={8} value={draft.jobDescription || ''} onChange={e => setDraft({ ...draft, jobDescription: e.target.value })} />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Notes</h3>
            <Textarea rows={4} value={draft.notes || ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} />
          </div>
          
          <Card className="bg-gray-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Resume</CardTitle>
              <CardDescription>
                {job.attachedResumeId ? "A resume is attached. You can view it or replace it." : "No resume attached. Upload or generate one."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {job.attachedResumeId && !resumeAction ? (
                <div className="flex items-center gap-4">
                  <Button onClick={handleViewAttachedResume} disabled={isLoadingAttachedResume}>
                    {isLoadingAttachedResume ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />} View Attached Resume
                  </Button>
                  <Button variant="outline" onClick={() => setResumeAction('upload')}>Replace</Button>
                </div>
              ) : (
                <div>
                  {resumeAction === 'upload' ? (
                    <ResumeUploader onUpload={handleResumeSave} isSaving={isSaving} onCancel={() => setResumeAction(null)} />
                  ) : resumeAction === 'generate' ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Generate a new resume based on the job description.</p>
                      <Button onClick={handleGenerateResume} disabled={isGenerating || isSaving}>
                        {(isGenerating || isSaving) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isGenerating ? 'Generating...' : isSaving ? 'Saving...' : 'Generate and Save Resume'}
                      </Button>
                      <Button variant="ghost" onClick={() => setResumeAction(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <Button onClick={() => setResumeAction('upload')}>Upload Resume</Button>
                      <Button onClick={() => setResumeAction('generate')}>Generate Resume</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
        <DialogContent className="max-w-7xl w-full bg-white rounded-lg shadow-xl max-h-[95vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto min-h-0">
            {(attachedResumeHtml || resumeHtml) && <HTMLResumeViewer html={attachedResumeHtml || resumeHtml || ''} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
