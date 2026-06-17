import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { TechStackStat } from '@/lib/types'

export const dynamic = 'force-dynamic'

// GET /api/stats/tech-stacks?limit=8
// Returns technologies ranked by popularity (scenario count, then total views).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get('limit') ?? '8', 10) || 8)
  )

  // Group scenarios by technology and aggregate views + counts.
  const rows = await db.scenarioTechnology.findMany({
    select: {
      technology: {
        select: { id: true, name: true, slug: true, category: true },
      },
      scenario: {
        select: { views: true },
      },
    },
  })

  const map = new Map<string, TechStackStat>()
  for (const r of rows) {
    const t = r.technology
    const cur = map.get(t.id) ?? {
      id: t.id,
      name: t.name,
      slug: t.slug,
      category: t.category,
      scenariosCount: 0,
      totalViews: 0,
      totalSolutions: 0,
    }
    cur.scenariosCount += 1
    cur.totalViews += r.scenario.views
    map.set(t.id, cur)
  }

  // Enrich with solution counts per technology
  const techsWithSolutions = await db.solution.findMany({
    select: {
      scenario: {
        select: {
          technologies: {
            select: { technologyId: true },
          },
        },
      },
    },
  })
  for (const s of techsWithSolutions) {
    for (const st of s.scenario.technologies) {
      const cur = map.get(st.technologyId)
      if (cur) cur.totalSolutions += 1
    }
  }

  const stacks = Array.from(map.values())
    .sort(
      (a, b) =>
        b.scenariosCount - a.scenariosCount || b.totalViews - a.totalViews
    )
    .slice(0, limit)

  return NextResponse.json({ stacks })
}
