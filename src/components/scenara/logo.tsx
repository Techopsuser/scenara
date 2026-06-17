'use client'

import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  showWord = true,
  size = 'md',
}: {
  className?: string
  showWord?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const iconSize =
    size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-9 w-9' : 'h-7 w-7'
  const textSize =
    size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative grid place-items-center">
        <div className="absolute inset-0 rounded-lg bg-primary/30 blur-md" />
        <div className="relative grid place-items-center rounded-lg border border-primary/40 bg-gradient-to-br from-primary/25 to-transparent">
          <Flame className={cn(iconSize, 'text-primary')} strokeWidth={2.2} />
        </div>
      </div>
      {showWord && (
        <span
          className={cn(
            'font-semibold tracking-tight text-foreground',
            textSize
          )}
        >
          Scenar
          <span className="text-gradient-ember">a</span>
        </span>
      )}
    </div>
  )
}
