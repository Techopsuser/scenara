'use client'

import { create } from 'zustand'
import type { Difficulty } from '@/lib/types'

export type AppView = 'feed' | 'detail' | 'compose'

export interface FeedFilters {
  q: string
  techSlug: string | null // null = all
  difficulty: Difficulty | 'all'
  sort: 'recent' | 'popular' | 'top'
}

interface AppState {
  // navigation
  view: AppView
  selectedScenarioId: string | null

  // feed filters
  filters: FeedFilters

  // actions
  goFeed: (resetScroll?: boolean) => void
  openScenario: (id: string) => void
  goCompose: () => void
  setFilters: (patch: Partial<FeedFilters>) => void
  resetFilters: () => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'feed',
  selectedScenarioId: null,
  filters: {
    q: '',
    techSlug: null,
    difficulty: 'all',
    sort: 'recent',
  },

  goFeed: () => {
    set({ view: 'feed', selectedScenarioId: null })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
  openScenario: (id) => {
    set({ view: 'detail', selectedScenarioId: id })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
  goCompose: () => {
    set({ view: 'compose' })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
  setFilters: (patch) =>
    set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () =>
    set({
      filters: { q: '', techSlug: null, difficulty: 'all', sort: 'recent' },
    }),
}))
