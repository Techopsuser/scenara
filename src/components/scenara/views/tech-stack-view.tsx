'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScenarioCard } from '@/components/scenara/scenario-card'
import { TechLogo } from '@/components/scenara/tech-logo'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import {
  DIFFICULTY_META,
  type Difficulty,
} from '@/lib/types'
import { formatCount } from '@/lib/format'
import {
  ArrowLeft,
  Search,
  Flame,
  Eye,
  MessageSquare,
  Cpu,
  PackageOpen,
  Plus,
  RefreshCw,
  TrendingUp,
  Clock,
} from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most recent', icon: Clock },
  { value: 'popular', label: 'Most viewed', icon: TrendingUp },
] as const

export function TechStackView({ techSlug }: { techSlug: string }) {
  const { goDashboard, openComposer, stackFilters, setStackFilters } =
    useAppStore()
  const { q, difficulty, sort } = stackFilters

  // Resolve tech info by fetching all and filtering (cheap, cached)
  const { data: allTechs } = useQuery({
    queryKey: ['technologies', 'all'],
    queryFn: () => api.listTechnologies(),
  })
  const tech = useMemo(
    () => allTechs?.technologies.find((t) => t.slug === techSlug) ?? null,
    [allTechs, techSlug]
  )

  const params = useMemo(
    () => ({ q, tech: techSlug, difficulty, sort, limit: 24 }),
    [q, techSlug, difficulty, sort]
  )

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['scenarios', params],
    queryFn: () => api.listScenarios(params),
  })

  const scenarios = data?.scenarios ?? []
  const total = data?.total ?? 0
  const totalViews = scenarios.reduce((s, x) => s + x.views, 0)
  const totalSolutions = scenarios.reduce((s, x) => s + x.solutionsCount, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <Button variant="ghost" size="sm" onClick={goDashboard} className="mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Button>

      {/* Stack header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-background/30 p-6 backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-[90px]" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-primary/40 bg-primary/10">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md" />
              <div className="relative">
                <TechLogo name={tech?.name ?? techSlug} size={40} container={false} fallbackIcon={Cpu} />
              </div>
            </div>
            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                Tech stack
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {tech?.name ?? techSlug.replace(/-/g, ' ')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {tech?.category ?? 'Technology'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StackStat
              icon={Flame}
              label="Scenarios"
              value={total}
            />
            <StackStat
              icon={Eye}
              label="Views"
              value={totalViews}
            />
            <StackStat
              icon={MessageSquare}
              label="Solutions"
              value={totalSolutions}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-14 z-30 -mx-4 mb-5 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scenarios in this stack..."
              value={q}
              onChange={(e) => setStackFilters({ q: e.target.value })}
              className="h-9 border-border bg-background/60 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={difficulty}
              onValueChange={(v) =>
                setStackFilters({ difficulty: v as Difficulty | 'all' })
              }
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
                setStackFilters({
                  sort: v as (typeof SORT_OPTIONS)[number]['value'],
                })
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
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-xl border border-border/40" />
          ))}
        </div>
      ) : scenarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No scenarios for {tech?.name ?? 'this stack'} yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Be the first to share a real-world scenario for this technology.
          </p>
          <Button onClick={openComposer} className="mt-4">
            <Plus className="h-4 w-4" />
            Post a scenario
          </Button>
        </div>
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
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function StackStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border/60 bg-card/40 px-4 py-2">
      <Icon className="mb-1 h-4 w-4 text-primary" />
      <span className="text-lg font-bold tabular-nums text-foreground">
        {formatCount(value)}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
