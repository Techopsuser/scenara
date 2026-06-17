'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface AuthUser {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
}

/**
 * Tracks the current authenticated user. Uses TanStack Query to cache
 * the /api/auth/me response.
 */
export function useAuth() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const { user } = await api.me()
      return user as AuthUser | null
    },
  })

  return {
    user: data ?? null,
    isLoading,
    isAuthenticated: !!data,
    refetch,
  }
}
