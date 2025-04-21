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
        className="max-w-4xl font-quattrocento mx-auto text-gray-800 leading-relaxed p-5 text-sm bg-white rounded-lg shadow flex-1 overflow-y-auto"
        style={{ minHeight: '60vh', maxHeight: 'calc(80vh - 3rem)' }}
      >
        {/* HEADER */}
        <header className="mb-2 border-gray-800 pb-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{extracted.name}</h1>
            <div className="mt-2 text-sm flex flex-wrap justify-center items-center">
              {/* Location */}
              {extracted.location && (
                <p className="mx-2 my-1 flex items-center">
                  <span className="mr-1">
                    {/* Location SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </span>
                  {extracted.location}
                </p>
              )}
              {/* Email */}
              {extracted.email && (
                <a href={`mailto:${extracted.email}`} className="mx-2 my-1 flex items-center">
                  <span className="mr-1">
                    {/* Email SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  {extracted.email}
                </a>
              )}
              {/* Phone */}
              {extracted.phone && (
                <p className="mx-2 my-1 flex items-center">
                  <span className="mr-1">
                    {/* Phone SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </span>
                  {extracted.phone}
                </p>
              )}
              {/* Website */}
              {extracted.portfolio && (
                <a href={extracted.portfolio} target="_blank" rel="noopener noreferrer" className="mx-2 my-1 flex items-center">
                  <span className="mr-1">
                    {/* Website SVG */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                    </svg>
                  </span>
                  {extracted.portfolio}
                </a>
              )}
              {/* Socials */}
              {(extracted.linkedin || extracted.github || extracted.twitter) && (
                <>
                  {extracted.linkedin && (
                    <a href={extracted.linkedin} target="_blank" rel="noopener noreferrer" className="mx-2 my-1 flex items-center">
                      {/* LinkedIn SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50" className="size-4 mr-1"><path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path></svg>
                      {extracted.linkedin.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {extracted.github && (
                    <a href={extracted.github} target="_blank" rel="noopener noreferrer" className="mx-2 my-1 flex items-center">
                      {/* GitHub SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="size-4 mr-1" viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path></svg>
                      {extracted.github.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {extracted.twitter && (
                    <a href={extracted.twitter} target="_blank" rel="noopener noreferrer" className="mx-2 my-1 flex items-center">
                      {/* Twitter SVG */}
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="size-4 mr-1" viewBox="0 0 50 50"><path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path></svg>
                      {extracted.twitter.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </header>

        {/* ABOUT SECTION */}
        {extracted.bio && (
          <section className="mb-4">
            <p className="text-xs">{extracted.bio}</p>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {extracted.experiences && extracted.experiences.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Experience</h2>
            {extracted.experiences.map((work: any, index: number) => (
              <div key={`workResume-${index}`} className="mb-3 ml-2">
                <h3 className="text-base font-semibold mb-1">{work.title}</h3>
                <p className="italic text-xs mb-1">{work.company}{work.location ? `, ${work.location}` : ""}</p>
                <p className="text-xs mb-1">{work.startDate} - {work.endDate}</p>
                <p className="text-xs">{work.description}</p>
                {work.highlights && work.highlights.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    {work.highlights.map((highlight: string, idx: number) => (
                      <li key={`highlightWork-${idx}`}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION SECTION */}
        {extracted.education && extracted.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Education</h2>
            {extracted.education.map((edu: any, index: number) => (
              <div key={`educationResume-${index}`} className="mb-3 ml-2">
                <h3 className="text-base font-semibold mb-1">{edu.degree} in {edu.field}</h3>
                <p className="italic text-xs mb-1">{edu.school}</p>
                <p className="text-xs mb-1">{edu.startDate} - {edu.endDate}</p>
                {edu.score && <p className="text-xs">Score: {edu.score}</p>}
                {edu.courses && edu.courses.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    {edu.courses.map((course: string, idx: number) => (
                      <li key={`courseResume-${idx}`}>{course}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS SECTION */}
        {extracted.projects && extracted.projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Projects</h2>
            {extracted.projects.map((project: any, index: number) => (
              <div key={`projectResume-${index}`} className="mb-3 ml-2">
                <h3 className="text-base font-semibold mb-1">{project.name || project.title}</h3>
                <p className="text-xs">{project.description}</p>
                {project.duration && <p className="text-xs">Duration: {project.duration}</p>}
                {project.technologies && <p className="text-xs">Technologies: {project.technologies.join(", ")}</p>}
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    {project.highlights.map((highlight: string, idx: number) => (
                      <li key={`highlight-${idx}`}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* SKILLS SECTION */}
        {extracted.skills && extracted.skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {extracted.skills.map((skill: any, index: number) => (
                <span
                  key={`skillResume-${index}`}
                  className="bg-gray-200 rounded px-2 py-1 text-xs mb-1"
                  title={skill.keywords && skill.keywords.length > 0 ? skill.keywords.join(", ") : undefined}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATES SECTION */}
        {extracted.certifications && extracted.certifications.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Certificates</h2>
            {extracted.certifications.map((cert: any, index: number) => (
              <div key={`certificateResume-${index}`} className="mb-2 ml-2">
                <h3 className="text-base font-semibold mb-1">{cert.name}</h3>
                <p className="text-xs">Issuer: {cert.issuer}</p>
                <p className="text-xs">Date: {cert.issueDate || cert.date}</p>
                {cert.url && (
                  <p>
                    <a href={cert.url} className="text-blue-600 hover:underline">View Certificate</a>
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* AWARDS SECTION */}
        {extracted.awards && extracted.awards.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Awards</h2>
            {extracted.awards.map((award: any, index: number) => (
              <div key={`awardResume-${index}`} className="mb-2 ml-2">
                <h3 className="text-base font-semibold mb-1">{award.title}</h3>
                <p className="text-xs">Awarder: {award.awarder}</p>
                <p className="text-xs">Date: {award.date}</p>
                <p className="text-xs">{award.summary}</p>
              </div>
            ))}
          </section>
        )}

        {/* LANGUAGES SECTION */}
        {extracted.languages && extracted.languages.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Languages</h2>
            <div className="flex flex-wrap">
              {extracted.languages.map((lang: any, index: number) => (
                <p key={`languageResume-${index}`} className="mr-5 text-xs ml-2">
                  {lang.language || lang.name || lang}: {lang.fluency || lang.level || ""}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* INTERESTS SECTION */}
        {extracted.interests && extracted.interests.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">Interests</h2>
            <div className="flex flex-wrap">
              {extracted.interests.map((interest: any, index: number) => (
                <div key={`interestResume-${index}`} className="w-1/2 mb-2 ml-2">
                  <h3 className="text-sm font-semibold mb-1">{interest.name}</h3>
                  <p className="text-xs">{(interest.keywords || []).join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REFERENCES SECTION */}
        {extracted.references && extracted.references.length > 0 && (
          <section className="mb-4">
            <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">References</h2>
            {extracted.references.map((ref: any, index: number) => (
              <blockquote key={`referenceResume-${index}`} className="italic border-l-4 border-gray-300 pl-3 mb-2 ml-2">
                <p className="text-xs">{ref.reference}</p>
                <footer className="text-right text-xs">- {ref.name}</footer>
              </blockquote>
            ))}
          </section>
        )}
      </div>
    </div>
  );
  //     <div>
  //       {extracted.bio && (
  //         <div className="mb-4 text-center text-base text-muted-foreground">{extracted.bio}</div>
  //       )}
  //       {extracted.experiences && extracted.experiences.length > 0 && (
  //         <section className="mb-6">
  //           <h2 className="text-lg font-bold mb-2 border-b">Experience</h2>
  //           <ul className="space-y-2">
  //             {extracted.experiences.map((exp: any, i: number) => (
  //               <li key={i}>
  //                 <div className="flex justify-between">
  //                   <span className="font-semibold">{exp.title}</span>
  //                   <span className="text-xs">{exp.startDate} - {exp.endDate}</span>
  //                 </div>
  //                 <div className="text-sm italic">{exp.company}</div>
  //                 <div className="text-xs">{exp.description}</div>
  //               </li>
  //             ))}
  //           </ul>
  //         </section>
  //       )}
  //       {extracted.projects && extracted.projects.length > 0 && (
  //         <section className="mb-6">
  //           <h2 className="text-lg font-bold mb-2 border-b">Projects</h2>
  //           <ul className="space-y-2">
  //             {extracted.projects.map((proj: any, i: number) => (
  //               <li key={i}>
  //                 <div className="flex justify-between">
  //                   <span className="font-semibold">{proj.name}</span>
  //                   {(proj.githubUrl || proj.liveUrl) && (
  //                     <span className="flex gap-2 text-xs">
  //                       {proj.githubUrl && <a href={proj.githubUrl} className="underline" target="_blank">GitHub</a>}
  //                       {proj.liveUrl && <a href={proj.liveUrl} className="underline" target="_blank">Live</a>}
  //                     </span>
  //                   )}
  //                 </div>
  //                 <div className="text-xs">{proj.description}</div>
  //               </li>
  //             ))}
  //           </ul>
  //         </section>
  //       )}
  //       {extracted.education && extracted.education.length > 0 && (
  //         <section className="mb-6">
  //           <h2 className="text-lg font-bold mb-2 border-b">Education</h2>
  //           <ul className="space-y-2">
  //             {extracted.education.map((edu: any, i: number) => (
  //               <li key={i}>
  //                 <div className="flex justify-between">
  //                   <span className="font-semibold">{edu.degree} in {edu.field}</span>
  //                   <span className="text-xs">{edu.startDate} - {edu.endDate}</span>
  //                 </div>
  //                 <div className="text-sm italic">{edu.school}</div>
  //                 <div className="text-xs">{edu.description}</div>
  //               </li>
  //             ))}
  //           </ul>
  //         </section>
  //       )}
  //       {extracted.skills && extracted.skills.length > 0 && (
  //         <section className="mb-6">
  //           <h2 className="text-lg font-bold mb-2 border-b">Skills</h2>
  //           <div className="flex flex-wrap gap-2">
  //             {extracted.skills.map((s: any, i: number) => (
  //               <span key={i} className="bg-gray-200 rounded px-2 py-1 text-xs">{s.name}</span>
  //             ))}
  //           </div>
  //         </section>
  //       )}
  //       {extracted.certifications && extracted.certifications.length > 0 && (
  //         <section className="mb-6">
  //           <h2 className="text-lg font-bold mb-2 border-b">Certifications</h2>
  //           <ul className="space-y-2">
  //             {extracted.certifications.map((cert: any, i: number) => (
  //               <li key={i}>
  //                 <div className="flex justify-between">
  //                   <span className="font-semibold">{cert.name}</span>
  //                   <span className="text-xs">{cert.issueDate} - {cert.expiryDate}</span>
  //                 </div>
  //                 <div className="text-sm italic">{cert.issuer}</div>
  //                 <div className="text-xs">{cert.certificationUrl}</div>
  //               </li>
  //             ))}
  //           </ul>
  //         </section>
  //       )}
  //       {extracted.languages && extracted.languages.length > 0 && (
  //         <section className="mb-6">
  //           <h2 className="text-lg font-bold mb-2 border-b">Languages</h2>
  //           <div className="flex flex-wrap gap-2">
  //             {extracted.languages.map((l: string, i: number) => (
  //               <span key={i} className="bg-gray-200 rounded px-2 py-1 text-xs">{l}</span>
  //             ))}
  //           </div>
  //         </section>
  //       )}
  //     </div>
  //   </div>
  // );
}
