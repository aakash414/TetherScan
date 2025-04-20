import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export function ResumeDetailsModal({ open, onOpenChange, resume }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume: any | null;
}) {
  if (!resume) return null;
  let extracted = null;
  try {
    extracted = typeof resume.extracted_data === 'string'
      ? JSON.parse(resume.extracted_data)
      : resume.extracted_data;
  } catch {
    extracted = null;
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resume.title}</DialogTitle>
          <div className="text-xs text-muted-foreground mt-1">
            Last updated: {resume.updated_at ? new Date(resume.updated_at).toLocaleString() : 'N/A'}
          </div>
        </DialogHeader>
        {extracted ? (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {extracted.name && <div><b>Name:</b> {extracted.name}</div>}
            {extracted.email && <div><b>Email:</b> {extracted.email}</div>}
            {extracted.bio && <div><b>Bio:</b> {extracted.bio}</div>}
            {extracted.github && <div><b>GitHub:</b> {extracted.github}</div>}
            {extracted.linkedin && <div><b>LinkedIn:</b> {extracted.linkedin}</div>}
            {extracted.portfolio && <div><b>Portfolio:</b> {extracted.portfolio}</div>}
            {extracted.experiences && extracted.experiences.length > 0 && (
              <div>
                <b>Work Experience:</b>
                <ul className="ml-4 list-disc">
                  {extracted.experiences.map((exp: any, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{exp.title}</span> at <span>{exp.company}</span> ({exp.startDate} - {exp.endDate})<br />
                      <span className="text-xs">{exp.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {extracted.education && extracted.education.length > 0 && (
              <div>
                <b>Education:</b>
                <ul className="ml-4 list-disc">
                  {extracted.education.map((edu: any, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{edu.degree}</span> in <span>{edu.field}</span> at <span>{edu.school}</span> ({edu.startDate} - {edu.endDate})<br />
                      <span className="text-xs">{edu.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {extracted.skills && extracted.skills.length > 0 && (
              <div>
                <b>Skills:</b> {extracted.skills.map((s: any) => s.name).join(', ')}
              </div>
            )}
            {extracted.projects && extracted.projects.length > 0 && (
              <div>
                <b>Projects:</b>
                <ul className="ml-4 list-disc">
                  {extracted.projects.map((proj: any, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{proj.name}</span>: {proj.description}
                      {proj.githubUrl && <span> [<a className="underline text-blue-600" href={proj.githubUrl} target="_blank">GitHub</a>]</span>}
                      {proj.liveUrl && <span> [<a className="underline text-blue-600" href={proj.liveUrl} target="_blank">Live</a>]</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {extracted.certifications && extracted.certifications.length > 0 && (
              <div>
                <b>Certifications:</b>
                <ul className="ml-4 list-disc">
                  {extracted.certifications.map((cert: any, i: number) => (
                    <li key={i}>
                      <span className="font-medium">{cert.name}</span> by <span>{cert.issuer}</span> ({cert.issueDate} - {cert.expiryDate})<br />
                      <span className="text-xs">{cert.certificationUrl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {extracted.languages && extracted.languages.length > 0 && (
              <div>
                <b>Languages:</b> {extracted.languages.map((l: string, i: number) => (
                  <Badge key={i} className="mr-1 mb-1 inline-block">{l}</Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">No extracted data available.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
