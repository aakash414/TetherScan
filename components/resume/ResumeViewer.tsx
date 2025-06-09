'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ResumeViewerProps {
  resumeData: {
    resume: string;
    pdfBase64?: string;
    latexSource?: string;
    metadata: any;
    latexLog?: string;
    errorDetails?: string;
  };
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resumeData }) => {
  // Default to PDF view
  const [activeTab, setActiveTab] = useState<'pdf' | 'latex'>('pdf');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    // Create PDF URL from base64 data if available
    if (resumeData.pdfBase64) {
      try {
        const pdfBlob = base64ToBlob(resumeData.pdfBase64, 'application/pdf');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
        setPdfError(null);
        
        // Clean up URL on component unmount
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Error creating PDF URL:', error);
        setPdfError('Failed to create PDF preview');
        setPdfUrl(null);
      }
    } else {
      // No PDF data available
      setPdfUrl(null);
      setPdfError('PDF generation was not successful. This may be due to missing LaTeX packages.');
    }
  }, [resumeData.pdfBase64]);

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };

  // Function to download the resume as PDF
  const downloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <Button
          onClick={() => setActiveTab('pdf')}
          variant={activeTab === 'pdf' ? 'default' : 'outline'}
        >
          PDF
        </Button>
        <Button
          onClick={() => setActiveTab('latex')}
          variant={activeTab === 'latex' ? 'default' : 'outline'}
        >
          LaTeX
        </Button>
      </div>
      
      {/* Content Area */}
      <div className="p-4">
        {activeTab === 'latex' ? (
          <div className="prose max-w-none">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">LaTeX Source Code</h3>
              <Button
                onClick={() => {
                  const blob = new Blob([resumeData.latexSource || ''], { type: 'application/x-tex' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'resume.tex';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                Download .tex
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-4 rounded-md overflow-x-auto">
              {resumeData.latexSource}
            </pre>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> To generate a PDF from this LaTeX source, you need to have LaTeX installed on your system.
                You can install it with: <code>sudo apt-get install texlive-full</code> on Ubuntu/Debian or use an online LaTeX compiler.  
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[800px] w-full">
            {pdfUrl ? (
              <iframe 
                src={`${pdfUrl}#toolbar=0`} 
                className="w-full h-full border-0"
                title="Resume PDF"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-lg">
                  {!pdfError ? (
                    <>
                      <Spinner className="h-8 w-8 mb-4 mx-auto" />
                      <p className="text-gray-700 font-medium">Loading PDF preview...</p>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-500 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Generation Issue</h3>
                      <p className="text-gray-700 mb-4">{pdfError}</p>
                      <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-sm text-amber-800">
                        <p className="font-medium mb-1">Possible solutions:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Install LaTeX packages: <code className="bg-amber-100 px-1 rounded">sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra</code></li>
                          <li>View the LaTeX source tab and use an online LaTeX compiler</li>
                          <li>Use the text view for now</li>
                        </ul>
                      </div>
                      {/* Show LaTeX log and error details if available */}
                      {(resumeData.latexLog || resumeData.errorDetails) && (
                        <details className="mt-4 bg-red-50 border border-red-200 rounded p-3 text-left">
                          <summary className="font-semibold cursor-pointer text-red-700">Show LaTeX Error Log</summary>
                          {resumeData.errorDetails && (
                            <div className="mb-2 text-xs text-red-900 whitespace-pre-wrap">
                              <strong>Error Details:</strong>
                              <pre>{resumeData.errorDetails}</pre>
                            </div>
                          )}
                          {resumeData.latexLog && (
                            <div className="text-xs text-gray-800 whitespace-pre-wrap">
                              <strong>LaTeX Log:</strong>
                              <pre>{resumeData.latexLog}</pre>
                            </div>
                          )}
                        </details>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Metadata Section */}
      <div className="border-t p-4 bg-gray-50">
        <details className="text-sm">
          <summary className="font-medium cursor-pointer">Generation Details</summary>
          <div className="mt-2 space-y-2">
            {resumeData.metadata ? (
              <>
                <p>Generation Time: {resumeData.metadata.generationTime ?? 'N/A'}ms</p>
                <p>Target Position: {resumeData.metadata.jobRequirements?.title || 'Not specified'}</p>
                {resumeData.metadata.jobRequirements?.required_technologies && (
                  <p>
                    Required Technologies: {resumeData.metadata.jobRequirements.required_technologies.join(', ')}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500">No generation metadata available.</p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ResumeViewer;
