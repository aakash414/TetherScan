import { NextResponse } from 'next/server'

export async function GET() {
  const githubToken = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!githubToken || !username) {
    return NextResponse.json(
      { error: 'GitHub token or username not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch GitHub projects' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid response from GitHub API' },
        { status: 500 }
      )
    }

    const projects = data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || '',
      html_url: repo.html_url,
      homepage: repo.homepage || '',
      topics: repo.topics || [],
    }))

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching GitHub projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub projects' },
      { status: 500 }
    )
  }
}
