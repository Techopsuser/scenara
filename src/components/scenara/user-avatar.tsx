'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

export function UserAvatar({
  name,
  image,
  className,
  size = 32,
}: {
  name: string | null
  image?: string | null
  className?: string
  size?: number
}) {
  const initials = (name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Avatar
      className={cn('border border-border', className)}
      style={{ width: size, height: size }}
    >
      {image ? <AvatarImage src={image} alt={name ?? 'avatar'} /> : null}
      <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
        {initials || '?'}
      </AvatarFallback>
    </Avatar>
  )
}
