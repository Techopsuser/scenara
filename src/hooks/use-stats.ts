'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

/**
 * Live platform stats with auto-refresh for the dashboard.
 */
export function useLiveStats(enabled = true) {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.getStats()).stats,
    refetchInterval: enabled ? 15_000 : false,
    staleTime: 10_000,
  })
}

/**
 * Most-viewed / popular tech stacks for the dashboard.
 */
export function useTopTechStacks(limit = 8) {
  return useQuery({
    queryKey: ['stats', 'tech-stacks', limit],
    queryFn: async () => (await api.getTopTechStacks(limit)).stacks,
    staleTime: 30_000,
  })
}
