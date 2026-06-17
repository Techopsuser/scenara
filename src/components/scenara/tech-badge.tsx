'use client'

import { cn } from '@/lib/utils'
import type { Technology } from '@/lib/types'

export function TechBadge({
  tech,
  onClick,
  active,
  className,
  size = 'sm',
}: {
  tech: Pick<Technology, 'name' | 'slug' | 'category'>
  onClick?: () => void
  active?: boolean
  className?: string
  size?: 'sm' | 'md'
}) {
  const sizeCls =
    size === 'md'
      ? 'px-3 py-1 text-xs'
      : 'px-2 py-0.5 text-[11px]'

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex items-center rounded-full border font-medium transition-colors',
          sizeCls,
          active
            ? 'border-primary/60 bg-primary/15 text-primary'
            : 'border-border bg-secondary/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
          className
        )}
      >
        {tech.name}
      </button>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-secondary/50 font-medium text-muted-foreground',
        sizeCls,
        className
      )}
    >
      {tech.name}
    </span>
  )
}
