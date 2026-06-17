import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/session'

export const dynamic = 'force-dynamic'

const ALLOWED_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert']

// GET /api/scenarios?q=&tech=&difficulty=&sort=&page=&limit=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const tech = searchParams.get('tech') // slug
  const difficulty = searchParams.get('difficulty')
  const sort = searchParams.get('sort') ?? 'recent' // recent | popular | top
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10) || 12)
  )

  const userId = await getCurrentUserId()

  const where: {
    AND: Array<Record<string, unknown>>
  } = { AND: [] }

  if (q) {
    where.AND.push({
      OR: [{ title: { contains: q } }, { summary: { contains: q } }],
    })
  }

  if (difficulty && difficulty !== 'all' && ALLOWED_DIFFICULTIES.includes(difficulty)) {
    where.AND.push({ difficulty })
  }

  if (tech) {
    where.AND.push({
      technologies: {
        some: {
          technology: {
            OR: [{ slug: tech }, { name: tech }],
          },
        },
      },
    })
  }

  const orderBy: Record<string, 'asc' | 'desc'> =
    sort === 'popular'
      ? { views: 'desc' }
      : sort === 'top'
        ? { createdAt: 'asc' } // oldest active, could map to upvotes later
        : { createdAt: 'desc' }

  const [total, scenarios] = await Promise.all([
    db.scenario.count({ where }),
    db.scenario.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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
        _count: {
          select: { solutions: true, votes: true },
        },
        votes: userId
          ? {
              where: { userId },
              select: { id: true, value: true },
            }
          : false,
      },
    }),
  ])

  const items = scenarios.map((s) => {
    const netVotes = s.votes.reduce((sum, v) => sum + v.value, 0)
    return {
      id: s.id,
      title: s.title,
      summary: s.summary,
      difficulty: s.difficulty,
      status: s.status,
      views: s.views,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      author: s.author,
      technologies: s.technologies.map((t) => t.technology),
      solutionsCount: s._count.solutions,
      votesCount: s._count.votes,
      netVotes,
      myVote: s.votes?.[0]?.value ?? 0,
    }
  })

  return NextResponse.json({
    scenarios: items,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / limit)),
  })
}

// POST /api/scenarios  { title, summary, content, difficulty, technologyIds }
export async function POST(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const title = String(body?.title ?? '').trim()
    const summary = String(body?.summary ?? '').trim()
    const content = String(body?.content ?? '').trim()
    const difficulty = ALLOWED_DIFFICULTIES.includes(body?.difficulty)
      ? body.difficulty
      : 'intermediate'
    const technologyIds: string[] = Array.isArray(body?.technologyIds)
      ? body.technologyIds.filter((id: unknown) => typeof id === 'string')
      : []

    if (!title || title.length < 8) {
      return NextResponse.json(
        { error: 'Title must be at least 8 characters' },
        { status: 400 }
      )
    }
    if (!summary || summary.length < 20) {
      return NextResponse.json(
        { error: 'Summary must be at least 20 characters' },
        { status: 400 }
      )
    }
    if (!content || content.length < 30) {
      return NextResponse.json(
        { error: 'Scenario details must be at least 30 characters' },
        { status: 400 }
      )
    }
    if (technologyIds.length === 0) {
      return NextResponse.json(
        { error: 'Please tag at least one technology' },
        { status: 400 }
      )
    }

    // Validate tech ids exist
    const techs = await db.technology.findMany({
      where: { id: { in: technologyIds } },
      select: { id: true },
    })
    if (techs.length !== technologyIds.length) {
      return NextResponse.json(
        { error: 'One or more technologies are invalid' },
        { status: 400 }
      )
    }

    const scenario = await db.scenario.create({
      data: {
        title,
        summary,
        content,
        difficulty,
        authorId: userId,
        technologies: {
          create: technologyIds.map((id) => ({ technologyId: id })),
        },
      },
      include: {
        technologies: {
          include: {
            technology: {
              select: { id: true, name: true, slug: true, category: true },
            },
          },
        },
      },
    })

    return NextResponse.json({ scenario }, { status: 201 })
  } catch (err) {
    console.error('[scenarios POST] error', err)
    return NextResponse.json(
      { error: 'Failed to create scenario' },
      { status: 500 }
    )
  }
}
