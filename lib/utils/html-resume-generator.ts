// html-resume-generator.ts
// Professional HTML Resume Generator matching Jake Gutierrez's LaTeX resume
// [Server-side PDF generation moved to lib/server/pdf-generator.ts]

import type { UserProfileData } from '../supabase/services/resume-generation';

export interface JobContext {
  [key: string]: any;
}

export function generateHTMLResume(
  resumeContent: string,
  profileData: UserProfileData,
  jobContext: JobContext
): string {
  // Helper: Safe field
  const safe = (v: any, fallback = '') => (v ? v : fallback);
  const join = (arr?: (string | undefined | null)[], sep = ' | ') =>
    arr?.filter(Boolean).join(sep) ?? '';

  // Header
  const name = safe(profileData.name, 'Your Name');
  const email = safe(profileData.email);
  const phone = safe(profileData.phone);
  const location = safe(profileData.location);
  const linkedin = safe(profileData.linkedin_id);
  const github = safe(profileData.github_username);

  const contact = join([
    phone,
    email && `<a href="mailto:${email}">${email}</a>`,
    linkedin && `<a href="https://linkedin.com/in/${linkedin}" target="_blank">LinkedIn</a>`,
    github && `<a href="https://github.com/${github}" target="_blank">GitHub</a>`,
    location,
  ]);

  // Education
  const education = profileData.education_data?.length
    ? profileData.education_data
      .map((ed: any) => {
        const left = safe(ed.institution_name || ed.school, 'Institution');
        const right = join([
          safe(ed.degree),
          safe(ed.field || ed.area),
          safe(ed.start_date),
          safe(ed.end_date)
        ], ', ');
        return `<div class="entry-row">
            <div class="entry-left">${left}</div>
            <div class="entry-right">${right}</div>
          </div>`;
      })
      .join('')
    : '<div class="entry-row"><div class="entry-left">No education data provided.</div></div>';

  // Experience
  const experience = profileData.work_experience_data?.length
    ? profileData.work_experience_data
      .map((exp) => {
        const left = join([
          safe(exp.role || exp.title),
          safe(exp.company_name || exp.name)
        ], ', ');
        const right = join([
          safe(exp.location),
          safe(exp.start_date),
          safe(exp.end_date)
        ], ', ');
        const bullets = (exp.highlights && exp.highlights.length)
          ? `<ul class="bullets">${exp.highlights.map((h: string) => `<li>${h}</li>`).join('')}</ul>`
          : exp.description
            ? `<ul class="bullets"><li>${exp.description}</li></ul>`
            : '';
        return `<div class="entry-row">
            <div class="entry-left">${left}</div>
            <div class="entry-right">${right}</div>
          </div>${bullets}`;
      })
      .join('')
    : '<div class="entry-row"><div class="entry-left">No work experience provided.</div></div>';

  // Projects
  const projects = profileData.projects_data?.length
    ? profileData.projects_data
      .map((proj) => {
        const left = join([
          safe(proj.name || proj.title),
          proj.url ? `<a href="${proj.url}" target="_blank">${proj.url}</a>` : ''
        ], ', ');
        const right = join([
          Array.isArray(proj.technologies)
            ? (proj.technologies as string[]).join(', ')
            : safe(proj.technologies)
        ]);
        const bullets = (proj.highlights && proj.highlights.length)
          ? `<ul class="bullets">${proj.highlights.map((h: string) => `<li>${h}</li>`).join('')}</ul>`
          : proj.description
            ? `<ul class="bullets"><li>${proj.description}</li></ul>`
            : '';
        return `<div class="entry-row">
            <div class="entry-left">${left}</div>
            <div class="entry-right">${right}</div>
          </div>${bullets}`;
      })
      .join('')
    : '<div class="entry-row"><div class="entry-left">No projects provided.</div></div>';

  // Skills
  const skills = profileData.skills?.length
    ? `<div class="skills-list">${profileData.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}</div>`
    : '<div class="skills-list">No skills provided.</div>';

  // HTML & CSS
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Resume - ${name}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; }
      a { color: #000 !important; text-decoration: underline !important; }
    }
    html, body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      margin: 0;
      padding: 0;
      background: #fff;
      color: #222;
    }
    body {
      margin: 0.5in;
      box-sizing: border-box;
      width: auto;
      min-width: 0;
      max-width: 8.5in;
    }
    .resume-container {
      width: 100%;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      text-align: center;
      margin-bottom: 0.2in;
    }
    .name {
      font-size: 24pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .contact {
      margin-top: 0.1in;
      font-size: 11pt;
      color: #222;
    }
    .section {
      margin-top: 0.18in;
      margin-bottom: 0.08in;
    }
    .section-title {
      font-weight: bold;
      font-size: 13pt;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #222;
      margin-bottom: 0.08in;
      padding-bottom: 2px;
      text-transform: uppercase;
    }
    .entry-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.06in;
      gap: 1.5em;
    }
    .entry-left {
      font-weight: 600;
      min-width: 40%;
      flex: 1 1 60%;
      word-break: break-word;
    }
    .entry-right {
      text-align: right;
      font-style: italic;
      color: #444;
      min-width: 30%;
      flex: 1 1 40%;
      word-break: break-word;
    }
    .bullets {
      margin: 0 0 0.08in 1.2em;
      padding: 0;
      list-style: disc inside;
      font-size: 11pt;
    }
    .bullets li {
      margin-bottom: 0.04in;
      line-height: 1.3;
    }
    .skills-list {
      margin-top: 0.08in;
      font-size: 11pt;
    }
    a {
      color: #0a0aaf;
      text-decoration: underline;
      word-break: break-all;
    }
    @media print {
      .resume-container { box-shadow: none !important; }
      a { color: #000 !important; text-decoration: underline !important; }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="header">
      <div class="name">${name}</div>
      <div class="contact">${contact}</div>
    </div>
    <div class="section">
      <div class="section-title">Education</div>
      ${education}
    </div>
    <div class="section">
      <div class="section-title">Experience</div>
      ${experience}
    </div>
    <div class="section">
      <div class="section-title">Projects</div>
      ${projects}
    </div>
    <div class="section">
      <div class="section-title">Technical Skills</div>
      ${skills}
    </div>
  </div>
</body>
</html>`;
}

// Client-side PDF (html2pdf.js)
// Usage: await generatePDFClientSide(html, 'resume.pdf')
export async function generatePDFClientSide(html: string, filename = 'resume.pdf') {
  // @ts-ignore
  const html2pdf = (window as any).html2pdf;
  if (!html2pdf) throw new Error('html2pdf.js is not loaded');
  return html2pdf()
    .from(html)
    .set({
      margin: [0.5, 0.5, 0.5, 0.5],
      filename,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    })
    .save();
}
