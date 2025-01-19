import { Bell, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="container flex h-full items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#006D77]">Tether</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#006D77]">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#006D77]">
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

