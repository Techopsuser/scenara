import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/session'

export const dynamic = 'force-dynamic'

// POST /api/vote  { targetType: 'scenario'|'solution', targetId, value: 1|-1|0 }
export async function POST(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const targetType: string = body?.targetType
    const targetId: string = body?.targetId
    const requested: number = Number(body?.value)

    if (!targetId || !['scenario', 'solution'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid vote target' },
        { status: 400 }
      )
    }

    const value = requested === 1 ? 1 : requested === -1 ? -1 : 0

    if (targetType === 'scenario') {
      const target = await db.scenario.findUnique({
        where: { id: targetId },
        select: { id: true },
      })
      if (!target) {
        return NextResponse.json(
          { error: 'Scenario not found' },
          { status: 404 }
        )
      }

      const existing = await db.vote.findUnique({
        where: { userId_scenarioId: { userId, scenarioId: targetId } },
      })

      if (value === 0 || (existing && existing.value === value)) {
        // toggle off
        if (existing) {
          await db.vote.delete({ where: { id: existing.id } })
        }
        return NextResponse.json({ value: 0 })
      }

      if (existing) {
        await db.vote.update({
          where: { id: existing.id },
          data: { value },
        })
      } else {
        await db.vote.create({
          data: { userId, scenarioId: targetId, value },
        })
      }
      return NextResponse.json({ value })
    }

    // solution target
    const target = await db.solution.findUnique({
      where: { id: targetId },
      select: { id: true },
    })
    if (!target) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 })
    }

    const existing = await db.vote.findUnique({
      where: { userId_solutionId: { userId, solutionId: targetId } },
    })

    if (value === 0 || (existing && existing.value === value)) {
      if (existing) {
        await db.vote.delete({ where: { id: existing.id } })
        await db.solution.update({
          where: { id: targetId },
          data: { upvotes: { decrement: existing.value } },
        })
      }
      return NextResponse.json({ value: 0 })
    }

    if (existing) {
      await db.vote.update({ where: { id: existing.id }, data: { value } })
      await db.solution.update({
        where: { id: targetId },
        data: { upvotes: { increment: value - existing.value } },
      })
    } else {
      await db.vote.create({
        data: { userId, solutionId: targetId, value },
      })
      await db.solution.update({
        where: { id: targetId },
        data: { upvotes: { increment: value } },
      })
    }
    return NextResponse.json({ value })
  } catch (err) {
    console.error('[vote POST] error', err)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}
