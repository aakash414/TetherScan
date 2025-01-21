"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'react-toastify'

interface OnboardingFormProps {
  initialData: {
    name: string
    email: string
    github: string
    linkedin: string
    portfolio: string
    bio: string
  }
}

interface WorkExperience {
    title: string
    company: string
    completed: boolean
    }


export function OnboardingForm({ initialData }: OnboardingFormProps) {
  const [formData, setFormData] = useState(initialData)
  const router = useRouter()
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([])
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({ title: '', company: '', completed: false })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Submitting user data:", formData)
    // For now, we'll just redirect to the dashboard
    router.push("/")
  }

  const handleAddExperience = () => {
    if (!currentExperience.title || !currentExperience.company || !currentExperience.completed) {
      toast.error("Please complete the current work experience before adding a new one.")
      return
    }
    setWorkExperiences([...workExperiences, currentExperience])
    setCurrentExperience({ title: '', company: '', completed: false })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github">GitHub Profile</Label>
        <Input
          id="github"
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="https://github.com/username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input
          id="linkedin"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="https://www.linkedin.com/in/username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio Website</Label>
        <Input
          id="portfolio"
          name="portfolio"
          value={formData.portfolio}
          onChange={handleChange}
          placeholder="https://www.yourportfolio.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us a bit about yourself..."
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full bg-[#006D77] hover:bg-[#006D77]/90">
        Complete Profile
      </Button>
    </form>
  )
}

