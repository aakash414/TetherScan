import { createClient } from "@/lib/supabase/client"

export async function uploadResume(file: File, userId: string) {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(`public/${fileName}`, file)

  if (error) {
    throw error
  }

  const { data: { publicUrl } } = supabase.storage
    .from('resumes')
    .getPublicUrl(`public/${fileName}`)

  return publicUrl
}

export async function extractResumeText(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  // You would implement your own resume parsing service here
  // For now, we'll return an empty string
  return ''
}
