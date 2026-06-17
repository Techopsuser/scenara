import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/session'

export const dynamic = 'force-dynamic'

// POST /api/solutions/[id]/accept
// Only the scenario author can accept a solution.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const solution = await db.solution.findUnique({
    where: { id },
    select: { id: true, scenarioId: true },
  })
  if (!solution) {
    return NextResponse.json({ error: 'Solution not found' }, { status: 404 })
  }

  const scenario = await db.scenario.findUnique({
    where: { id: solution.scenarioId },
    select: { id: true, authorId: true },
  })
  if (!scenario || scenario.authorId !== userId) {
    return NextResponse.json(
      { error: 'Only the scenario author can accept a solution' },
      { status: 403 }
    )
  }

  // Unset any previously accepted solution, then set this one + mark scenario solved
  await db.$transaction([
    db.solution.updateMany({
      where: { scenarioId: scenario.id, isAccepted: true },
      data: { isAccepted: false },
    }),
    db.solution.update({
      where: { id: solution.id },
      data: { isAccepted: true },
    }),
    db.scenario.update({
      where: { id: scenario.id },
      data: { status: 'solved' },
    }),
  ])

  return NextResponse.json({ ok: true, solutionId: solution.id })
}
