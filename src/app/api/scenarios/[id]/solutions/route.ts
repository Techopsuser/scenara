import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/session'

export const dynamic = 'force-dynamic'

// POST /api/scenarios/[id]/solutions  { content, codeSnippet, language }
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const scenario = await db.scenario.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  })
  if (!scenario) {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const content = String(body?.content ?? '').trim()
    const codeSnippet = body?.codeSnippet ? String(body.codeSnippet).trim() : null
    const language = body?.language ? String(body.language).trim() : null

    if (!content || content.length < 20) {
      return NextResponse.json(
        { error: 'Solution must be at least 20 characters' },
        { status: 400 }
      )
    }

    const solution = await db.solution.create({
      data: {
        scenarioId: id,
        authorId: userId,
        content,
        codeSnippet,
        language,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    })

    return NextResponse.json({ solution }, { status: 201 })
  } catch (err) {
    console.error('[solutions POST] error', err)
    return NextResponse.json(
      { error: 'Failed to submit solution' },
      { status: 500 }
    )
  }
}
