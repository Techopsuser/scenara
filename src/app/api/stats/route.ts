import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { PlatformStats } from '@/lib/types'

export const dynamic = 'force-dynamic'

// GET /api/stats — real-time platform counters for the live dashboard.
export async function GET() {
  const [
    scenarios,
    solved,
    solutions,
    technologies,
    members,
    viewsAgg,
  ] = await Promise.all([
    db.scenario.count(),
    db.scenario.count({ where: { status: 'solved' } }),
    db.solution.count(),
    db.technology.count(),
    db.user.count(),
    db.scenario.aggregate({ _sum: { views: true } }),
  ])

  const stats: PlatformStats = {
    scenarios,
    solutions,
    technologies,
    members,
    totalViews: viewsAgg._sum.views ?? 0,
    solved,
  }

  return NextResponse.json({ stats })
}
