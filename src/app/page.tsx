'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useAppStore } from '@/lib/store'
import { SiteHeader } from '@/components/scenara/site-header'
import { SiteFooter } from '@/components/scenara/site-footer'
import { AuthView } from '@/components/scenara/views/auth-view'
import { FeedView } from '@/components/scenara/views/feed-view'
import { DetailView } from '@/components/scenara/views/detail-view'
import { ComposeView } from '@/components/scenara/views/compose-view'
import { Logo } from '@/components/scenara/logo'
import { Flame } from 'lucide-react'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const { view, selectedScenarioId, goFeed } = useAppStore()

  // If the user signs out while on a non-feed view, snap back to feed.
  useEffect(() => {
    if (!isAuthenticated && view !== 'feed') {
      goFeed()
    }
  }, [isAuthenticated, view, goFeed])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-ember rounded-xl bg-primary/30 blur-lg" />
          <div className="relative grid h-14 w-14 place-items-center rounded-xl border border-primary/40 bg-gradient-to-br from-primary/25 to-transparent">
            <Flame className="h-7 w-7 animate-pulse-ember text-primary" />
          </div>
        </div>
        <Logo showWord={false} />
        <p className="text-xs text-muted-foreground">Loading Scenara…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <AuthView />
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onShowAuth={() => {}} />
      <main className="flex-1">
        {view === 'feed' && <FeedView />}
        {view === 'detail' && selectedScenarioId && (
          <DetailView scenarioId={selectedScenarioId} />
        )}
        {view === 'compose' && <ComposeView />}
      </main>
      <SiteFooter />
    </div>
  )
}
