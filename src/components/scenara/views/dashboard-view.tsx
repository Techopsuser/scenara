'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ScenarioCard } from '@/components/scenara/scenario-card'
import { AnimatedNumber } from '@/components/scenara/animated-number'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'
import { useLiveStats, useTopTechStacks } from '@/hooks/use-stats'
import { api } from '@/lib/api'
import { TECH_CATEGORIES } from '@/lib/types'
import { useAuth } from '@/hooks/use-auth'
import { formatCount } from '@/lib/format'
import {
  Flame,
  Plus,
  TrendingUp,
  Layers,
  Eye,
  Users,
  MessageSquare,
  CheckCircle2,
  Boxes,
  ArrowRight,
  Activity,
  Search,
  Cpu,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardView() {
  const { openTechStack, openComposer, openScenario } = useAppStore()
  const { isAuthenticated } = useAuth()
  const { data: stats, isLoading: statsLoading } = useLiveStats(isAuthenticated)
  const { data: topStacks, isLoading: stacksLoading } = useTopTechStacks(8)

  // Trending scenarios (most viewed)
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['scenarios', { sort: 'popular', limit: 6 }],
    queryFn: () => api.listScenarios({ sort: 'popular', limit: 6 }),
  })

  // Recent scenarios (for "latest" strip)
  const { data: recent } = useQuery({
    queryKey: ['scenarios', { sort: 'recent', limit: 4 }],
    queryFn: () => api.listScenarios({ sort: 'recent', limit: 4 }),
  })

  const trendingScenarios = trending?.scenarios ?? []
  const recentScenarios = recent?.scenarios ?? []

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      {/* ─── Live Dashboard hero ─── */}
      <section className="relative mb-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 via-card/50 to-background/30 p-6 backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade opacity-50" />

        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              LIVE DASHBOARD
            </div>
            <h1 className="text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Real-time pulse of the{' '}
              <span className="text-gradient-ember">engineering</span> community
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Live stats, trending scenarios, and the tech stacks engineers are
              grinding on right now.
            </p>
          </div>
          <Button onClick={openComposer} size="lg" className="shrink-0">
            <Plus className="h-4 w-4" />
            Post a scenario
          </Button>
        </div>

        {/* stat cards */}
        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            icon={Flame}
            label="Scenarios"
            value={stats?.scenarios}
            loading={statsLoading}
            accent
          />
          <StatCard
            icon={MessageSquare}
            label="Solutions"
            value={stats?.solutions}
            loading={statsLoading}
          />
          <StatCard
            icon={Boxes}
            label="Tech stacks"
            value={stats?.technologies}
            loading={statsLoading}
          />
          <StatCard
            icon={Users}
            label="Members"
            value={stats?.members}
            loading={statsLoading}
          />
          <StatCard
            icon={Eye}
            label="Total views"
            value={stats?.totalViews}
            loading={statsLoading}
          />
          <StatCard
            icon={CheckCircle2}
            label="Solved"
            value={stats?.solved}
            loading={statsLoading}
          />
        </div>
      </section>

      {/* ─── Most viewed tech stacks ─── */}
      <section className="mb-8">
        <SectionHeader
          icon={TrendingUp}
          title="Most viewed tech stacks"
          subtitle="The stacks engineers are hitting the hardest right now"
        />
        {stacksLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl border border-border/40" />
            ))}
          </div>
        ) : topStacks && topStacks.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {topStacks.map((stack, i) => (
              <button
                key={stack.id}
                onClick={() => openTechStack(stack.slug)}
                className="card-hover group relative overflow-hidden rounded-xl border border-border/60 bg-card/50 p-4 text-left backdrop-blur-sm hover:glow-ember-sm"
              >
                <div className="pointer-events-none absolute right-2 top-2 text-3xl font-bold text-primary/10 transition-colors group-hover:text-primary/20">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg border border-primary/30 bg-primary/10">
                  <Cpu className="h-4 w-4 text-primary" />
                </div>
                <div className="truncate text-sm font-semibold text-foreground">
                  {stack.name}
                </div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {stack.category}
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Flame className="h-3 w-3" />
                    {stack.scenariosCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatCount(stack.totalViews)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyRow message="No stack activity yet. Be the first to post!" />
        )}
      </section>

      {/* ─── Trending scenarios ─── */}
      <section className="mb-8">
        <SectionHeader
          icon={Activity}
          title="Trending scenarios"
          subtitle="What's hot — ranked by views"
          action={
            recentScenarios.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openScenario(trendingScenarios[0]?.id ?? '')}
                className="text-muted-foreground"
              >
                Explore
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : null
          }
        />
        {trendingLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl border border-border/40" />
            ))}
          </div>
        ) : trendingScenarios.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trendingScenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
          </div>
        ) : (
          <EmptyRow message="No scenarios yet. Post the first one!" />
        )}
      </section>

      {/* ─── Available tech stacks grid ─── */}
      <AvailableTechStacksSection />
    </div>
  )
}

function AvailableTechStacksSection() {
  const { openTechStack } = useAppStore()
  const [query, setQuery] = useState('')

  const { data } = useQuery({
    queryKey: ['technologies', 'all'],
    queryFn: () => api.listTechnologies(),
  })
  const allTechs = data?.technologies ?? []

  const filtered = useMemo(() => {
    if (!query) return allTechs
    const q = query.toLowerCase()
    return allTechs.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    )
  }, [allTechs, query])

  const grouped = TECH_CATEGORIES.map((cat) => ({
    category: cat,
    items: filtered.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <section className="mb-4">
      <SectionHeader
        icon={Layers}
        title="Available tech stacks"
        subtitle="120+ technologies. Click any stack to see its scenarios."
        action={
          <div className="relative w-40 sm:w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search stacks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 border-border bg-background/60 pl-8 text-xs"
            />
          </div>
        }
      />

      {grouped.length === 0 ? (
        <EmptyRow message={`No stacks match "${query}"`} />
      ) : (
        <div className="space-y-5">
          {grouped.map((g) => (
            <div key={g.category}>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary/70" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.category}
                </h3>
                <span className="text-[11px] text-muted-foreground/60">
                  {g.items.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openTechStack(t.slug)}
                    className="card-hover inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm hover:border-primary/40 hover:text-primary"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: number
  loading?: boolean
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-3 backdrop-blur-sm',
        accent
          ? 'border-primary/40 bg-primary/[0.07]'
          : 'border-border/60 bg-card/40'
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'grid h-7 w-7 place-items-center rounded-md',
            accent ? 'bg-primary/15' : 'bg-secondary/60'
          )}
        >
          <Icon
            className={cn(
              'h-3.5 w-3.5',
              accent ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
        {loading || value === undefined ? (
          <Skeleton className="h-7 w-12" />
        ) : (
          <AnimatedNumber value={value} />
        )}
      </div>
    </div>
  )
}

function EmptyRow({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/20 px-6 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
