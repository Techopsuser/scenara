'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from '@/components/scenara/user-avatar'
import { DifficultyBadge } from '@/components/scenara/difficulty-badge'
import { TechBadge } from '@/components/scenara/tech-badge'
import { VoteButton } from '@/components/scenara/vote-button'
import { Markdown } from '@/components/scenara/markdown'
import {
  SolutionCard,
  SolutionSubmitCTA,
} from '@/components/scenara/solution-card'
import { SolutionComposer } from '@/components/scenara/solution-composer'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import { timeAgo, formatCount } from '@/lib/format'
import {
  ArrowLeft,
  Eye,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Flame,
} from 'lucide-react'

export function DetailView({ scenarioId }: { scenarioId: string }) {
  const goFeed = useAppStore((s) => s.goFeed)
  const setFilters = useAppStore((s) => s.setFilters)
  const { isAuthenticated } = useAuth()
  const [composerOpen, setComposerOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['scenario', scenarioId],
    queryFn: () => api.getScenario(scenarioId),
    enabled: !!scenarioId,
  })

  const scenario = data?.scenario

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Button variant="ghost" size="sm" onClick={goFeed} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Button>
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  if (error || !scenario) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Button variant="ghost" size="sm" onClick={goFeed} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Button>
        <Card className="p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'Scenario not found.'}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Button variant="ghost" size="sm" onClick={goFeed} className="mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Button>

      <article className="animate-fade-up">
        {/* header card */}
        <Card className="relative overflow-hidden border-border bg-card/50 p-6 backdrop-blur-sm">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <DifficultyBadge difficulty={scenario.difficulty} />
              {scenario.status === 'solved' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="h-3 w-3" />
                  Solved
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {timeAgo(scenario.createdAt)}
              </span>
            </div>

            <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              {scenario.title}
            </h1>
            <p className="mt-2 text-balance text-muted-foreground">
              {scenario.summary}
            </p>

            {/* author + actions row */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
              <div className="flex items-center gap-2.5">
                <UserAvatar
                  name={scenario.author.name}
                  image={scenario.author.image}
                  size={32}
                />
                <div className="text-xs">
                  <div className="font-medium text-foreground">
                    {scenario.author.name ?? scenario.author.email.split('@')[0]}
                  </div>
                  <div className="text-muted-foreground">
                    {scenario.isAuthor ? 'You posted this' : 'Scenario author'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {formatCount(scenario.views)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {formatCount(scenario.solutions.length)}
                </span>
                <VoteButton
                  targetType="scenario"
                  targetId={scenario.id}
                  value={scenario.myVote}
                  count={scenario.netVotes}
                  scenarioId={scenario.id}
                />
              </div>
            </div>

            {/* tech tags */}
            {scenario.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {scenario.technologies.map((t) => (
                  <TechBadge
                    key={t.id}
                    tech={t}
                    size="md"
                    onClick={() => {
                      setFilters({ techSlug: t.slug })
                      goFeed()
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* body content */}
        <div className="mt-5 rounded-xl border border-border/60 bg-card/30 p-5 backdrop-blur-sm sm:p-6">
          <Markdown>{scenario.content}</Markdown>
        </div>

        {/* solutions section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Lightbulb className="h-5 w-5 text-primary" />
              Solutions
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {scenario.solutions.length}
              </span>
            </h2>
            {isAuthenticated && !scenario.isAuthor && (
              <Button size="sm" onClick={() => setComposerOpen(true)}>
                <Flame className="h-4 w-4" />
                Add solution
              </Button>
            )}
          </div>

          {scenario.solutions.length === 0 ? (
            <SolutionSubmitCTA
              onCompose={() =>
                isAuthenticated
                  ? setComposerOpen(true)
                  : null
              }
              disabled={!isAuthenticated}
            />
          ) : (
            <div className="space-y-4">
              {scenario.solutions.map((sol) => (
                <SolutionCard
                  key={sol.id}
                  solution={sol}
                  scenarioId={scenario.id}
                  isAuthor={scenario.isAuthor}
                />
              ))}
            </div>
          )}
        </div>
      </article>

      <SolutionComposer
        open={composerOpen}
        onOpenChange={setComposerOpen}
        scenarioId={scenario.id}
        scenarioTitle={scenario.title}
      />
    </div>
  )
}
