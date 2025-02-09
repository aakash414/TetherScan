"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ResumeUpload } from "@/components/resume-upload"
import { DecorativeStars } from "@/components/decorative-stars"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { toast } from 'react-toastify'
import { AutomaticProfile } from "@/components/automatic-profile"
import { createClient } from '@/lib/supabase/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface WorkExperience {
  title: string;
  company: string;
  completed: boolean;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
}

interface Skill {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced";
}

interface Project {
  name: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
}

interface VolunteerExperience {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  certificationId: string;
  certificationUrl: string;
}

interface UserData {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  portfolio: string;
  bio: string;
  profile_image: string;
  experiences: {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  volunteer: VolunteerExperience[];
  certifications: Certification[];
  languages: string[];
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    github: "",
    linkedin: "",
    portfolio: "",
    bio: "",
    profile_image: "",
    experiences: [{
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      description: ""
    }],
    education: [{
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      grade: "",
      description: ""
    }],
    skills: [{
      name: "",
      proficiency: "intermediate"
    }],
    projects: [{
      name: "",
      description: "",
      githubUrl: "",
      liveUrl: ""
    }],
    volunteer: [{
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      description: ""
    }],
    certifications: [{
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      certificationId: "",
      certificationUrl: ""
    }],
    languages: [""]
  })
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [linkedInUrl, setLinkedInUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    title: '',
    company: '',
    completed: false
  })

  const handleResumeData = (extractedData: Partial<UserData>) => {
    setUserData((prevData) => ({ ...prevData, ...extractedData }))
  }

  const handleResumeParsing = async (extractedText: string) => {
    try {
      const response = await fetch('https://api.gemini.com/parse', { // Replace with actual Gemini API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY` // Replace with your actual API key
        },
        body: JSON.stringify({ text: extractedText })
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const parsedData = await response.json();
      handleResumeData(parsedData); // Update userData with parsed data
    } catch (error) {
      console.error('Error parsing resume:', error);
      toast.error("Failed to parse resume. Please try again.");
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Get current user
      const { data: { user } } = await (await supabase).auth.getUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      // Update progress
      setGenerationProgress(10)

      // Save or update user data
      const supabaseClient = await supabase
      const { error: userError } = await supabaseClient.from('users')
        .upsert({
          id: user.id,
          name: userData.name || user.user_metadata?.full_name,
          email: userData.email || user.email,
          github_username: userData.github,
          linkedin_id: userData.linkedin,
          profile_image: user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString()
        })

      if (userError) throw userError

      setGenerationProgress(30)

      // Save work experiences
      if (userData.experiences.length > 0) {
        const { error: expError } = await supabaseClient
          .from('work_experience')
          .upsert(
            userData.experiences.map(exp => ({
              user_id: user.id,
              company_name: exp.company,
              role: exp.title,
              start_date: exp.startDate,
              end_date: exp.endDate,
              description: exp.description,
              updated_at: new Date().toISOString()
            }))
          )
        if (expError) throw expError
      }

      setGenerationProgress(50)

      // Save education
      if (userData.education.length > 0) {
        const { error: eduError } = await supabaseClient
          .from('education')
          .upsert(
            userData.education.map(edu => ({
              user_id: user.id,
              institution_name: edu.school,
              degree: edu.degree,
              field_of_study: edu.field,
              start_date: edu.startDate,
              end_date: edu.endDate,
              grade: edu.grade,
              description: edu.description,
              updated_at: new Date().toISOString()
            }))
          )
        if (eduError) throw eduError
      }

      setGenerationProgress(60)

      // Save skills
      if (userData.skills.length > 0) {
        const { error: skillError } = await supabaseClient
          .from('skills')
          .upsert(
            userData.skills.map(skill => ({
              user_id: user.id,
              skill_name: skill.name,
              proficiency: skill.proficiency,
              updated_at: new Date().toISOString()
            }))
          )
        if (skillError) throw skillError
      }

      setGenerationProgress(70)

      // Save projects
      if (userData.projects.length > 0) {
        const { error: projError } = await supabaseClient
          .from('projects')
          .upsert(
            userData.projects.map(proj => ({
              user_id: user.id,
              title: proj.name,
              description: proj.description,
              github_url: proj.githubUrl,
              live_url: proj.liveUrl,
              updated_at: new Date().toISOString()
            }))
          )
        if (projError) throw projError
      }

      setGenerationProgress(80)

      // Save volunteer experience
      if (userData.volunteer.length > 0) {
        const { error: volError } = await supabaseClient
          .from('volunteer_experience')
          .upsert(
            userData.volunteer.map(vol => ({
              user_id: user.id,
              organization_name: vol.organization,
              role: vol.role,
              start_date: vol.startDate,
              end_date: vol.endDate,
              description: vol.description,
              updated_at: new Date().toISOString()
            }))
          )
        if (volError) throw volError
      }

      setGenerationProgress(90)

      // Save certifications
      if (userData.certifications.length > 0) {
        const { error: certError } = await supabaseClient
          .from('certifications')
          .upsert(
            userData.certifications.map(cert => ({
              user_id: user.id,
              certification_name: cert.name,
              issuing_organization: cert.issuer,
              issue_date: cert.issueDate,
              expiry_date: cert.expiryDate,
              certification_id: cert.certificationId,
              certification_url: cert.certificationUrl,
              updated_at: new Date().toISOString()
            }))
          )
        if (certError) throw certError
      }

      setGenerationProgress(100)
      toast.success("Profile created successfully!")

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error("Failed to create profile. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const completeLater = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("Not authenticated")
      }

      // Only save essential information
      const { error: userError } = await supabase.from('users')
        .upsert({
          id: user.id,
          name: userData.name || user.user_metadata?.full_name,
          email: userData.email || user.email,
          profile_image: user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString()
        })

      if (userError) throw userError

      toast.success('Profile saved! You can complete it later.')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save profile')
    }
  }

  const addArrayField = (field: keyof UserData, emptyValue: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), emptyValue],
    }))
  }

  const removeArrayField = (field: keyof UserData, index: number) => {
    setUserData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }))
  }

  const updateArrayField = (field: keyof UserData, index: number, value: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => (i === index ? value : item)),
    }))
  }

  const triggerConfetti = () => {
    const canvas = document.createElement("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.position = "fixed"
    canvas.style.top = "0"
    canvas.style.left = "0"
    canvas.style.pointerEvents = "none"
    canvas.style.zIndex = "9999"
    document.body.appendChild(canvas)

    const ctx = canvas.getContext("2d")!
    const particles: Array<{
      x: number
      y: number
      r: number
      d: number
      color: string
      tilt: number
      tiltAngleIncrement: number
      tiltAngle: number
    }> = []

    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

    for (let i = 0; i < 250; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 4 + 1,
        d: Math.random() * 250 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncrement: Math.random() * 0.07 + 0.05,
        tiltAngle: 0,
      })
    }

    let animationFrameId: number

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.lineWidth = p.r / 2
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4)
        ctx.stroke()
      })

      update()

      animationFrameId = requestAnimationFrame(draw)
    }

    function update() {
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncrement
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2
        p.x += Math.sin(p.tiltAngle) * 2
        p.tilt = Math.sin(p.tiltAngle) * 15

        if (p.y > canvas.height) {
          particles.splice(index, 1)
        }
      })

      if (particles.length === 0) {
        cancelAnimationFrame(animationFrameId)
        document.body.removeChild(canvas)
      }
    }

    draw()
  }

  const addWorkExperience = () => {
    if (!currentExperience.title || !currentExperience.company || !currentExperience.completed) {
      toast.error("Please complete the current work experience before adding a new one.");
      return;
    }
    setWorkExperiences([...workExperiences, currentExperience]);
    setCurrentExperience({ title: '', company: '', completed: false });
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    setUserData((prev) => ({
      ...prev,
      projects: prev.projects.map((project, i) => (i === index ? { ...project, [field]: value } : project)),
    }))
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error } = await (await supabase).auth.getUser()

        if (error) {
          console.error('Error fetching user:', error)
          return
        }

        if (user && user.user_metadata) {
          setUserData(prevData => ({
            ...prevData,
            name: user.user_metadata.full_name || prevData.name,
            email: user.email || prevData.email,
            // If avatar_url exists in metadata, use it for profile image
            profile_image: user.user_metadata.avatar_url || prevData.profile_image
          }))
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error)
      }
    }

    fetchUserData()
  }, [supabase])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E8F3F1] via-[#F0F7F5] to-[#F8FAF9] p-8">
      <DecorativeStars />
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-[#006D77] animate-fade-in">Welcome to JobTrackr</h1>
        <div className="rounded-lg bg-white p-8 shadow-lg animate-slide-up">
          <h2 className="mb-6 text-2xl font-semibold text-[#006D77]">Let&apos;s set up your profile</h2>

          <Tabs defaultValue="automatic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="automatic">Automatic Setup</TabsTrigger>
              <TabsTrigger value="manual">Manual Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="automatic">
              <AutomaticProfile
                onResumeData={handleResumeData}
                uploadStatus={uploadStatus}
                setUploadStatus={setUploadStatus}
              />
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="flex flex-col space-y-4 mt-4">
                  <Input
                    placeholder="Name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    required
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    required
                  />
                  <div className="flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={completeLater}
                      disabled={!userData.name || !userData.email}
                    >
                      Complete Later
                    </Button>
                    <Button onClick={() => handleGenerate()}>
                      Complete Profile
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Professional Summary"
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                />
              </div>

              {/* Work Experience */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Work Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addWorkExperience}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>
                {userData.experiences.map((exp, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => removeArrayField("experiences", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) =>
                        updateArrayField("experiences", index, { ...exp, title: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) =>
                        updateArrayField("experiences", index, { ...exp, company: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateArrayField("experiences", index, { ...exp, startDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateArrayField("experiences", index, { ...exp, endDate: e.target.value })
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={exp.description}
                      onChange={(e) =>
                        updateArrayField("experiences", index, { ...exp, description: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Skills</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField("skills", {
                      name: "",
                      proficiency: "intermediate"
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                </div>
                {userData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Skill"
                      value={skill.name}
                      onChange={(e) => updateArrayField("skills", index, { ...skill, name: e.target.value })}
                      className="flex-1"
                    />
                    <Select
                      value={skill.proficiency}
                      onValueChange={(value: "beginner" | "intermediate" | "advanced") =>
                        updateArrayField("skills", index, { ...skill, proficiency: value })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select proficiency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayField("skills", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Projects</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField("projects", {
                      name: "",
                      description: "",
                      githubUrl: "",
                      liveUrl: ""
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Project
                  </Button>
                </div>
                {userData.projects.map((project, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => removeArrayField("projects", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) =>
                        handleProjectChange(index, "name", e.target.value)
                      }
                    />
                    <Textarea
                      placeholder="Project Description"
                      value={project.description}
                      onChange={(e) =>
                        handleProjectChange(index, "description", e.target.value)
                      }
                    />
                    <Input
                      placeholder="GitHub URL"
                      type="url"
                      value={project.githubUrl}
                      onChange={(e) =>
                        handleProjectChange(index, "githubUrl", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Live Demo URL"
                      type="url"
                      value={project.liveUrl}
                      onChange={(e) =>
                        handleProjectChange(index, "liveUrl", e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Education</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField("education", {
                      school: "",
                      degree: "",
                      field: "",
                      startDate: "",
                      endDate: "",
                      grade: "",
                      description: ""
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Education
                  </Button>
                </div>
                {userData.education.map((edu, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => removeArrayField("education", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Institution Name"
                      value={edu.school}
                      onChange={(e) =>
                        updateArrayField("education", index, { ...edu, school: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) =>
                        updateArrayField("education", index, { ...edu, degree: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) =>
                        updateArrayField("education", index, { ...edu, field: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Start Date"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateArrayField("education", index, { ...edu, startDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        placeholder="End Date"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateArrayField("education", index, { ...edu, endDate: e.target.value })
                        }
                      />
                    </div>
                    <Input
                      placeholder="Grade/GPA"
                      value={edu.grade}
                      onChange={(e) =>
                        updateArrayField("education", index, { ...edu, grade: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Description (e.g., thesis details, achievements)"
                      value={edu.description}
                      onChange={(e) =>
                        updateArrayField("education", index, { ...edu, description: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Volunteer Experience */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Volunteer Experience</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      addArrayField("volunteer", {
                        organization: "",
                        role: "",
                        startDate: "",
                        endDate: "",
                        description: ""
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Volunteer Experience
                  </Button>
                </div>
                {userData.volunteer.map((vol, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => removeArrayField("volunteer", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Organization"
                      value={vol.organization}
                      onChange={(e) =>
                        updateArrayField("volunteer", index, {
                          ...vol,
                          organization: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Role"
                      value={vol.role}
                      onChange={(e) =>
                        updateArrayField("volunteer", index, { ...vol, role: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Start Date"
                        value={vol.startDate}
                        onChange={(e) =>
                          updateArrayField("volunteer", index, { ...vol, startDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        placeholder="End Date"
                        value={vol.endDate}
                        onChange={(e) =>
                          updateArrayField("volunteer", index, { ...vol, endDate: e.target.value })
                        }
                      />
                    </div>
                    <Textarea
                      placeholder="Description"
                      value={vol.description}
                      onChange={(e) =>
                        updateArrayField("volunteer", index, { ...vol, description: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Certifications</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField("certifications", {
                      name: "",
                      issuer: "",
                      issueDate: "",
                      expiryDate: "",
                      certificationId: "",
                      certificationUrl: ""
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Certification
                  </Button>
                </div>
                {userData.certifications.map((cert, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => removeArrayField("certifications", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Certification Name"
                      value={cert.name}
                      onChange={(e) =>
                        updateArrayField("certifications", index, { ...cert, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Issuing Organization"
                      value={cert.issuer}
                      onChange={(e) =>
                        updateArrayField("certifications", index, { ...cert, issuer: e.target.value })
                      }
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        placeholder="Issue Date"
                        value={cert.issueDate}
                        onChange={(e) =>
                          updateArrayField("certifications", index, { ...cert, issueDate: e.target.value })
                        }
                      />
                      <Input
                        type="date"
                        placeholder="Expiry Date (if applicable)"
                        value={cert.expiryDate}
                        onChange={(e) =>
                          updateArrayField("certifications", index, { ...cert, expiryDate: e.target.value })
                        }
                      />
                    </div>
                    <Input
                      placeholder="Certification ID"
                      value={cert.certificationId}
                      onChange={(e) =>
                        updateArrayField("certifications", index, { ...cert, certificationId: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Certification URL"
                      type="url"
                      value={cert.certificationUrl}
                      onChange={(e) =>
                        updateArrayField("certifications", index, { ...cert, certificationUrl: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Languages</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayField("languages", "")}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Language
                  </Button>
                </div>
                {userData.languages.map((language, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Language"
                      value={language}
                      onChange={(e) => updateArrayField("languages", index, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayField("languages", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button
              onClick={handleGenerate}
              className="w-full bg-[#006D77] hover:bg-[#005a66] transition-colors duration-300"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating Profile...
                </span>
              ) : (
                "Create Profile"
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="mt-4">
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}