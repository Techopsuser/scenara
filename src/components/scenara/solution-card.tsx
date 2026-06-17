'use client'

import { useState } from 'react'
import { CheckCircle2, Code2, Clock, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/scenara/user-avatar'
import { VoteButton } from '@/components/scenara/vote-button'
import { Markdown } from '@/components/scenara/markdown'
import { timeAgo, formatCount } from '@/lib/format'
import type { Solution } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'

export function SolutionCard({
  solution,
  scenarioId,
  isAuthor,
}: {
  solution: Solution
  scenarioId: string
  isAuthor: boolean
}) {
  const [showCode, setShowCode] = useState(true)
  const { toast } = useToast()
  const qc = useQueryClient()
  const { isAuthenticated } = useAuth()

  async function handleAccept() {
    try {
      await api.acceptSolution(solution.id)
      qc.invalidateQueries({ queryKey: ['scenario', scenarioId] })
      toast({
        title: 'Solution accepted',
        description: 'This scenario is now marked as solved.',
      })
    } catch (err) {
      toast({
        title: 'Could not accept',
        description: err instanceof Error ? err.message : 'Try again later.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-border bg-card/50 p-5 backdrop-blur-sm',
        solution.isAccepted && 'border-primary/50 bg-primary/[0.04]'
      )}
    >
      {solution.isAccepted && (
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/30" />
      )}

      <div className="flex flex-col gap-4">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <UserAvatar
              name={solution.author.name}
              image={solution.author.image}
              size={36}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {solution.author.name ?? solution.author.email.split('@')[0]}
                </span>
                {solution.isAccepted && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <Award className="h-3 w-3" />
                    Accepted
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeAgo(solution.createdAt)}
              </div>
            </div>
          </div>

          <VoteButton
            targetType="solution"
            targetId={solution.id}
            value={solution.myVote}
            count={solution.upvotes}
            scenarioId={scenarioId}
          />
        </div>

        {/* content */}
        <Markdown>{solution.content}</Markdown>

        {/* code snippet */}
        {solution.codeSnippet && (
          <div className="overflow-hidden rounded-lg border border-border bg-[#1a1414]">
            <button
              onClick={() => setShowCode((v) => !v)}
              className="flex w-full items-center justify-between border-b border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="h-3.5 w-3.5" />
                {solution.language ? solution.language : 'Code snippet'}
              </span>
              <span className="text-[11px]">
                {showCode ? 'Hide' : 'Show'}
              </span>
            </button>
            {showCode && (
              <pre className="max-h-96 overflow-auto p-3 text-[13px] leading-relaxed">
                <code className="font-mono text-foreground/90">
                  {solution.codeSnippet}
                </code>
              </pre>
            )}
          </div>
        )}

        {/* accept button for scenario author */}
        {isAuthor && !solution.isAccepted && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAccept}
              className="border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept solution
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

export function SolutionSubmitCTA({
  onCompose,
  disabled,
}: {
  onCompose: () => void
  disabled?: boolean
}) {
  const { isAuthenticated } = useAuth()
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/30 p-4 text-center">
      <p className="text-sm text-muted-foreground">
        {isAuthenticated
          ? 'Know how to solve this? Share your approach.'
          : 'Sign in to submit a solution.'}
      </p>
      <Button onClick={onCompose} disabled={disabled} className="mt-2" size="sm">
        <Code2 className="h-4 w-4" />
        Submit a solution
      </Button>
    </div>
  )
}

export { formatCount }
