'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ScenarioCard } from '@/components/scenara/scenario-card'
import { TechFilter } from '@/components/scenara/tech-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import {
  Search,
  Flame,
  Plus,
  Loader2,
  PackageOpen,
  RefreshCw,
  TrendingUp,
  Clock,
  ArrowUpNarrowWide,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DIFFICULTY_META, type Difficulty } from '@/lib/types'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent', icon: Clock },
  { value: 'popular', label: 'Most viewed', icon: TrendingUp },
  { value: 'top', label: 'Longest standing', icon: ArrowUpNarrowWide },
] as const

export function FeedView() {
  const { filters, setFilters, goCompose } = useAppStore()
  const { q, techSlug, difficulty, sort } = filters

  const params = useMemo(
    () => ({ q, tech: techSlug, difficulty, sort, limit: 12 }),
    [q, techSlug, difficulty, sort]
  )

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['scenarios', params],
    queryFn: () => api.listScenarios(params),
  })

  const scenarios = data?.scenarios ?? []
  const total = data?.total ?? 0

  const activeFilterCount =
    (techSlug ? 1 : 0) + (difficulty !== 'all' ? 1 : 0) + (q ? 1 : 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Hero strip */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-background/40 p-6 backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-[90px]" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              <Flame className="h-3 w-3" />
              Live engineering scenarios
            </div>
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Browse real production problems{' '}
              <span className="text-gradient-ember">worth solving</span>
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {total > 0
                ? `${total} ${total === 1 ? 'scenario' : 'scenarios'} from the community.`
                : 'Be the first to share a scenario.'}
            </p>
          </div>
          <Button onClick={goCompose} size="lg" className="shrink-0">
            <Plus className="h-4 w-4" />
            Share a scenario
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-14 z-30 -mx-4 mb-5 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scenarios, symptoms, errors..."
              value={q}
              onChange={(e) => setFilters({ q: e.target.value })}
              className="h-9 border-border bg-background/60 pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TechFilter
              value={techSlug}
              onChange={(slug) => setFilters({ techSlug: slug })}
            />

            <Select
              value={difficulty}
              onValueChange={(v) => setFilters({ difficulty: v as Difficulty | 'all' })}
            >
              <SelectTrigger className="h-9 w-[140px] border-border bg-background/60 text-sm">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All levels</SelectItem>
                {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((d) => (
                  <SelectItem key={d} value={d}>
                    {DIFFICULTY_META[d].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(v) =>
                setFilters({ sort: v as (typeof SORT_OPTIONS)[number]['value'] })
              }
            >
              <SelectTrigger className="h-9 w-[150px] border-border bg-background/60 text-sm">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className="flex items-center gap-1.5">
                      <opt.icon className="h-3.5 w-3.5" />
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters({ q: '', techSlug: null, difficulty: 'all' })
                }
                className="h-9 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Active filter chip row */}
      {(techSlug || difficulty !== 'all') && (
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Filtered by:</span>
          {techSlug && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-primary">
              {techSlug.replace(/-/g, ' ')}
              <button
                onClick={() => setFilters({ techSlug: null })}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          )}
          {difficulty !== 'all' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-foreground">
              {DIFFICULTY_META[difficulty].label}
              <button
                onClick={() => setFilters({ difficulty: 'all' })}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl border border-border/40" />
          ))}
        </div>
      ) : scenarios.length === 0 ? (
        <EmptyState onCompose={goCompose} hasFilters={activeFilterCount > 0} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {scenarios.length} of {total}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8"
            >
              {isFetching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              Refresh
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function EmptyState({
  onCompose,
  hasFilters,
}: {
  onCompose: () => void
  hasFilters: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10">
          <PackageOpen className="h-6 w-6 text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        {hasFilters ? 'No scenarios match your filters' : 'No scenarios yet'}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasFilters
          ? 'Try adjusting your search or clearing filters to see more.'
          : 'Be the first engineer to share a real production scenario.'}
      </p>
      <Button onClick={onCompose} className="mt-4">
        <Plus className="h-4 w-4" />
        Share a scenario
      </Button>
    </div>
  )
}
