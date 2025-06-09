// app/api/github-projects/github-service.ts

export async function fetchAndProcessGitHubProjects() {
  const githubToken = process.env.GITHUB_TOKEN;
  const username = process.env.GITHUB_USERNAME;

  if (!githubToken || !username) {
    console.error('GitHub token or username not configured');
    throw new Error('GitHub token or username not configured');
  }

  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Authorization: `Bearer ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Failed to fetch GitHub projects from API:', errorData.message || response.status);
    throw new Error(errorData.message || `Failed to fetch GitHub projects with status: ${response.status}`);
  }

  const data = await response.json();
  
  if (!Array.isArray(data)) {
    console.error('Invalid response from GitHub API: data is not an array');
    throw new Error('Invalid response from GitHub API');
  }

  return data.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description || '',
    html_url: repo.html_url,
    homepage: repo.homepage || '',
    topics: repo.topics || [],
  }));
}
