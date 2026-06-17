'use client'

import { ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'

export function VoteButton({
  targetType,
  targetId,
  value,
  count,
  scenarioId,
  className,
}: {
  targetType: 'scenario' | 'solution'
  targetId: string
  value: number // current user's vote: 1 | -1 | 0
  count: number
  scenarioId?: string
  className?: string
}) {
  const { isAuthenticated } = useAuth()
  const qc = useQueryClient()
  const { toast } = useToast()

  async function handleVote() {
    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'You need an account to vote.',
        variant: 'destructive',
      })
      return
    }
    try {
      await api.vote({
        targetType,
        targetId,
        value: value === 1 ? 0 : 1,
      })
      // Invalidate the relevant queries so counts refresh
      if (targetType === 'scenario') {
        qc.invalidateQueries({ queryKey: ['scenarios'] })
        if (scenarioId) qc.invalidateQueries({ queryKey: ['scenario', scenarioId] })
      } else {
        if (scenarioId) qc.invalidateQueries({ queryKey: ['scenario', scenarioId] })
      }
    } catch (err) {
      toast({
        title: 'Vote failed',
        description: err instanceof Error ? err.message : 'Try again later.',
        variant: 'destructive',
      })
    }
  }

  const active = value === 1
  return (
    <button
      type="button"
      onClick={handleVote}
      aria-pressed={active}
      className={cn(
        'group inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-all',
        active
          ? 'border-primary/60 bg-primary/15 text-primary'
          : 'border-border bg-secondary/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
        className
      )}
    >
      <ArrowBigUp
        className={cn(
          'h-4 w-4 transition-transform',
          active ? 'scale-110' : 'group-hover:translate-y-[-1px]'
        )}
        strokeWidth={2}
        fill={active ? 'currentColor' : 'none'}
      />
      <span>{Math.max(0, count)}</span>
    </button>
  )
}
