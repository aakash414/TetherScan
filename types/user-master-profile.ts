/**
 * Type definition for the user_master_profile materialized view
 * This represents the JSON structure returned by the view
 */
export interface UserMasterProfile {
  user_id: string;
  name: string;
  email: string;
  github_username: string | null;
  linkedin_id: string | null;
  portfolio_url: string | null;
  bio: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  
  // JSON aggregated fields
  skills: Array<{
    id: string;
    user_id: string;
    skill_name: string;
    proficiency: "beginner" | "intermediate" | "advanced";
    created_at: string;
    updated_at: string;
  }>;
  
  projects: Array<{
    id: string;
    user_id: string;
    title: string;
    description: string;
    github_url: string | null;
    live_url: string | null;
    created_at: string;
    updated_at: string;
  }>;
  
  education: Array<{
    id: string;
    user_id: string;
    school: string;
    degree: string;
    field: string;
    start_date: string;
    end_date: string;
    grade: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
  }>;
  
  certifications: Array<{
    id: string;
    user_id: string;
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date: string | null;
    certification_id: string | null;
    certification_url: string | null;
    created_at: string;
    updated_at: string;
  }>;
  
  work_experience: Array<{
    id: string;
    user_id: string;
    company_name: string;
    role: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
  }>;
  
  volunteer_experience: Array<{
    id: string;
    user_id: string;
    organization: string;
    role: string;
    start_date: string;
    end_date: string | null;
    description: string | null;
    created_at: string;
    updated_at: string;
  }>;
}
