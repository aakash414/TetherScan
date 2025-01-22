import { Icons } from '@/components/icons'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Icons.loaderCircle className="h-8 w-8 animate-spin" />
        <h2 className="text-lg font-semibold">Setting up your account...</h2>
        <p className="text-sm text-muted-foreground">You will be redirected automatically.</p>
      </div>
    </div>
  )
}
