'use client'

import { useState, type ComponentType } from 'react'
import { getTechLogoUrl } from '@/lib/tech-logos'
import { cn } from '@/lib/utils'

interface TechLogoProps {
  name: string
  size?: number
  className?: string
  /** render in a rounded container with subtle background */
  container?: boolean
  /** fallback icon component if no logo mapping exists */
  fallbackIcon?: ComponentType<{ className?: string }>
}

/**
 * Renders a technology's official logo from the Simple Icons CDN.
 * Falls back to a letter avatar (first letter of the name) if the logo
 * fails to load or no mapping exists.
 */
export function TechLogo({
  name,
  size = 24,
  className,
  container = true,
  fallbackIcon: Fallback,
}: TechLogoProps) {
  const [errored, setErrored] = useState(false)
  const url = getTechLogoUrl(name)
  const showImg = url && !errored
  const initial = name.trim().charAt(0).toUpperCase()

  const inner = showImg ? (
    <img
      src={url!}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="object-contain"
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  ) : Fallback ? (
    <Fallback className="text-primary" style={{ width: size, height: size }} />
  ) : (
    <span
      className="grid place-items-center font-bold text-primary"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {initial}
    </span>
  )

  if (!container) return <span className={cn('inline-flex', className)}>{inner}</span>

  return (
    <span
      className={cn(
        'inline-grid place-items-center rounded-lg border border-border/60 bg-secondary/40 p-1.5',
        className
      )}
      style={{ width: size + 12, height: size + 12 }}
    >
      {inner}
    </span>
  )
}
