"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Job, JobFormData, JobStatus, SalaryFrequency, jobStatusEnum, salaryFrequencyEnum } from "@/lib/types"

interface AddJobDialogProps {
    onAddJob: (job: Job) => void
}

export function AddJobDialog({ onAddJob }: AddJobDialogProps) {
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [inputMethod, setInputMethod] = useState<"manual" | "url">("manual")
    const [formData, setFormData] = useState<JobFormData>({
        company: "",
        location: "",
        remote: false,
        role: "",
        status: "wishlist",
        expectedSalaryMin: "",
        expectedSalaryMax: "",
        salaryFrequency: "yearly",
        jobUrl: "",
        jobDescription: "",
        notes: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const newJob: Job = {
                ...formData,
                id: crypto.randomUUID()
            }
            onAddJob(newJob)
            setOpen(false)
            setFormData({
                company: "",
                location: "",
                remote: false,
                role: "",
                status: "wishlist",
                expectedSalaryMin: "",
                expectedSalaryMax: "",
                salaryFrequency: "yearly",
                jobUrl: "",
                jobDescription: "",
                notes: "",
            })
            toast({
                title: "Success",
                description: "Job added successfully",
            })
        } catch (error) {
            console.error('Error submitting form:', error)
            toast({
                title: "Error",
                description: "Failed to add job",
                variant: "destructive",
            })
        }
    }

    const handleUrlScrape = async () => {
        try {
            // Implement URL scraping logic here
            console.log("Scraping URL:", formData.jobUrl)
            toast({
                title: "Info",
                description: "URL scraping not implemented yet",
            })
        } catch (error) {
            console.error('Error scraping URL:', error)
            toast({
                title: "Error",
                description: "Failed to scrape URL",
                variant: "destructive",
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="bg-[#006D77] hover:bg-[#006D77]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Job
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Job</DialogTitle>
                    <DialogDescription>
                        Add a new job to your board. You can either enter the details manually or provide a job listing URL.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <RadioGroup defaultValue="manual" onValueChange={(value) => setInputMethod(value as "manual" | "url")} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="manual" id="manual" />
                            <Label htmlFor="manual">Manual Input</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="url" id="url" />
                            <Label htmlFor="url">Job URL</Label>
                        </div>
                    </RadioGroup>

                    {inputMethod === "url" && (
                        <div className="space-y-2">
                            <Label htmlFor="jobUrl">Job Listing URL</Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="jobUrl"
                                    name="jobUrl"
                                    value={formData.jobUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                />
                                <Button type="button" onClick={handleUrlScrape}>Scrape</Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="company">Company *</Label>
                        <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="remote">Remote</Label>
                            <div className="h-10 flex items-center">
                                <Switch
                                    id="remote"
                                    checked={formData.remote}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, remote: checked }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Input
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: JobStatus) => setFormData(prev => ({ ...prev, status: value }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(jobStatusEnum.enum).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Expected Salary Range</Label>
                        <div className="flex space-x-2">
                            <Input
                                id="expectedSalaryMin"
                                name="expectedSalaryMin"
                                value={formData.expectedSalaryMin}
                                onChange={handleInputChange}
                                placeholder="Min"
                                type="number"
                            />
                            <Input
                                id="expectedSalaryMax"
                                name="expectedSalaryMax"
                                value={formData.expectedSalaryMax}
                                onChange={handleInputChange}
                                placeholder="Max"
                                type="number"
                            />
                            <Select
                                value={formData.salaryFrequency}
                                onValueChange={(value: SalaryFrequency) => setFormData(prev => ({ ...prev, salaryFrequency: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(salaryFrequencyEnum.enum).map((frequency) => (
                                        <SelectItem key={frequency} value={frequency}>
                                            {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jobDescription">Job Description</Label>
                        <Textarea
                            id="jobDescription"
                            name="jobDescription"
                            value={formData.jobDescription}
                            onChange={handleInputChange}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={2}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="bg-[#006D77] hover:bg-[#006D77]/90">
                            Add Job
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
