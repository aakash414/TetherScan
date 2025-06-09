'use client';

import { JobMatchIndicator } from './job-match-indicator';

export function JobMatchIndicatorWrapper({ job, userId }: { job: any; userId: string }) {
  return <JobMatchIndicator job={job} userId={userId} />;
}
