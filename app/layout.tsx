import localFont from 'next/font/local'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { createClient } from "@/lib/supabase/server"
import { AuthProvider } from '@/contexts/auth-context'

const acorn = localFont({
  src: [
    {
      path: '../public/fonts/acorn.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/acorn.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/acorn.woff',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-acorn'
})

const gt = localFont({
  src: [
    {
      path: '../public/fonts/gt.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/gt.woff',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-gt'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${acorn.variable} ${gt.variable} font-gt`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-gradient-to-br from-[#E8F3F1] via-[#F0F7F5] to-[#F8FAF9]">
              <Navbar />
              <div className="flex h-[calc(100vh-4rem)]">
                <Sidebar />
                <main className="flex-1 overflow-auto p-8">
                  {children}
                </main>
              </div>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

