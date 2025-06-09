import { NextResponse } from 'next/server'
import { syncGitHubProjects, GitHubRepo } from '@/lib/github-sync'
import { fetchAndProcessGitHubProjects } from '../github-service'

export async function POST(req: Request) {
  // Assume authentication/session is handled and user_id is available via header or session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  let userId = ''

  // For demo: get userId from body or header
  try {
    const { user_id } = await req.json()
    userId = user_id
  } catch {
    userId = req.headers.get('x-user-id') || ''
  }
  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 401 })
  }

  // Fetch projects from existing API
  let githubProjects: GitHubRepo[] = []
  try {
    githubProjects = await fetchAndProcessGitHubProjects()
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  // Upsert into DB
  try {
    const result = await syncGitHubProjects({
      userId,
      githubProjects,
      supabaseUrl,
      supabaseKey
    })
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
