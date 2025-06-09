'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ResumeViewer from '@/components/resume/ResumeViewer';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { JobContext } from '@/lib/supabase/services/resume-generation';

export default function ResumePreviewPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [jobData, setJobData] = useState<JobContext | null>(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) {
          throw authError;
        }

        if (!session) {
          // Redirect to login if not authenticated
          router.push('/login');
          return;
        }

        setUser(session.user);

        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          setUserProfile(profileData);
        }

        // Fetch user's saved job data if available
        const { data: jobsData, error: jobsError } = await supabase
          .from('saved_jobs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (jobsError) {
          console.error('Error fetching jobs:', jobsError);
        } else if (jobsData && jobsData.length > 0) {
          setJobData({
            title: jobsData[0].job_title || 'Software Developer',
            company: jobsData[0].company_name,
            description: jobsData[0].job_description || '',
            requirements: jobsData[0].requirements || '',
            responsibilities: jobsData[0].responsibilities || '',
            location: jobsData[0].location,
            job_url: jobsData[0].job_url
          });
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Authentication error. Please try logging in again.');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [supabase, router]);

  // Default job description if none is available from saved jobs
  const defaultJobDescription: JobContext = {
    title: "Software Developer",
    company: "Tech Company",
    description: "We are looking for a skilled Software Developer with experience in modern web technologies. The ideal candidate will have experience building applications and a strong understanding of software development principles.",
    requirements: "- Experience with JavaScript/TypeScript\n- Knowledge of web frameworks\n- Understanding of software development principles",
    responsibilities: "- Develop new features\n- Write clean, maintainable code\n- Collaborate with team members"
  };

  const generateResume = async () => {
    setLoading(true);
    setError(null);

    if (!user) {
      setError('You must be logged in to generate a resume');
      setLoading(false);
      return;
    }

    try {
      // Use job data from state or fall back to default
      const jobContextToUse = jobData || defaultJobDescription;

      console.log('Generating resume for user:', user.id);
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          jobContext: jobContextToUse,
          maxProjects: 3,
          targetFormat: 'standard'
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate resume');
      }

      // Set the active tab to 'text' by default, or 'pdf' if PDF was generated
      if (data.data.pdfBase64) {
        console.log('PDF was generated successfully');
      } else {
        console.log('PDF generation was skipped, using text view as default');
      }

      setResumeData(data.data);
    } catch (err: any) {
      console.error('Resume generation error:', err);
      setError(err.message || 'An error occurred while generating the resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Resume Preview</h1>

      {!authChecked ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-8 w-8 text-blue-600" />
          <span className="ml-3 text-gray-600">Checking authentication...</span>
        </div>
      ) : error && !resumeData ? (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !user ? (
        <Alert className="mb-6">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to generate a resume.
            <Button
              onClick={() => router.push('/login')}
              variant="link"
              className="p-0 ml-2 text-blue-600"
            >
              Go to Login
            </Button>
          </AlertDescription>
        </Alert>
      ) : !resumeData && !loading && (
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate Your Resume</h2>

          {jobData ? (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-lg mb-2">Using Job Information:</h3>
              <p><span className="font-medium">Title:</span> {jobData.title}</p>
              <p><span className="font-medium">Company:</span> {jobData.company || 'Not specified'}</p>
              <p><span className="font-medium">Location:</span> {jobData.location || 'Not specified'}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-blue-600">View Job Description</summary>
                <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                  <p className="whitespace-pre-wrap">{jobData.description}</p>
                </div>
              </details>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                <span className="font-medium">Note:</span> No saved job found. A default job description will be used.
              </p>
            </div>
          )}

          <p className="mb-4 text-gray-700">
            Click the button below to generate a resume using our LaTeX template.
            This will use {jobData ? 'your saved job information' : 'a default job description'} and your profile data to create a tailored resume.
          </p>

          <Button
            onClick={generateResume}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Resume
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg shadow-md">
          <Spinner className="h-12 w-12 mb-4 text-blue-600" />
          <p className="text-lg font-medium">Generating your resume...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}

      {resumeData && (
        <>
          <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Your Generated Resume</h2>
              <p className="text-gray-600">Tailored for: {resumeData.metadata?.jobRequirements?.title || 'Software Developer'}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setResumeData(null)}
                variant="outline"
                className="text-gray-600"
              >
                Generate Another
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="secondary"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
          <ResumeViewer resumeData={resumeData} />

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-2">About This Resume</h3>
            <p className="mb-3">This resume was generated using your profile data and the selected job information. The content has been optimized to highlight your relevant skills and experience.</p>
            <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
          </div>
        </>
      )}
    </div>
  );
}
