"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DecorativeStars } from "@/components/decorative-stars"
import { Briefcase, FileText, Target, GitMerge, BarChart, Bot, CheckCircle, ArrowRight } from "lucide-react"
import { FloatingShapes } from "@/components/floating-shapes"

const features = [
  {
    icon: <Briefcase className="w-8 h-8 text-[#006D77]" />,
    title: "Centralized Job Tracking",
    description: "Manage all your applications in one place with our intuitive Kanban board.",
  },
  {
    icon: <FileText className="w-8 h-8 text-[#006D77]" />,
    title: "AI-Powered Resume Builder",
    description: "Generate tailored resumes and cover letters that catch the eye of recruiters.",
  },
  {
    icon: <Target className="w-8 h-8 text-[#006D77]" />,
    title: "Job-to-Resume Matching",
    description: "Analyze job descriptions and get a match score to optimize your application.",
  },
  {
    icon: <GitMerge className="w-8 h-8 text-[#006D77]" />,
    title: "GitHub Project Sync",
    description: "Automatically sync and showcase your best projects from GitHub.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-[#006D77]" />,
    title: "Search Analytics",
    description: "Gain insights into your application trends and improve your strategy.",
  },
  {
    icon: <Bot className="w-8 h-8 text-[#006D77]" />,
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
]

export default function LandingPage() {
  return (
    <div className="w-full bg-[#ede7de] text-gray-800">
      <DecorativeStars />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.section
          id="hero"
          className="relative text-center py-24 md:py-32 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FloatingShapes />
          <div className="relative max-w-3xl mx-auto z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
              The Smartest Way to <br />
              <span className="text-[#006D77]">Land Your Next Tech Role</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              TetherScan streamlines your job search with AI-powered tools, from resume tailoring to interview prep. Stop juggling tabs and start landing offers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild size="lg" className="bg-[#006D77] hover:bg-[#005c66] h-auto py-3 px-8 text-base text-white">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild variant="outline" size="lg" className="h-auto py-3 px-8 text-base border-[#006D77] text-[#006D77] hover:bg-[#006D77]/10 hover:text-[#005c66]">
                  <Link href="#features">Explore Features</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">A Co-pilot for Your Career</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              Everything you need to navigate the job market and secure your dream role.
            </p>
          </div>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl flex flex-col items-start text-left shadow-lg border border-gray-200/50"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4 bg-[#006D77]/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          id="how-it-works"
          className="py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get Started in 4 Simple Steps</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              From profile import to landing the offer, we&apos;ve got you covered.
            </p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 w-16 h-16 rounded-full bg-[#ede7de] border-2 border-[#006D77] flex items-center justify-center text-[#006D77] font-bold text-2xl z-10">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 px-2">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section
          id="cta"
          className="py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 text-center max-w-4xl mx-auto shadow-lg border border-gray-200/50">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ready to Take Control?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of successful job seekers who use TetherScan to streamline their search and get hired faster.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild size="lg" className="bg-[#006D77] hover:bg-[#005c66] h-auto py-3 px-8 text-base text-white">
                <Link href="/signin">
                  Sign Up Now <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>


      </div>
    </div>
  )
}
