import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UserData } from '@/types/user'; // You'll need to create this type

// Update worker configuration
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface ResumeUploadProps {
  userData: UserData;
  onUpdateUserData: (data: Partial<UserData>) => void;
  uploadStatus: string;
  setUploadStatus: (status: string) => void;
}

export function ResumeUpload({ 
  userData, 
  onUpdateUserData, 
  uploadStatus, 
  setUploadStatus 
}: ResumeUploadProps) {
  const { toast } = useToast();

  const handleResumeParsing = async (file: File) => {
    try {
      setUploadStatus('parsing');
      
      // Step 1: Convert PDF to text
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }

      // Step 2: Send text to API for parsing
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText: fullText }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const { parsedData } = await response.json();
      
      // Clean and parse the data
      const cleanJson = parsedData
        .replace(/^```json\n/, '') // Remove starting ```json
        .replace(/\n```$/, '');    // Remove ending ```
      
      const resumeData = JSON.parse(cleanJson);
      console.log('Parsed Resume Data:', resumeData); // Debug log
      
      // Create new data object with existing data as fallback
      const newUserData = {
        ...userData,
        ...resumeData,
        // Ensure arrays exist even if not in parsed data
        experiences: resumeData.experiences || userData.experiences,
        education: resumeData.education || userData.education,
        skills: resumeData.skills || userData.skills,
        projects: resumeData.projects || userData.projects,
        volunteer: resumeData.volunteer || userData.volunteer,
        certifications: resumeData.certifications || userData.certifications,
        languages: resumeData.languages || userData.languages,
      };
      
      onUpdateUserData(newUserData);
      
      setUploadStatus('success');
      toast.success('Resume parsed successfully!');
    } catch (error) {
      console.error('Error parsing resume:', error);
      setUploadStatus('error');
      toast.error('Failed to parse resume. Please try again.');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadStatus('uploading');
      try {
        await handleResumeParsing(file);
      } catch (error) {
        console.error('Error processing resume:', error);
        setUploadStatus('error');
        toast.error('Failed to process resume. Please try again.');
      }
    } else {
      toast.error('Please upload a PDF file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the PDF here'
            : 'Drag and drop your resume PDF, or click to select'}
        </p>
        {uploadStatus === 'parsing' && (
          <p className="mt-2 text-sm text-blue-600">Parsing resume...</p>
        )}
        {uploadStatus === 'success' && (
          <p className="mt-2 text-sm text-green-600">Resume parsed successfully!</p>
        )}
        {uploadStatus === 'error' && (
          <p className="mt-2 text-sm text-red-600">Error parsing resume. Please try again.</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <Input
            placeholder="Name"
            value={userData.name}
            onChange={(e) => onUpdateUserData({ ...userData, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            type="email"
            value={userData.email}
            onChange={(e) => onUpdateUserData({ ...userData, email: e.target.value })}
          />
          <Input
            placeholder="GitHub Profile"
            value={userData.github}
            onChange={(e) => onUpdateUserData({ ...userData, github: e.target.value })}
          />
          <Input
            placeholder="LinkedIn Profile"
            value={userData.linkedin}
            onChange={(e) => onUpdateUserData({ ...userData, linkedin: e.target.value })}
          />
          <Textarea
            placeholder="Professional Summary"
            value={userData.bio}
            onChange={(e) => onUpdateUserData({ ...userData, bio: e.target.value })}
          />
        </div>

        {/* Work Experience Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Work Experience</h3>
          {userData.experiences.map((exp, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <Input
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) => {
                  const newExperiences = [...userData.experiences];
                  newExperiences[index] = { ...exp, title: e.target.value };
                  onUpdateUserData({ ...userData, experiences: newExperiences });
                }}
              />
              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const newExperiences = [...userData.experiences];
                  newExperiences[index] = { ...exp, company: e.target.value };
                  onUpdateUserData({ ...userData, experiences: newExperiences });
                }}
              />
              {/* Add other experience fields similarly */}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newExperiences = [...userData.experiences, {
                title: "",
                company: "",
                startDate: "",
                endDate: "",
                description: ""
              }];
              onUpdateUserData({ ...userData, experiences: newExperiences });
            }}
          >
            Add Experience
          </Button>
        </div>

        {/* Add similar sections for Education, Skills, Projects, etc. */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Education</h3>
          {userData.education.map((edu, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <Input
                placeholder="School"
                value={edu.school}
                onChange={(e) => {
                  const newEducation = [...userData.education];
                  newEducation[index] = { ...edu, school: e.target.value };
                  onUpdateUserData({ ...userData, education: newEducation });
                }}
              />
              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => {
                  const newEducation = [...userData.education];
                  newEducation[index] = { ...edu, degree: e.target.value };
                  onUpdateUserData({ ...userData, education: newEducation });
                }}
              />
            </div>
          ))}
          <Button 
            variant="outline"
            onClick={() => {
              const newEducation = [...userData.education, {
                school: "",
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
                grade: "",
                description: ""
              }];
              onUpdateUserData({ ...userData, education: newEducation });
            }}
          >
            Add Education
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Skills</h3>
          {userData.skills.map((skill, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <Input
                placeholder="Skill"
                value={skill.name}
                onChange={(e) => {
                  const newSkills = [...userData.skills];
                  newSkills[index] = { ...skill, name: e.target.value };
                  onUpdateUserData({ ...userData, skills: newSkills });
                }}
              />
              {/* Add other skill fields similarly */}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newSkills = [...userData.skills, {
                name: "",
                proficiency: "beginner" as "beginner" | "intermediate" | "advanced"
              }];
              onUpdateUserData({ ...userData, skills: newSkills });
            }}
          >
            Add Skill
          </Button> 
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Projects</h3>
          {userData.projects.map((project, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <Input
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => {
                  const newProjects = [...userData.projects];
                  newProjects[index] = { ...project, name: e.target.value };
                  onUpdateUserData({ ...userData, projects: newProjects });
                }}
              />
              <Input
                placeholder="Project Description"
                value={project.description}
                onChange={(e) => {
                  const newProjects = [...userData.projects];
                  newProjects[index] = { ...project, description: e.target.value };
                  onUpdateUserData({ ...userData, projects: newProjects });
                }}
              />
              {/* Add other project fields similarly */}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newProjects = [...userData.projects, {
                name: "",
                description: "",
                githubUrl: "",
                liveUrl: ""
              }];
              onUpdateUserData({ ...userData, projects: newProjects });
            }}
          > 
            Add Project
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Volunteer</h3>
          {userData.volunteer.map((volunteer, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                placeholder="Organization"
                value={volunteer.organization}
                onChange={(e) => {
                  const newVolunteer = [...userData.volunteer];
                  newVolunteer[index] = { ...volunteer, organization: e.target.value };
                  onUpdateUserData({ ...userData, volunteer: newVolunteer });
                }}
              />
              {/* Add other volunteer fields similarly */}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newVolunteer = [...userData.volunteer, {
                organization: "",
                role: "",
                startDate: "",
                endDate: "",
                description: ""
              }];
              onUpdateUserData({ ...userData, volunteer: newVolunteer });
            }}
          >
            Add Volunteer
          </Button>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Certifications</h3>
          {userData.certifications.map((cert, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <Input
                placeholder="Certification Name"
                value={cert.name}
                onChange={(e) => {
                  const newCertifications = [...userData.certifications];
                  newCertifications[index] = { ...cert, name: e.target.value };
                  onUpdateUserData({ ...userData, certifications: newCertifications });
                }}
              />
              {/* Add other certification fields similarly */}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newCertifications = [...userData.certifications, {
                name: "",
                issuer: "",
                issueDate: "",
                expiryDate: "",
                certificationId: "",
                certificationUrl: ""
              }];
              onUpdateUserData({ ...userData, certifications: newCertifications });
            }}
          >
            Add Certification
          </Button>
        </div>
      </div>
    </div>
  );
}
