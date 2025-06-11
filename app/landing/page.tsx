"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DecorativeStars } from "@/components/decorative-stars"
import { Briefcase, FileText, Target, GitMerge, BarChart, Bot, CheckCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Centralized Job Tracking",
    description: "Manage all your applications in one place with our intuitive Kanban board.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "AI-Powered Resume Builder",
    description: "Generate tailored resumes and cover letters that catch the eye of recruiters.",
  },
  {
    icon: <Target className="w-8 h-8 text-primary" />,
    title: "Job-to-Resume Matching",
    description: "Analyze job descriptions and get a match score to optimize your application.",
  },
  {
    icon: <GitMerge className="w-8 h-8 text-primary" />,
    title: "GitHub Project Sync",
    description: "Automatically sync and showcase your best projects from GitHub.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-primary" />,
    title: "Search Analytics",
    description: "Gain insights into your application trends and improve your strategy.",
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: "Interview Prep Assistant",
    description: "Practice common interview questions and get AI-driven feedback.",
  },
]

const steps = [
  {
    title: "Import Your Profile",
    description: "Connect your LinkedIn or upload your resume to build your base profile in seconds.",
  },
  {
    title: "Track Jobs",
    description: "Add jobs to your board from any site or our curated list to start tracking.",
  },
  {
    title: "Generate & Apply",
    description: "Create tailored resumes for each role and apply with confidence.",
  },
  {
    title: "Land the Interview",
    description: "Use our analytics and prep tools to get ready for your interviews and land the offer.",
  },
]

export default function LandingPage() {
  return (
    <div className="w-full bg-background text-foreground">
      <DecorativeStars />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section id="hero" className="relative text-center py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
              The Smartest Way to <br />
              <span className="text-primary">Land Your Next Tech Role</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              TetherScan streamlines your job search with AI-powered tools, from resume tailoring to interview prep. Stop juggling tabs and start landing offers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="h-auto py-3 px-8 text-base">
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-auto py-3 px-8 text-base">
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A Co-pilot for Your Career</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
              Everything you need to navigate the job market and secure your dream role.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-morphism p-8 rounded-2xl flex flex-col items-start text-left">
                <div className="mb-4 bg-primary/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get Started in 4 Simple Steps</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mt-4">
              From profile import to landing the offer, we&apos;ve got you covered.
            </p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
            <div className="grid md:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary font-bold text-2xl z-10">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground px-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-20">
          <div className="glass-morphism rounded-2xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to Take Control?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of successful job seekers who use TetherScan to streamline their search and get hired faster.
            </p>
            <Button asChild size="lg" className="h-auto py-3 px-8 text-base">
              <Link href="/signup">
                Sign Up Now <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} TetherScan. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
