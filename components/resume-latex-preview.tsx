import React, { useRef } from 'react';

export function ResumeLatexPreview({ resume }: { resume: any }) {
  const printRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=900,height=650');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Resume</title>
      <style>
        body { font-family: serif; background: white; margin: 0; }
        .resume-print { max-width: 800px; margin: 0 auto; padding: 2rem; }
        h1, h2 { margin: 0; }
        section { margin-bottom: 1.5rem; }
        .border-b { border-bottom: 1px solid #ddd; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .font-bold { font-weight: bold; }
        .font-semibold { font-weight: 600; }
        .italic { font-style: italic; }
        .rounded-lg { border-radius: 0.5rem; }
        .shadow { box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .bg-gray-200 { background: #e5e7eb; }
        .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
        .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
        .text-xs { font-size: 0.75rem; }
      </style>
      </head><body><div class='resume-print'>${printContents}</div></body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
  if (!resume) return null;
  let extracted = null;
  try {
    extracted = typeof resume.extracted_data === 'string'
      ? JSON.parse(resume.extracted_data)
      : resume.extracted_data;
  } catch {
    extracted = null;
  }
  if (!extracted) return <div className="text-muted-foreground">No extracted data available.</div>;

  return (
    <div className="relative h-[80vh] flex flex-col">
      <button
        onClick={handlePrint}
        className="sticky top-0 right-0 self-end z-10 m-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded shadow text-xs font-semibold print:hidden"
        style={{ marginBottom: 0 }}
      >
        Print
      </button>
      <div
        ref={printRef}
        className="bg-white rounded-lg shadow max-w-3xl mx-auto font-serif flex-1 overflow-y-auto px-8 pt-8 pb-8"
        style={{ minHeight: '60vh', maxHeight: 'calc(80vh - 3rem)' }}
      >
        <div className="flex flex-col items-center border-b pb-4 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">{extracted.name}</h1>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            {extracted.email && <span>{extracted.email}</span>}
            {extracted.github && <span>{extracted.github}</span>}
            {extracted.linkedin && <span>{extracted.linkedin}</span>}
            {extracted.portfolio && <span>{extracted.portfolio}</span>}
          </div>
        </div>
        {extracted.bio && (
          <div className="mb-4 text-center text-base text-muted-foreground">{extracted.bio}</div>
        )}
        {extracted.experiences && extracted.experiences.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b">Experience</h2>
            <ul className="space-y-2">
              {extracted.experiences.map((exp: any, i: number) => (
                <li key={i}>
                  <div className="flex justify-between">
                    <span className="font-semibold">{exp.title}</span>
                    <span className="text-xs">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm italic">{exp.company}</div>
                  <div className="text-xs">{exp.description}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {extracted.projects && extracted.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b">Projects</h2>
            <ul className="space-y-2">
              {extracted.projects.map((proj: any, i: number) => (
                <li key={i}>
                  <div className="flex justify-between">
                    <span className="font-semibold">{proj.name}</span>
                    {(proj.githubUrl || proj.liveUrl) && (
                      <span className="flex gap-2 text-xs">
                        {proj.githubUrl && <a href={proj.githubUrl} className="underline" target="_blank">GitHub</a>}
                        {proj.liveUrl && <a href={proj.liveUrl} className="underline" target="_blank">Live</a>}
                      </span>
                    )}
                  </div>
                  <div className="text-xs">{proj.description}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {extracted.education && extracted.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b">Education</h2>
            <ul className="space-y-2">
              {extracted.education.map((edu: any, i: number) => (
                <li key={i}>
                  <div className="flex justify-between">
                    <span className="font-semibold">{edu.degree} in {edu.field}</span>
                    <span className="text-xs">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-sm italic">{edu.school}</div>
                  <div className="text-xs">{edu.description}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {extracted.skills && extracted.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {extracted.skills.map((s: any, i: number) => (
                <span key={i} className="bg-gray-200 rounded px-2 py-1 text-xs">{s.name}</span>
              ))}
            </div>
          </section>
        )}
        {extracted.certifications && extracted.certifications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b">Certifications</h2>
            <ul className="space-y-2">
              {extracted.certifications.map((cert: any, i: number) => (
                <li key={i}>
                  <div className="flex justify-between">
                    <span className="font-semibold">{cert.name}</span>
                    <span className="text-xs">{cert.issueDate} - {cert.expiryDate}</span>
                  </div>
                  <div className="text-sm italic">{cert.issuer}</div>
                  <div className="text-xs">{cert.certificationUrl}</div>
                </li>
              ))}
            </ul>
          </section>
        )}
        {extracted.languages && extracted.languages.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold mb-2 border-b">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {extracted.languages.map((l: string, i: number) => (
                <span key={i} className="bg-gray-200 rounded px-2 py-1 text-xs">{l}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
