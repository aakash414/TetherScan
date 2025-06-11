"use client"

import { Job } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BriefcaseIcon, CheckCircle, Send, Award } from 'lucide-react'
import { useMemo } from "react"

interface StatsCardsProps {
  jobs: Job[];
}

const StatCard = ({ title, value, icon: Icon, subtext }: { title: string, value: string | number, icon: React.ElementType, subtext: string }) => (
  <div className="bg-[#ede7de]/60 border border-[#ede7de]/80 rounded-xl shadow-md p-6 flex flex-col justify-between transition-transform transform hover:scale-105">
    <div>
      <div className="flex justify-between items-start mb-4">
        <CardTitle className="text-sm font-medium text-[#006D77]/80">{title}</CardTitle>
        <Icon className="h-5 w-5 text-[#006D77]/60" />
      </div>
      <p className="text-3xl font-bold text-[#006D77]">{value}</p>
    </div>
    <p className="text-xs text-[#006D77]/70 mt-2">{subtext}</p>
  </div>
);


export function StatsCards({ jobs = [] }: StatsCardsProps) {
  const stats = useMemo(() => {
    const totalApplications = jobs.length;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const applicationsThisWeek = jobs.filter(job => job.created_at && new Date(job.created_at) > oneWeekAgo).length;

    const interviewingCount = jobs.filter(job => job.status === 'interviewing').length;
    const interviewRate = totalApplications > 0 ? Math.round((interviewingCount / totalApplications) * 100) : 0;

    const offeredCount = jobs.filter(job => job.status === 'offered').length;

    return {
      totalApplications,
      applicationsThisWeek,
      interviewRate,
      offeredCount
    }
  }, [jobs]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Applications" 
        value={stats.totalApplications} 
        icon={BriefcaseIcon}
        subtext="All jobs in your pipeline"
      />
      <StatCard 
        title="New This Week" 
        value={stats.applicationsThisWeek} 
        icon={Send}
        subtext="Applications added in the last 7 days"
      />
      <StatCard 
        title="Interview Rate" 
        value={`${stats.interviewRate}%`} 
        icon={CheckCircle}
        subtext="From application to interview"
      />
      <StatCard 
        title="Offers Received" 
        value={stats.offeredCount} 
        icon={Award}
        subtext="Congratulations on your offers!"
      />
    </div>
  )
}


