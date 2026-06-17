import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

// GET /api/auth/me -> { user } | { user: null }
export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json({ user })
}
