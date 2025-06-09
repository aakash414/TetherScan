'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface JobMatchIndicatorProps {
  job: {
    id: string;
    jobDescription?: string;
    [key: string]: any;
  };
  userId: string;
}

export function JobMatchIndicator({ job, userId }: JobMatchIndicatorProps) {
  const [matchData, setMatchData] = useState<{
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    isLoading: boolean;
  }>({
    score: 0,
    matchedSkills: [],
    missingSkills: [],
    isLoading: true
  });

  useEffect(() => {
    let isMounted = true;
    
    const fetchMatchData = async () => {
      if (!userId || !job?.jobDescription) return;
      
      setMatchData(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Create a complete job object with all required properties
        const jobForMatching = {
          ...job,
          jobDescription: job.jobDescription || '',  // Ensure jobDescription exists
          title: job.title || '',  // Ensure title exists
          company: job.company || '',  // Ensure company exists
          location: job.location || '', // Ensure location exists
          remote: false,       // Default value
          role: job.role || '',
          status: job.status || 'wishlist',  // Required by Job type
          expectedSalaryMin: '',// Default value
          expectedSalaryMax: '',// Default value
          salaryFrequency: 'yearly' as 'hourly' | 'monthly' | 'yearly', // Default value
          jobUrl: '',         // Default value
          notes: '',          // Default value
          id: job.id           // Must be last to avoid being overwritten
        };
        
        // We'll pass the cookie handling to the API route
        const response = await fetch('/api/job-match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            job: jobForMatching
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to calculate job match');
        }
        
        const result = await response.json();
        if (isMounted) {
          setMatchData({
            ...result,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error calculating job match:', error);
        if (isMounted) {
          setMatchData(prev => ({ ...prev, isLoading: false }));
        }
      }
    }

    if (userId && job) {
      fetchMatchData();
    }
  }, [userId, job]);

  // Determine color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  if (matchData.isLoading) {
    return <Badge variant="outline" className="animate-pulse">Calculating...</Badge>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={getScoreColor(matchData.score)}>
            {matchData.score}% Match
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2 p-1">
            <p className="font-semibold">Match Analysis</p>
            {matchData.matchedSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-green-600">Matched Skills:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {matchData.matchedSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-green-50 text-green-700 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {matchData.missingSkills.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-600">Skills to Develop:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {matchData.missingSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-amber-50 text-amber-700 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
