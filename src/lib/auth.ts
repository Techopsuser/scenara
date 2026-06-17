import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/password'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/', // we render auth in-app; keep this as a fallback
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const email = credentials.email.trim().toLowerCase()
        const user = await db.user.findUnique({
          where: { email },
        })

        if (!user || !user.passwordHash) {
          throw new Error('No account found with that email')
        }

        // Seed/demo sentinel accounts can't log in via credentials
        if (user.passwordHash === 'demo-no-login') {
          throw new Error('This account is not available for login')
        }

        const valid = await verifyPassword(credentials.password, user.passwordHash)
        if (!valid) {
          throw new Error('Incorrect password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          image: user.image ?? null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Extend the default session types to include user.id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
  }
}
