import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/password'
import { isValidEmail } from '@/lib/slug'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body ?? {}

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(String(password))
    const user = await db.user.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
        passwordHash,
      },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json({ ok: true, user }, { status: 201 })
  } catch (err) {
    console.error('[register] error', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
