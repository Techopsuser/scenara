import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

/**
 * Returns the authenticated user's id, or null if not signed in.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

/**
 * Returns the full User record for the authenticated user, or null.
 */
export async function getCurrentUser() {
  const id = await getCurrentUserId()
  if (!id) return null
  return db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, image: true, role: true },
  })
}
