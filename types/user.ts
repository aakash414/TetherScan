export interface UserData {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  portfolio?: string;
  bio: string;
  profile_image?: string;
  experiences: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
    proficiency: "beginner" | "intermediate" | "advanced";
  }>;
  projects: Array<{
    name: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
  }>;
  volunteer: Array<{
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate: string;
    certificationId: string;
    certificationUrl: string;
  }>;
  languages?: string[];
} 