import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/session'
import type { Attachment } from '@/lib/types'

export const dynamic = 'force-dynamic'

function parseAttachments(raw: string | null | undefined): Attachment[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (a) =>
        a &&
        (a.type === 'image' || a.type === 'file') &&
        typeof a.name === 'string' &&
        typeof a.data === 'string'
    ) as Attachment[]
  } catch {
    return []
  }
}

// GET /api/scenarios/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = await getCurrentUserId()

  // Increment views (fire and forget, non-blocking)
  db.scenario
    .update({ where: { id }, data: { views: { increment: 1 } } })
    .catch(() => {})

  const scenario = await db.scenario.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, email: true, image: true },
      },
      technologies: {
        include: {
          technology: {
            select: { id: true, name: true, slug: true, category: true },
          },
        },
      },
      solutions: {
        orderBy: [{ isAccepted: 'desc' }, { upvotes: 'desc' }, { createdAt: 'desc' }],
        include: {
          author: {
            select: { id: true, name: true, email: true, image: true },
          },
          votes: userId
            ? { where: { userId }, select: { id: true, value: true } }
            : false,
        },
      },
      votes: userId
        ? { where: { userId }, select: { id: true, value: true } }
        : false,
    },
  })

  if (!scenario) {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 })
  }

  const netVotes = scenario.votes.reduce((sum, v) => sum + v.value, 0)
  const solutions = scenario.solutions.map((sol) => ({
    id: sol.id,
    content: sol.content,
    codeSnippet: sol.codeSnippet,
    language: sol.language,
    isAccepted: sol.isAccepted,
    upvotes: sol.upvotes,
    createdAt: sol.createdAt,
    author: sol.author,
    myVote: sol.votes?.[0]?.value ?? 0,
  }))

  const attachments = parseAttachments(scenario.attachments)

  return NextResponse.json({
    scenario: {
      id: scenario.id,
      title: scenario.title,
      summary: scenario.summary,
      content: scenario.content,
      difficulty: scenario.difficulty,
      status: scenario.status,
      views: scenario.views,
      createdAt: scenario.createdAt,
      updatedAt: scenario.updatedAt,
      author: scenario.author,
      technologies: scenario.technologies.map((t) => t.technology),
      attachments,
      hasAttachments: attachments.length > 0,
      attachmentsCount: attachments.length,
      solutions,
      netVotes,
      myVote: scenario.votes?.[0]?.value ?? 0,
      isAuthor: userId === scenario.authorId,
    },
  })
}
