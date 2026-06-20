import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

// Auth configuration
export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // Allow Google login even if port differs during dev
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        if (!email || !password) {
          return null
        }

        // Demo login - replace with actual DB verification
        if (email === "demo@peerzada.store" && password === "demo123") {
          return {
            id: "1",
            name: "Demo User",
            email: "demo@peerzada.store",
            role: "customer",
          }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Redirect here on OAuth errors (with ?error= param)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Store role if present
        if ((user as any).role) {
          ;(token as any).role = (user as any).role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = (token as any).role || "customer"
      }
      return session
    },
    async authorized({ auth, request: { nextUrl } }) {
      // Don't block API routes (needed for OAuth callbacks)
      if (nextUrl.pathname.startsWith("/api/")) {
        return true
      }
      // Don't block _next (static assets)
      if (nextUrl.pathname.startsWith("/_next/")) {
        return true
      }

      const isLoggedIn = !!auth?.user
      const isOnLoginPage = nextUrl.pathname.startsWith("/login")
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")

      // Protect admin/dashboard routes
      if (isOnAdmin || isOnDashboard) {
        if (!isLoggedIn) {
          const loginUrl = new URL("/login", nextUrl)
          loginUrl.searchParams.set("callbackUrl", nextUrl.href)
          return Response.redirect(loginUrl)
        }
        return true
      }

      // If logged in and on login page, redirect to home
      if (isLoggedIn && isOnLoginPage) {
        return Response.redirect(new URL("/", nextUrl))
      }

      return true
    },
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
}

// Export handlers, auth, signIn, signOut
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
