'use client'

import { create } from 'zustand'
import type { Difficulty } from '@/lib/types'

export type AppView = 'dashboard' | 'techStack' | 'detail'

export interface StackFilters {
  q: string
  difficulty: Difficulty | 'all'
  sort: 'recent' | 'popular' | 'top'
}

interface AppState {
  // navigation
  view: AppView
  selectedScenarioId: string | null
  selectedTechSlug: string | null

  // tech stack page filters
  stackFilters: StackFilters

  // composer modal
  composerOpen: boolean

  // actions
  goDashboard: () => void
  openTechStack: (slug: string) => void
  openScenario: (id: string) => void
  openComposer: () => void
  closeComposer: () => void
  setStackFilters: (patch: Partial<StackFilters>) => void
}

export const useAppStore = create<AppState>((set) => ({
  view: 'dashboard',
  selectedScenarioId: null,
  selectedTechSlug: null,
  stackFilters: {
    q: '',
    difficulty: 'all',
    sort: 'recent',
  },
  composerOpen: false,

  goDashboard: () => {
    set({ view: 'dashboard', selectedScenarioId: null, selectedTechSlug: null })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
  openTechStack: (slug) => {
    set({ view: 'techStack', selectedTechSlug: slug, selectedScenarioId: null })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
  openScenario: (id) => {
    set({ view: 'detail', selectedScenarioId: id })
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  },
  openComposer: () => set({ composerOpen: true }),
  closeComposer: () => set({ composerOpen: false }),
  setStackFilters: (patch) =>
    set((s) => ({ stackFilters: { ...s.stackFilters, ...patch } })),
}))
