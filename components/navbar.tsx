"use client"

import { Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserAccountNav } from "@/components/user-account-nav"
import Link from "next/link"
import { useAuth } from '@/contexts/auth-context'

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:bg-gray-900/50">
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#006D77] dark:text-[#83C5BE]">Tether</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <Button variant="ghost" size="icon" className="text-[#006D77] dark:text-[#83C5BE]">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#006D77] dark:text-[#83C5BE]">
                <Settings className="h-5 w-5" />
              </Button>
            </>
          )}
          <ThemeToggle />
          <UserAccountNav user={user} />
        </div>
      </div>
    </header>
  )
}
