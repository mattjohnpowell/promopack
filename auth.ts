import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { signInSchema } from "./lib/zod"
import { prisma } from "./utils/db"
 
export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth",
    verifyRequest: "/auth/verify-request", // Page shown after magic link is sent
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true, // Required for Next-Auth v5 in production
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || "noreply@promopack.com",
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          console.log("[AUTH] Authorize called with credentials:", { email: credentials?.email })
          
          const { email, password } = await signInSchema.parseAsync(credentials)
          console.log("[AUTH] Credentials validated, looking up user:", email)

          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email },
          })

          console.log("[AUTH] User lookup result:", { 
            found: !!user, 
            hasPassword: !!user?.password,
            userId: user?.id 
          })

          if (!user || !user.password) {
            console.log("[AUTH] User not found or no password")
            return null
          }

          // Verify password
          const { verifyPassword } = await import("./utils/password")
          const isValid = verifyPassword(password, user.password)

          console.log("[AUTH] Password verification:", { isValid })

          if (!isValid) {
            console.log("[AUTH] Invalid password")
            return null
          }

          console.log("[AUTH] Login successful for user:", user.email)

          // Return user object for NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("[AUTH] Authorization error:", error)
          return null
        }
      },
    }),
  ],
})