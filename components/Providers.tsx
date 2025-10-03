"use client"

import { SessionProvider } from "next-auth/react"
import { OnboardingProvider } from "./OnboardingProvider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <OnboardingProvider>
        {children}
      </OnboardingProvider>
    </SessionProvider>
  )
}