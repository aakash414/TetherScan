"use client"

import Link from "next/link"
import { UserAccountNav } from "@/components/user-account-nav"
import { useAuth } from '@/contexts/auth-context'

interface NavItemProps {
  href: string
  children: React.ReactNode
}

export function MainNav() {
  const { user } = useAuth()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <div className="mr-4">
        <NavItem href="/admin">Admin</NavItem>
      </div>
      <UserAccountNav user={user} />
    </nav>
  )
}

function NavItem({ href, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className="text-sm font-medium transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}
