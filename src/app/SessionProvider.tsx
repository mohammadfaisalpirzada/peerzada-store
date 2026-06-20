'use client'

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import { type ReactNode } from "react"

export default function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={false}>
      {children}
    </NextAuthSessionProvider>
  )
}
