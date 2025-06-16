"use client"

import { Suspense } from "react"
import SignInComponent from "../../components/siginin-component"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Continue with Google</CardTitle>
          <CardDescription>Other sign-in options are coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <SignInComponent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
