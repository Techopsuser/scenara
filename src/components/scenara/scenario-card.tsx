'use client'

import { MessageSquare, Eye, ArrowUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DifficultyBadge } from '@/components/scenara/difficulty-badge'
import { TechBadge } from '@/components/scenara/tech-badge'
import { UserAvatar } from '@/components/scenara/user-avatar'
import { useAppStore } from '@/lib/store'
import { timeAgo, formatCount } from '@/lib/format'
import type { ScenarioListItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export function ScenarioCard({ scenario }: { scenario: ScenarioListItem }) {
  const openScenario = useAppStore((s) => s.openScenario)
  const setFilters = useAppStore((s) => s.setFilters)

  return (
    <Card
      onClick={() => openScenario(scenario.id)}
      className={cn(
        'card-hover group relative cursor-pointer overflow-hidden border-border bg-card/60 p-5 backdrop-blur-sm',
        'hover:glow-ember-sm'
      )}
    >
      {/* status accent strip */}
      {scenario.status === 'solved' && (
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/60 to-primary/20" />
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={scenario.difficulty} />
            {scenario.status === 'solved' && (
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Solved
              </span>
            )}
            <span className="text-[11px] text-muted-foreground">
              {timeAgo(scenario.createdAt)}
            </span>
          </div>
        </div>

        <h3 className="text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg">
          {scenario.title}
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {scenario.summary}
        </p>

        {scenario.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {scenario.technologies.slice(0, 4).map((t) => (
              <TechBadge
                key={t.id}
                tech={t}
                onClick={(e) => {
                  e.stopPropagation()
                  setFilters({ techSlug: t.slug })
                }}
              />
            ))}
            {scenario.technologies.length > 4 && (
              <span className="inline-flex items-center px-1 text-[11px] text-muted-foreground">
                +{scenario.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-1 flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <UserAvatar
              name={scenario.author.name}
              image={scenario.author.image}
              size={24}
            />
            <span className="text-xs text-muted-foreground">
              {scenario.author.name ?? scenario.author.email.split('@')[0]}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3.5 w-3.5" />
              {formatCount(scenario.netVotes)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {formatCount(scenario.solutionsCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatCount(scenario.views)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
