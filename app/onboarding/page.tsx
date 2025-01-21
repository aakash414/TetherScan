"use client"

import { useState } from "react"
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

interface WorkExperience {
  title: string;
  company: string;
  completed: boolean;
}

export default function OnboardingPage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    github: "",
    linkedin: "",
    portfolio: "",
    bio: "",
    experiences: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
    education: [{ school: "", degree: "", field: "", graduationDate: "" }],
    skills: [""],
    projects: [{ name: "", description: "", technologies: "", link: "" }],
    volunteer: [{ organization: "", role: "", duration: "", description: "" }],
    certifications: [{ name: "", issuer: "", date: "" }],
    languages: [""],
  })
  const [uploadStatus, setUploadStatus] = useState("idle")
  const [linkedInUrl, setLinkedInUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const router = useRouter()
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({ 
    title: '', 
    company: '', 
    completed: false 
  })

  const handleResumeData = (extractedData: Partial<typeof userData>) => {
    setUserData((prevData) => ({ ...prevData, ...extractedData }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      setGenerationProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    triggerConfetti()
    setIsGenerating(false)
    router.push("/")
  }

  const addArrayField = (field: keyof typeof userData, emptyValue: any) => {
    setUserData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), emptyValue],
    }))
  }

  const removeArrayField = (field: keyof typeof userData, index: number) => {
    setUserData((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }))
  }

  const updateArrayField = (field: keyof typeof userData, index: number, value: any) => {
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
                <Input
                  placeholder="Full Name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
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
                    onClick={() => addArrayField("skills", "")}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                </div>
                {userData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Skill"
                      value={skill}
                      onChange={(e) => updateArrayField("skills", index, e.target.value)}
                    />
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
                    onClick={() =>
                      addArrayField("projects", {
                        name: "",
                        description: "",
                        technologies: "",
                        link: "",
                      })
                    }
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
                        updateArrayField("projects", index, { ...project, name: e.target.value })
                      }
                    />
                    <Textarea
                      placeholder="Description"
                      value={project.description}
                      onChange={(e) =>
                        updateArrayField("projects", index, {
                          ...project,
                          description: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Technologies Used"
                      value={project.technologies}
                      onChange={(e) =>
                        updateArrayField("projects", index, {
                          ...project,
                          technologies: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Project Link"
                      value={project.link}
                      onChange={(e) =>
                        updateArrayField("projects", index, { ...project, link: e.target.value })
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
                    onClick={() =>
                      addArrayField("education", {
                        school: "",
                        degree: "",
                        field: "",
                        graduationDate: "",
                      })
                    }
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
                      placeholder="School"
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
                    <Input
                      type="date"
                      value={edu.graduationDate}
                      onChange={(e) =>
                        updateArrayField("education", index, {
                          ...edu,
                          graduationDate: e.target.value,
                        })
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
                        duration: "",
                        description: "",
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
                    <Input
                      placeholder="Duration"
                      value={vol.duration}
                      onChange={(e) =>
                        updateArrayField("volunteer", index, { ...vol, duration: e.target.value })
                      }
                    />
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