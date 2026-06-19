import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUserId } from '@/lib/session'
import { slugify } from '@/lib/slug'

export const dynamic = 'force-dynamic'

// GET /api/technologies?category=...&q=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const q = searchParams.get('q')?.trim()

  const where: { category?: string; OR?: Array<{ name?: { contains: string }; slug?: { contains: string } }> } = {}
  if (category && category !== 'All') where.category = category
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { slug: { contains: q } },
    ]
  }

  const techs = await db.technology.findMany({
    where,
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
    },
  })

  return NextResponse.json({ technologies: techs })
}

// POST /api/technologies  { name, category }  -> adds a new tech (auth required)
export async function POST(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const name = String(body?.name ?? '').trim()
    const category = String(body?.category ?? '').trim()

    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      )
    }

    const slug = slugify(name)
    if (!slug) {
      return NextResponse.json(
        { error: 'Could not generate a valid slug from that name' },
        { status: 400 }
      )
    }
    // Case-insensitive duplicate check (SQLite is case-sensitive for @unique,
    // so we manually check first for a friendlier error).
    const existing = await db.technology.findFirst({
      where: {
        OR: [{ slug }, { name: { equals: name } }],
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'That technology already exists', technology: existing },
        { status: 409 }
      )
    }

    const tech = await db.technology.create({
      data: { name, slug, category, createdById: userId },
      select: { id: true, name: true, slug: true, category: true },
    })

    return NextResponse.json({ technology: tech }, { status: 201 })
  } catch (err) {
    console.error('[technologies POST] error', err)
    return NextResponse.json(
      { error: 'Failed to add technology' },
      { status: 500 }
    )
  }
}
