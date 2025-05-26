import { createClient } from '@supabase/supabase-js'

export interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string
  topics: string[]
}

export interface SyncResult {
  created: number
  updated: number
  errors: string[]
}

// Upsert GitHub projects for a user
export async function syncGitHubProjects({
  userId,
  githubProjects,
  supabaseUrl,
  supabaseKey
}: {
  userId: string
  githubProjects: GitHubRepo[]
  supabaseUrl: string
  supabaseKey: string
}): Promise<SyncResult> {
  const supabase = createClient(supabaseUrl, supabaseKey)
  let created = 0
  let updated = 0
  const errors: string[] = []

  for (const repo of githubProjects) {
    try {
      // Prepare upsert object matching the projects table
      const upsertObj = {
        user_id: userId,
        name: repo.name,
        description: repo.description,
        link: repo.homepage || repo.html_url, // prefer homepage, fallback to repo url
        // Only include fields that exist in the DB schema
      }

      // Upsert project
      const { error: upsertError, status } = await supabase
        .from('projects')
        .upsert([upsertObj], { onConflict: 'user_id,name' })

      if (upsertError) {
        errors.push(`Upsert failed for ${repo.html_url}: ${upsertError.message}`)
      } else {
        if (status === 201) {
          created++
        } else if (status === 200) {
          updated++
        }
      }
    } catch (err: any) {
      errors.push(`Error for ${repo.html_url}: ${err.message}`)
    }
  }

  // Refresh the materialized view so the projects field in user_master_profile is up-to-date
  try {
    // Import and call the refreshUserMasterProfile service
    const { refreshUserMasterProfile } = await import('./supabase/services/user-profile')
    await refreshUserMasterProfile()
  } catch (refreshErr: any) {
    errors.push(`Failed to refresh user_master_profile: ${refreshErr.message}`)
  }

  return { created, updated, errors }
}
