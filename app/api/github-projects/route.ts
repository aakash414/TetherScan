import { NextResponse } from 'next/server';
import { fetchAndProcessGitHubProjects } from './github-service';

export async function GET() {
  try {
    const projects = await fetchAndProcessGitHubProjects();
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error('Error in GET /api/github-projects:', error.message);
    // Determine status code based on the type of error if possible, otherwise default to 500
    const status = error.message.includes('not configured') || error.message.includes('Invalid response') ? 500 : (error.status || 500);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch GitHub projects' },
      { status }
    );
  }
}
