import localFont from 'next/font/local'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
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

export const metadata = {
  title: 'Tether: Your AI Job Application Co-Pilot',
  description: 'Tether is an AI-powered job application tracker that helps you manage your job search, tailor your resume, and track your progress.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js" async />
      </head>
      <body className={`${acorn.variable} ${gt.variable} font-gt`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 overflow-auto p-8 pt-24">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

