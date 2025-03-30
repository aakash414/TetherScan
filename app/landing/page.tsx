"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DecorativeStars } from "@/components/decorative-stars"
import { BriefcaseIcon, BarChart2, FileText, FolderGit2, CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E8F3F1] via-[#F0F7F5] to-[#F8FAF9]">
      <DecorativeStars />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#006D77] leading-tight animate-fade-in">
              Organize Your Job Search, <br />
              <span className="text-[#E29578]">Land Your Dream Role</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-fade-in delay-100">
              Track applications, customize resumes, and get insights to improve your chances of landing the perfect
              job.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in delay-200">
              <Button className="bg-[#006D77] hover:bg-[#005a66] text-white px-8 py-6 text-lg h-auto"
              onClick={()=>{
                location.href="/signin"
              }}>
                Get Started Free
              </Button>
              <Button variant="outline" className="border-[#006D77] text-[#006D77] px-8 py-6 text-lg h-auto">
                See How It Works
              </Button>
            </div>
          </div>
          {/* <div className="relative mx-auto max-w-5xl rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="JobTrackr Dashboard Preview"
              className="w-full h-auto"
              width={1200}
              height={600}
            />
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
              <p className="text-white text-lg font-medium">Powerful dashboard to manage your entire job search</p>
            </div>
          </div> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006D77] mb-4">
              Everything You Need For Your Job Search
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              JobTrackr combines all the tools you need in one place to streamline your job hunting process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-6">
                <BriefcaseIcon className="w-7 h-7 text-[#006D77]" />
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Job Application Tracking</h3>
              <p className="text-gray-600 mb-4">
                Organize applications with our Kanban board. Move jobs from wishlist to applied, interviewing, and
                offers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Drag-and-drop interface</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Status tracking</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Application notes</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-[#006D77]" />
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Custom Resume Builder</h3>
              <p className="text-gray-600 mb-4">
                Create tailored resumes for each job application to maximize your match score and stand out.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>AI-powered customization</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Keyword optimization</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Multiple resume versions</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-6">
                <BarChart2 className="w-7 h-7 text-[#006D77]" />
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 mb-4">
                Get detailed analytics on your job search progress and identify areas for improvement.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Application trends</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Response rate tracking</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Interview success metrics</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-6">
                <FolderGit2 className="w-7 h-7 text-[#006D77]" />
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">GitHub Integration</h3>
              <p className="text-gray-600 mb-4">
                Showcase your projects directly from GitHub to impress potential employers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Automatic repository import</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Project portfolio</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Tech stack highlighting</span>
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#006D77]"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Resume-Job Matching</h3>
              <p className="text-gray-600 mb-4">
                Get a match score between your resume and job descriptions to optimize your applications.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Skills gap analysis</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Keyword suggestions</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Improvement recommendations</span>
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-14 h-14 bg-[#E8F3F1] rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#006D77]"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                  <path d="M10 9H8"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Job Description Analysis</h3>
              <p className="text-gray-600 mb-4">
                Automatically extract key requirements and skills from job listings to focus your application.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>URL scraping</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Required skills extraction</span>
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2" />
                  <span>Salary insights</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F8FAF9]">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006D77] mb-4">How JobTrackr Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and transform your job search experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E8F3F1] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-[#006D77]">1</span>
                <div className="absolute w-full h-full rounded-full border-2 border-[#006D77] border-dashed animate-spin-slow"></div>
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and upload your resume or LinkedIn profile to get started. We&apos;ll extract your skills and
                experience.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E8F3F1] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-[#006D77]">2</span>
                <div className="absolute w-full h-full rounded-full border-2 border-[#006D77] border-dashed animate-spin-slow"></div>
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Add Job Applications</h3>
              <p className="text-gray-600">
                Track jobs you&apos;re interested in by adding them manually or by pasting the job URL for automatic
                extraction.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-[#E8F3F1] rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <span className="text-3xl font-bold text-[#006D77]">3</span>
                <div className="absolute w-full h-full rounded-full border-2 border-[#006D77] border-dashed animate-spin-slow"></div>
              </div>
              <h3 className="text-xl font-bold text-[#006D77] mb-3">Optimize & Track</h3>
              <p className="text-gray-600">
                Get personalized resume suggestions, track your progress, and improve your application strategy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006D77] mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              JobTrackr has helped thousands of job seekers land their dream roles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E8F3F1] rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-[#006D77]">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Software Engineer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
              &quot;JobTrackr helped me organize my job search and customize my resume for each application. I landed a job
                at a top tech company within 6 weeks!&quot;
              </p>
              <div className="flex mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>

            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E8F3F1] rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-[#006D77]">Michael Chen</h4>
                  <p className="text-sm text-gray-500">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
              &quot;The analytics feature showed me which types of jobs I was getting the most responses from. This insight
                helped me refocus my search and land my dream role.&quot;
              </p>
              <div className="flex mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>

            <div className="bg-[#F8FAF9] p-8 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-[#E8F3F1] rounded-full mr-4"></div>
                <div>
                  <h4 className="font-bold text-[#006D77]">Jessica Williams</h4>
                  <p className="text-sm text-gray-500">UX Designer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
              &quot;The resume-job matching feature was a game-changer. It helped me tailor my portfolio and resume for
                each application, resulting in more interviews.&quot;
              </p>
              <div className="flex mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="#FFD700"
                  stroke="#FFD700"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Pricing Section */}
      {/* <section className="py-20 bg-[#F8FAF9]">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#006D77] mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the plan that fits your job search needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-2 border-[#E8F3F1]">
              <h3 className="text-2xl font-bold text-[#006D77] mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#006D77]">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Track up to 10 job applications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Basic resume analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">GitHub integration (public repos)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Job board with Kanban view</span>
                </li>
              </ul>
              <Button className="w-full bg-[#006D77] hover:bg-[#005a66]">Get Started</Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border-2 border-[#006D77] relative">
              <div className="absolute top-0 right-0 bg-[#006D77] text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-[#006D77] mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">For serious job seekers</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#006D77]">$9</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Unlimited job applications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Advanced resume-job matching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">AI-powered resume customization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Detailed analytics and insights</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Private GitHub repositories</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-[#006D77] mr-2 mt-0.5" />
                  <span className="text-gray-600">Email notifications for job updates</span>
                </li>
              </ul>
              <Button className="w-full bg-[#006D77] hover:bg-[#005a66]">Start Free Trial</Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-[#006D77] text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Job Search?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join thousands of job seekers who have streamlined their job search and landed their dream roles with
            JobTrackr.
          </p>
          <Button className="bg-white text-[#006D77] hover:bg-gray-100 px-8 py-6 text-lg h-auto">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-6 opacity-80">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-[#006D77]">JobTrackr</h2>
              <p className="text-gray-600 mt-2">Organize your job search, land your dream role</p>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <h4 className="font-semibold text-[#006D77] mb-3">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Testimonials
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#006D77] mb-3">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#006D77] mb-3">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2023 JobTrackr. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                Terms
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                Privacy
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#006D77]">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

