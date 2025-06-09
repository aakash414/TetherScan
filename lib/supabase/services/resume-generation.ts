import { createSupabaseServerClient } from "../../supabase/server-client";
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { type SupabaseClient } from '@supabase/supabase-js';
import { getUserMasterProfile } from './user-profile';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface JobContext {
  title: string;
  company?: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  experience_level?: string;
  industry?: string;
  salary_range?: string;
  location?: string;
  job_url?: string;
}

export interface UserProfileData {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin_id?: string;
  github_username?: string;
  profile_image?: string;
  bio?: string;
  portfolio_url?: string;
  education_data: any[];
  work_experience_data: any[];
  volunteer_experience_data: any[];
  certifications_data: any[];
  projects_data: any[];
  skills: any[];
  summary?: string;
  created_at?: string;
  updated_at?: string;
  // ...add any other fields you use
}

export interface ResumeGenerationParams {
  userId: string;
  jobContext: JobContext;
  maxProjects?: number;
  targetFormat?: 'ats' | 'creative' | 'standard';
}

export class ResumeGenerationService {
  private supabase: SupabaseClient;
  private userId: string;
  private cookieStore: ReadonlyRequestCookies;
  private geminiModel: any = null;

  constructor(userId: string, cookieStore: ReadonlyRequestCookies) {
    this.userId = userId;
    this.cookieStore = cookieStore; // Store cookieStore for later use
    this.supabase = createSupabaseServerClient(cookieStore);

    // Initialize Gemini for all AI operations
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (geminiApiKey) {
      console.log('Gemini API key found, initializing client');
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        // Use a model with higher quota limits
        this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        console.log('Gemini model initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini model:', error);
        // Set to null so we'll use fallback methods
        this.geminiModel = null;
      }
    } else {
      console.warn('No Gemini API key found, resume generation may not work properly');
    }
  }

  // Step 1: Extract job requirements using Gemini (cheaper)
  async extractJobRequirements(jobContext: JobContext): Promise<any> {
    console.log('Extracting job requirements for:', jobContext.title);
    try {
      // If Gemini is available, use it for better extraction
      if (this.geminiModel) {
        console.log('Using Gemini for job requirements extraction');
        const prompt = `
        Extract key requirements from this job posting in structured JSON format:
        
        Job Title: ${jobContext.title}
        Company: ${jobContext.company || 'Not specified'}
        Description: ${jobContext.description}
        Requirements: ${jobContext.requirements || ''}
        
        Return JSON with:
        {
          "required_technologies": ["tech1", "tech2"],
          "preferred_technologies": ["tech3", "tech4"],
          "required_skills": ["skill1", "skill2"],
          "experience_level": "junior|mid|senior|lead",
          "key_responsibilities": ["resp1", "resp2"],
          "industry_keywords": ["keyword1", "keyword2"]
        }
        `;

        try {
          const result = await this.geminiModel.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          try {
            // Check if response is wrapped in markdown code blocks and extract JSON
            let jsonText = text;

            // Extract JSON from markdown code blocks if present
            const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (codeBlockMatch && codeBlockMatch[1]) {
              jsonText = codeBlockMatch[1].trim();
              console.log('Extracted JSON from markdown code block');
            }

            const parsed = JSON.parse(jsonText);
            console.log('Successfully extracted job requirements with Gemini');
            return parsed;
          } catch (parseError) {
            console.warn('Failed to parse Gemini response, using fallback extraction:', parseError);
            return this.fallbackExtractRequirements(jobContext);
          }
        } catch (geminiError) {
          console.error('Gemini API error:', geminiError);
          return this.fallbackExtractRequirements(jobContext);
        }
      } else {
        console.log('Gemini not available, using fallback extraction method');
        return this.fallbackExtractRequirements(jobContext);
      }
    } catch (error) {
      console.error('Error extracting job requirements:', error);
      // Return a minimal set of requirements as fallback
      return {
        required_technologies: [],
        preferred_technologies: [],
        required_skills: [],
        experience_level: 'mid',
        key_responsibilities: [],
        industry_keywords: []
      };
    }
  }

  // Fallback method for extracting requirements
  private fallbackExtractRequirements(jobContext: JobContext): any {
    console.log('Using fallback extraction method');
    const description = jobContext.description || '';
    const requirements = jobContext.requirements || '';
    const responsibilities = jobContext.responsibilities || '';

    const allText = `${description} ${requirements} ${responsibilities}`;

    // Simple regex-based extraction
    const technologies = this.extractTechnologies(allText);
    const skills = this.extractSkills(allText);
    const experienceLevel = this.determineExperienceLevel(allText);

    const result = {
      required_technologies: technologies.slice(0, 5),
      preferred_technologies: technologies.slice(5, 10),
      required_skills: skills,
      experience_level: experienceLevel,
      key_responsibilities: [],
      industry_keywords: []
    };

    console.log(`Fallback extraction complete with ${result.required_technologies.length} technologies and ${result.required_skills.length} skills`);
    return result;
  }

  // Helper method to extract technologies from job description
  private extractTechnologies(description: string): string[] {
    const techKeywords = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
      'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'SQL', 'NoSQL',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST', 'API'
    ];

    return techKeywords.filter(tech =>
      description.toLowerCase().includes(tech.toLowerCase())
    );
  }

  // Helper method to extract skills from job description
  private extractSkills(description: string): string[] {
    const skillKeywords = [
      'communication', 'leadership', 'teamwork', 'problem-solving',
      'critical thinking', 'time management', 'project management',
      'agile', 'scrum', 'kanban', 'ci/cd', 'testing', 'debugging'
    ];

    return skillKeywords.filter(skill =>
      description.toLowerCase().includes(skill.toLowerCase())
    );
  }

  // Helper method to determine experience level
  private determineExperienceLevel(description: string): string {
    const text = description.toLowerCase();

    if (text.includes('senior') || text.includes('lead') || text.includes('principal') ||
      text.includes('5+ years') || text.includes('7+ years') || text.includes('10+ years')) {
      return 'senior';
    } else if (text.includes('junior') || text.includes('entry') || text.includes('graduate') ||
      text.includes('0-2 years') || text.includes('1-2 years')) {
      return 'junior';
    } else {
      return 'mid';
    }
  }

  // Generate a dummy profile for testing
  async generateDummyProfile(userId: string): Promise<UserProfileData> {
    console.log('Creating dummy profile for testing without database access');

    // Return a dummy profile structure
    return {
      user_id: userId,
      name: 'Test User',
      email: 'user@example.com',
      phone: '555-123-4567',
      location: 'San Francisco, CA',
      linkedin_id: 'https://linkedin.com/in/testuser',
      github_username: 'testuser',
      portfolio_url: 'https://testuser.dev',
      education_data: [
        {
          institution_name: 'Stanford University',
          degree: 'Master of Science',
          field: 'Computer Science',
          start_date: '2018-09-01',
          end_date: '2020-06-01',
          description: 'Focus on Machine Learning and AI'
        }
      ],
      work_experience_data: [
        {
          company_name: 'Google',
          role: 'Software Engineer',
          start_date: '2020-07-01',
          end_date: null,
          description: 'Working on cloud infrastructure and distributed systems'
        },
        {
          company_name: 'Microsoft',
          role: 'Software Engineer Intern',
          start_date: '2019-05-01',
          end_date: '2019-08-01',
          description: 'Developed features for Azure cloud services'
        }
      ],
      volunteer_experience_data: [
        {
          organization: 'Code for Good',
          role: 'Volunteer Developer',
          start_date: '2019-01-01',
          end_date: '2019-12-01',
          description: 'Built open source tools for nonprofits.'
        }
      ],
      certifications_data: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon',
          date: '2021-03-01'
        }
      ],
      projects_data: [
        {
          title: 'OpenResume',
          description: 'Open source resume builder',
          technologies: ['React', 'Node.js'],
          github_url: 'https://github.com/testuser/openresume',
          live_url: 'https://openresume.dev'
        },
        {
          name: 'E-commerce Platform',
          description: 'Full-stack e-commerce application with payment processing',
          technologies: ['Node.js', 'Express', 'MongoDB', 'React', 'Stripe API'],
          url: 'https://github.com/testuser/ecommerce'
        }
      ],
      skills: [
        { name: 'TypeScript' },
        { name: 'React' },
        { name: 'Node.js' }
      ]
    };
  }

  // Generate resume content using Gemini
  async generateResumeContent(profileData: UserProfileData, jobRequirements: any): Promise<string> {
    // Generate a prompt for the resume content
    const prompt = `
      Generate a professional resume for the following person that targets the specified job requirements.
      
      USER PROFILE:
      Name: ${profileData.name || 'Anonymous User'}
      Email: ${profileData.email}
      Phone: ${profileData.phone || 'Not provided'}
      Location: ${profileData.location || 'Not provided'}
      LinkedIn: ${profileData.linkedin_id || 'Not provided'}
      GitHub: ${profileData.github_username || 'Not provided'}
      Portfolio: ${profileData.portfolio_url || 'Not provided'}
      
      Skills: ${profileData.skills?.map(s => s.name).join(', ') || 'Not provided'}
      
      Experience: ${JSON.stringify(profileData.work_experience_data)}
      Education: ${JSON.stringify(profileData.education_data)}
      Projects: ${JSON.stringify(profileData.projects_data)}
      Certifications: ${JSON.stringify(profileData.certifications_data)}
      
      JOB REQUIREMENTS:
      Title: ${jobRequirements.title || 'Software Developer'}
      Required Technologies: ${jobRequirements.required_technologies?.join(', ') || 'N/A'}
      Required Skills: ${jobRequirements.required_skills?.join(', ') || 'N/A'}
      Experience Level: ${jobRequirements.experience_level || 'mid'}
      
      Format the resume in a clean, professional layout with Markdown formatting.
      Highlight skills and experiences that match the job requirements.
      Keep it to one page.
      `;

    try {
      // Check if Gemini is available
      if (this.geminiModel) {
        console.log('Using Gemini for resume generation');

        try {
          const result = await this.geminiModel.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          console.log('Successfully generated resume with Gemini');
          return text;
        } catch (geminiError) {
          console.error('Gemini API error:', geminiError);
          throw geminiError; // Re-throw to be caught by outer try/catch
        }
      } else {
        console.warn('Gemini model not available');
        throw new Error('Gemini model not initialized');
      }
    } catch (error) {
      console.error('Resume generation error:', error);
      // Fall back to placeholder resume
      return this.generatePlaceholderResume(profileData, jobRequirements);
    }
  }

  // Generate a placeholder resume when API calls fail
  private generatePlaceholderResume(profileData: UserProfileData, jobRequirements: any): string {
    console.log('Generating placeholder resume');

    const name = profileData.name || 'Anonymous User';
    const email = profileData.email || 'email@example.com';
    const location = profileData.location || 'Remote';
    const linkedin = profileData.linkedin_id || '';
    const github = profileData.github_username || '';
    const skills = profileData.skills?.map((s: any) => s.name || s).join(', ') || 'No skills data available';
    const education = profileData.education_data?.map((edu: any) =>
      `* ${edu.degree || 'Degree'} at ${edu.institution_name || 'Institution'} (${edu.start_date?.slice(0, 4) || ''} - ${edu.end_date?.slice(0, 4) || 'Present'})`
    ).join('\n');
    const experience = profileData.work_experience_data?.map((exp: any) =>
      `* ${exp.role || 'Position'} at ${exp.company_name || 'Company'} (${exp.start_date?.slice(0, 4) || ''} - ${exp.end_date?.slice(0, 4) || 'Present'})\n  ${exp.description || 'No description available'}`
    ).join('\n');
    const projects = profileData.projects_data?.map((proj: any) =>
      `* ${proj.title || proj.name || 'Project'}: ${proj.description || 'No description available'}\n  GitHub: ${proj.github_url || ''} Live: ${proj.live_url || ''}`
    ).join('\n');

    return `# ${name}
## ${jobRequirements.title || 'Software Developer'}

**Contact:** ${email} | ${location}${linkedin ? ` | [LinkedIn](${linkedin})` : ''}${github ? ` | [GitHub](${github})` : ''}

### Skills
${skills}

### Experience
${experience || '*No experience data available*'}

### Education
${education || '*No education data available*'}

### Projects
${projects || '*No project data available*'}

*This is a placeholder resume generated due to API limitations. Please try again later for a fully optimized resume.*`;
  }

  // Main generation function
  async generateResume(params: ResumeGenerationParams): Promise<{
    resume: string;
    metadata: any;
  }> {
    const startTime = Date.now();
    let tokensUsed = 0;
    let jobRequirements: any = null;
    let profileData: UserProfileData | null = null;
    let resumeContent: string = '';
    let finalResume: string = '';

    console.log('Starting resume generation for user', params.userId);
    console.log('Target format:', params.targetFormat);
    console.log('Max projects:', params.maxProjects);

    try {
      // Step 1: Extract job requirements using Gemini (cheaper)
      console.log('Step 1: Extracting job requirements...');
      try {
        jobRequirements = await this.extractJobRequirements(params.jobContext);
      } catch (step1Error) {
        console.error('Step 1 failed, using fallback job requirements:', step1Error);
        // Create fallback job requirements
        jobRequirements = {
          required_technologies: [],
          preferred_technologies: [],
          required_skills: [],
          experience_level: 'mid',
          key_responsibilities: [],
          industry_keywords: []
        };
      }

      // Step 2: Get user profile data (using dummy data for now)
      console.log('Step 2: Getting user profile data...');
      try {
        const { data: profileDataResult, error: profileError } = await getUserMasterProfile(this.userId, this.cookieStore);

        if (profileError) {
          console.error('Error fetching user master profile:', profileError);
          // Fallback to a minimal profile if there's an error fetching
          profileData = {
            user_id: this.userId,
            name: 'Anonymous User',
            email: 'user@example.com',
            education_data: [],
            work_experience_data: [],
            volunteer_experience_data: [],
            certifications_data: [],
            projects_data: [],
            skills: []
          };
        } else {
          profileData = profileDataResult; // This can be UserProfileData or null
        }

        // If profileData is still null (no profile found, or error occurred and data was set to null by getUserMasterProfile)
        if (!profileData) {
          console.warn(`No master profile data available for user ${params.userId} after fetch attempt, using minimal profile.`);
          profileData = {
            user_id: params.userId,
            name: 'Anonymous User',
            email: 'user@example.com',
            education_data: [],
            work_experience_data: [],
            volunteer_experience_data: [],
            certifications_data: [],
            projects_data: [],
            skills: []
          };
        }
      } catch (step2Error) {
        console.error('Step 2 failed, using minimal profile:', step2Error);
        // Create a minimal profile as fallback
        profileData = {
          user_id: params.userId,
          name: 'Anonymous User',
          email: 'user@example.com',
          education_data: [],
          work_experience_data: [],
          volunteer_experience_data: [],
          certifications_data: [],
          projects_data: [],
          skills: []
        };
      }

      // Step 3: Generate resume content using GPT-3.5 (better quality)
      console.log('Step 3: Generating resume content...');
      try {
        resumeContent = await this.generateResumeContent(profileData || {
          user_id: this.userId,
          name: 'Anonymous User',
          email: 'user@example.com',
          education_data: [],
          work_experience_data: [],
          volunteer_experience_data: [],
          certifications_data: [],
          projects_data: [],
          skills: []
        }, jobRequirements);
      } catch (step3Error) {
        console.error('Step 3 failed, using placeholder resume:', step3Error);
        resumeContent = this.generatePlaceholderResume(profileData || {
          user_id: this.userId,
          name: 'Anonymous User',
          email: 'user@example.com',
          education_data: [],
          work_experience_data: [],
          volunteer_experience_data: [],
          certifications_data: [],
          projects_data: [],
          skills: []
        }, jobRequirements);
      }

      // Final resume is the generated content
      finalResume = resumeContent;

      const generationTime = Date.now() - startTime;
      console.log(`Resume generation completed in ${generationTime}ms`);

      return {
        resume: finalResume,
        metadata: {
          generationTime,
          tokensUsed,
          selectedProjects: profileData ? profileData.projects_data?.length || 0 : 0,
          jobRequirements,
          profileData // Include the profile data in the metadata
        }
      };

    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Resume generation error:', errorMessage);

      throw new Error(`Resume generation failed: ${errorMessage}`);
    }
  }
}

