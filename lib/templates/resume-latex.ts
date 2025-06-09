import { JobContext, UserProfileData } from '../supabase/services/resume-generation';

// Function to escape LaTeX special characters
function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[{}]/g, (match) => `\\${match}`)
    .replace(/[#$%&_^]/g, (match) => `\\${match}`)
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\|/g, '\\textbar{}');
}

export const generateLatexResume = (resumeContent: string, profileData: UserProfileData, jobContext: JobContext): string => {
  // Extract and escape profile data
  const name = escapeLatex(profileData.name || 'Your Name');
  const email = profileData.email || 'your.email@example.com';
  const phone = escapeLatex(profileData.phone || '');
  const location = escapeLatex(profileData.location || '');

  // Build contact line
  let contactParts = [];
  if (phone) contactParts.push(phone);
  if (email) contactParts.push(`\\href{mailto:${email}}{\\underline{${email}}}`);
  if (profileData.linkedin_id) {
    const linkedinUrl = profileData.linkedin_id.startsWith('http')
      ? profileData.linkedin_id
      : `https://linkedin.com/in/${profileData.linkedin_id}`;
    contactParts.push(`\\href{${linkedinUrl}}{\\underline{LinkedIn}}`);
  }
  if (profileData.github_username) {
    const githubUrl = profileData.github_username.startsWith('http')
      ? profileData.github_username
      : `https://github.com/${profileData.github_username}`;
    contactParts.push(`\\href{${githubUrl}}{\\underline{GitHub}}`);
  }
  if (location) contactParts.push(location);

  const contactLine = contactParts.join(' $|$ ');

  // Education Section
  const educationSection = profileData.education_data && profileData.education_data.length > 0
    ? profileData.education_data.map((edu: any) => {
      const institution = escapeLatex(edu.institution_name || edu.school || '');
      const location = escapeLatex(edu.location || '');
      const degree = escapeLatex(edu.degree || edu.studyType || '');
      const field = escapeLatex(edu.field || edu.area || '');
      const startDate = escapeLatex(edu.start_date || '');
      const endDate = escapeLatex(edu.end_date || 'Present');

      return `    \\resumeSubheading
      {${institution}}{${location}}
      {${degree}${field ? ` in ${field}` : ''}}{${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}}`;
    }).join('\n')
    : `    \\resumeSubheading
      {Your University}{City, State}
      {Bachelor of Science in Computer Science}{2020 -- 2024}`;

  // Experience Section
  const experienceSection = profileData.work_experience_data && profileData.work_experience_data.length > 0
    ? profileData.work_experience_data.map((exp: any) => {
      const role = escapeLatex(exp.role || exp.title || '');
      const company = escapeLatex(exp.company_name || exp.name || '');
      const location = escapeLatex(exp.location || '');
      const startDate = escapeLatex(exp.start_date || '');
      const endDate = escapeLatex(exp.end_date || 'Present');

      let highlights = '';
      if (Array.isArray(exp.highlights) && exp.highlights.length > 0) {
        highlights = exp.highlights
          .map((item: string) => `        \\resumeItem{${escapeLatex(item)}}`)
          .join('\n');
      } else if (exp.description) {
        highlights = `        \\resumeItem{${escapeLatex(exp.description)}}`;
      }

      return `    \\resumeSubheading
      {${role}}{${startDate}${startDate && endDate ? ' -- ' : ''}${endDate}}
      {${company}}{${location}}
      \\resumeItemListStart
${highlights}
      \\resumeItemListEnd`;
    }).join('\n')
    : `    \\resumeSubheading
      {Software Engineer}{2022 -- Present}
      {Tech Company}{City, State}
      \\resumeItemListStart
        \\resumeItem{Developed and maintained web applications using modern technologies}
        \\resumeItem{Collaborated with cross-functional teams to deliver high-quality software}
      \\resumeItemListEnd`;

  // Projects Section
  const projectsSection = profileData.projects_data && profileData.projects_data.length > 0
    ? profileData.projects_data.map((proj: any) => {
      const name = escapeLatex(proj.name || proj.title || '');
      const technologies = Array.isArray(proj.technologies)
        ? proj.technologies.map(escapeLatex).join(', ')
        : escapeLatex(proj.technologies || '');
      const url = proj.url || '';

      let highlights = '';
      if (Array.isArray(proj.highlights) && proj.highlights.length > 0) {
        highlights = proj.highlights
          .map((item: string) => `        \\resumeItem{${escapeLatex(item)}}`)
          .join('\n');
      } else if (proj.description) {
        highlights = `        \\resumeItem{${escapeLatex(proj.description)}}`;
      }

      const urlPart = url ? `\\href{${url}}{\\underline{${url}}}` : '';
      const techPart = technologies ? `\\emph{${technologies}}` : '';
      const headerRight = [techPart, urlPart].filter(Boolean).join(' $|$ ');

      return `    \\resumeProjectHeading
      {${name}}{${headerRight}}
      \\resumeItemListStart
${highlights}
      \\resumeItemListEnd`;
    }).join('\n')
    : `    \\resumeProjectHeading
      {Sample Project $|$ \\emph{React, Node.js}}{\\href{https://github.com/yourproject}{\\underline{github.com/yourproject}}}
      \\resumeItemListStart
        \\resumeItem{Built a full-stack web application with modern technologies}
        \\resumeItem{Implemented responsive design and optimized performance}
      \\resumeItemListEnd`;

  // Skills Section
  const skillsSection = Array.isArray(profileData.skills) && profileData.skills.length > 0
    ? profileData.skills.map((skill: any) => escapeLatex(skill.name || skill)).join(', ')
    : 'JavaScript, TypeScript, React, Node.js, Python, AWS, Git, Docker';

  return `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

%----------FONT OPTIONS----------
% sans-serif
% \\usepackage[sfdefault]{FiraSans}
% \\usepackage[sfdefault]{roboto}
% \\usepackage[sfdefault]{noto-sans}
% \\usepackage[default]{sourcesanspro}

% serif
% \\usepackage{CormorantGaramond}
% \\usepackage{charter}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generated pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${name}} \\\\ \\vspace{1pt}
    \\small ${contactLine}
\\end{center}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${educationSection}
  \\resumeSubHeadingListEnd

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experienceSection}
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${projectsSection}
    \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages \& Technologies}{: ${skillsSection}}
    }}
 \\end{itemize}

%-------------------------------------------
\\end{document}`;
};