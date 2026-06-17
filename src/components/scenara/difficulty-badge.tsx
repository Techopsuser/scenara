'use client'

import { cn } from '@/lib/utils'
import { DIFFICULTY_META, type Difficulty } from '@/lib/types'

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty
  className?: string
}) {
  const meta = DIFFICULTY_META[difficulty] ?? DIFFICULTY_META.intermediate
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        meta.className,
        className
      )}
    >
      {meta.label}
    </span>
  )
}
