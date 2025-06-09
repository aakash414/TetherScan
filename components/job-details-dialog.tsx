import React, { useState } from "react";
import HTMLResumeViewer from './resume/HTMLResumeViewer';
import { generateHTMLResume, generatePDFClientSide } from '@/lib/utils/html-resume-generator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Building2, MapPin, Loader2, FileText, FileCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/browser-client";
import { saveGeneratedHtmlResume } from "@/lib/supabase/services/resume";

export interface JobDetails {
  id: string;
  company: string;
  location: string;
  remote: boolean;
  role: string;
  expectedSalaryMin?: string;
  expectedSalaryMax?: string;
  salaryFrequency?: string;
  jobDescription?: string;
  jobUrl?: string;
  notes?: string;
  status?: string;
}

interface JobDetailsDialogProps {
  job: JobDetails;
  trigger?: React.ReactNode;
}

export function JobDetailsDialog({ job, trigger }: JobDetailsDialogProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [resumeHtml, setResumeHtml] = useState<string | null>(null);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-xl w-full p-6 bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {job.role} @ {job.company}
            </DialogTitle>
            <DialogDescription>
              {job.status && (
                <>
                  Status: <b>{job.status}</b> |
                </>
              )}
              {job.remote ? "Remote" : job.location}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto py-4 pr-2"> {/* Scrollable wrapper with padding */}
            <div className="space-y-2"> {/* Removed mt-4 */}
            <div>
              <b>Role:</b> {job.role}
            </div>
            {(job.expectedSalaryMin || job.expectedSalaryMax) && (
              <div>
                <b>Salary:</b> {job.expectedSalaryMin && `₹${job.expectedSalaryMin}`}
                {job.expectedSalaryMin && job.expectedSalaryMax && " - "}
                {job.expectedSalaryMax && `₹${job.expectedSalaryMax}`}
                {" "}
                {job.salaryFrequency}
              </div>
            )}
            {job.jobUrl && (
              <div>
                <b>Job URL:</b>{" "}
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline"
                >
                  {job.jobUrl}
                </a>
              </div>
            )}
            {job.jobDescription && (
              <div>
                <b>Description:</b>
                <br />
                <span className="text-sm whitespace-pre-line">{job.jobDescription}</span>
              </div>
            )}
            {job.notes && (
              <div>
                <b>Notes:</b>
                <br />
                <span className="text-sm whitespace-pre-line">{job.notes}</span>
              </div>
            )}
          </div>
          {generationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700"> {/* Removed mt-4 */}
              <AlertCircle size={16} />
              <span className="text-sm">{generationError}</span>
            </div>
          )}
            </div> {/* Closing the flex-grow overflow-y-auto div */}
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-200"> {/* Removed mt-6, added pt-4 and border */}
            <button
              className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 ${isGeneratingResume
                ? 'bg-gray-400 cursor-wait'
                : 'bg-[#006D77] hover:bg-[#005a66]'} text-white transition-colors`}
              onClick={async () => {
                if (!user?.id) {
                  toast({
                    title: "Authentication required",
                    description: "Please sign in to generate a resume",
                    variant: "destructive"
                  });
                  return;
                }

                setIsGeneratingResume(true);
                setGenerationError(null);

                try {
                  const response = await fetch('/api/resume/generate', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      // Include credentials to ensure cookies are sent
                    },
                    // This ensures cookies are sent with the request
                    credentials: 'include',
                    body: JSON.stringify({
                      userId: user.id,
                      jobContext: {
                        title: job.role,
                        company: job.company,
                        description: job.jobDescription || '',
                        location: job.location,
                        requirements: '',
                        salary_range: job.expectedSalaryMin && job.expectedSalaryMax ?
                          `${job.expectedSalaryMin}-${job.expectedSalaryMax} ${job.salaryFrequency || ''}` : undefined,
                        job_url: job.jobUrl
                      },
                      maxProjects: 4,
                      targetFormat: 'ats'
                    })
                  });

                  const result = await response.json();

                  if (!result.success) {
                    throw new Error(result.error || 'Failed to generate resume');
                  }
                  console.log(result)
                  setResumeData(result.data); // result should contain pdfBase64, latexSource, etc.
                  // Generate HTML resume and open modal
                  try {
                    const html = generateHTMLResume(
                      result.data.resume,
                      result.data.metadata?.profileData || {},
                      result.data.metadata?.jobRequirements || {}
                    );
                    setResumeHtml(html);
                  } catch (e) {
                    setResumeHtml('<div style="padding:2em;color:red;">Failed to generate HTML resume.</div>');
                  }
                  setResumeModalOpen(true);

                  toast({
                    title: "Resume generated!",
                    description: `Tailored for ${job.role} at ${job.company}`,
                    variant: "default"
                  });

                } catch (error: unknown) {
                  console.error('Resume generation error:', error);
                  const errorMessage = error instanceof Error ? error.message : 'Failed to generate resume';
                  setGenerationError(errorMessage);
                  toast({
                    title: "Resume generation failed",
                    description: errorMessage,
                    variant: "destructive"
                  });
                } finally {
                  setIsGeneratingResume(false);
                }
              }}
              disabled={isGeneratingResume}
            >
              {isGeneratingResume ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  {resumeHtml ? 'Regenerate Resume' : 'Generate Resume'}
                </>
              )}
            </button>

            {/* Save/View Resume Button */}
            {resumeHtml && (
              <>
                {!savedResumeId ? (
                  <button
                    className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white transition-colors ${isSavingResume ? 'opacity-75 cursor-not-allowed' : ''}`}
                    onClick={async () => {
                      if (!user || !user.id) {
                        toast({
                          title: "Cannot save resume",
                          description: "You need to be logged in to save the resume.",
                          variant: "destructive"
                        });
                        return;
                      }
                      if (!resumeHtml) {
                        toast({
                          title: "Cannot save resume",
                          description: "No resume content to save.",
                          variant: "destructive"
                        });
                        return;
                      }

                      const resumeTitle = `Resume for ${job.role} at ${job.company} - ${new Date().toLocaleDateString()}`;
                      setIsSavingResume(true);
                      try {
                        const { data, error } = await saveGeneratedHtmlResume(user.id, resumeTitle, resumeHtml);
                        if (error) throw error;
                        if (data) {
                          setSavedResumeId(data.id);
                          toast({
                            title: "Resume saved!",
                            description: "The generated resume has been saved to your profile.",
                            variant: "default"
                          });
                        }
                      } catch (saveError: any) {
                        console.error('Failed to save resume:', saveError);
                        toast({
                          title: "Failed to save resume",
                          description: saveError.message || "Could not save the generated resume.",
                          variant: "destructive"
                        });
                      } finally {
                        setIsSavingResume(false);
                      }
                    }}
                    disabled={isSavingResume}
                  >
                    {isSavingResume ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileCheck size={16} />
                        Save Generated Resume
                      </>
                    )}
                  </button>
                ) : (
                  <a
                    href={`/resumes/${savedResumeId}`}
                    className="w-full px-4 py-2 rounded flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  >
                    <FileText size={16} />
                    View Saved Resume
                  </a>
                )}
              </>
            )}

            <button
              className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 ${isGeneratingCoverLetter
                ? 'bg-gray-400 cursor-wait'
                : 'bg-[#83C5BE] hover:bg-[#6fa7a1]'} text-white transition-colors`}
              onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Cover letter generation will be available soon!",
                  variant: "default"
                });
              }}
              disabled={isGeneratingCoverLetter}
            >
              {isGeneratingCoverLetter ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <FileCheck size={16} />
                  Generate Cover Letter
                </>
              )}
            </button>

            <button
              className="w-full px-4 py-2 rounded bg-gray-200 text-gray-700 cursor-not-allowed flex items-center justify-center gap-2"
              disabled
            >
              More Actions (Coming Soon)
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Preview Modal */}
      <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
        <DialogContent className="max-w-5xl w-full bg-white rounded-lg shadow-xl max-h-[95vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <DialogClose
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
            onClick={() => setResumeModalOpen(false)}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </DialogClose>
          <div className="flex justify-end px-6 py-4 border-b">
            <Button
              variant="outline"
              onClick={async () => {
                if (!resumeHtml) return;
                try {
                  await generatePDFClientSide(resumeHtml, 'resume.pdf');
                } catch (err) {
                  toast({ description: 'PDF download failed', variant: 'destructive' });
                }
              }}
              disabled={!resumeHtml}
            >
              Download PDF
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto"> {/* This div will scroll */}
            {resumeHtml && <HTMLResumeViewer html={resumeHtml} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
