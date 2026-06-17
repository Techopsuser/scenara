import type {
  Difficulty,
  ScenarioDetail,
  ScenarioListItem,
  Technology,
} from '@/lib/types'

async function jsonFetch<T>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string })?.error ?? 'Request failed')
  }
  return data as T
}

export interface ListScenariosParams {
  q?: string
  tech?: string | null
  difficulty?: Difficulty | 'all'
  sort?: 'recent' | 'popular' | 'top'
  page?: number
  limit?: number
}

export const api = {
  async me() {
    return jsonFetch<{ user: { id: string; name: string | null; email: string; image: string | null; role: string } | null }>('/api/auth/me')
  },

  async register(input: { email: string; password: string; name?: string }) {
    return jsonFetch<{ ok: boolean; user: { id: string } }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(input),
      }
    )
  },

  async listTechnologies(category?: string) {
    const qs = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''
    return jsonFetch<{ technologies: Technology[] }>(`/api/technologies${qs}`)
  },

  async addTechnology(input: { name: string; category: string }) {
    return jsonFetch<{ technology: Technology }>(`/api/technologies`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async listScenarios(params: ListScenariosParams = {}) {
    const sp = new URLSearchParams()
    if (params.q) sp.set('q', params.q)
    if (params.tech) sp.set('tech', params.tech)
    if (params.difficulty && params.difficulty !== 'all')
      sp.set('difficulty', params.difficulty)
    if (params.sort) sp.set('sort', params.sort)
    if (params.page) sp.set('page', String(params.page))
    if (params.limit) sp.set('limit', String(params.limit))
    return jsonFetch<{
      scenarios: ScenarioListItem[]
      total: number
      page: number
      pageCount: number
    }>(`/api/scenarios?${sp.toString()}`)
  },

  async getScenario(id: string) {
    return jsonFetch<{ scenario: ScenarioDetail }>(`/api/scenarios/${id}`)
  },

  async createScenario(input: {
    title: string
    summary: string
    content: string
    difficulty: Difficulty
    technologyIds: string[]
  }) {
    return jsonFetch<{ scenario: ScenarioDetail }>(`/api/scenarios`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async submitSolution(input: {
    scenarioId: string
    content: string
    codeSnippet?: string
    language?: string
  }) {
    return jsonFetch<{ solution: unknown }>(
      `/api/scenarios/${input.scenarioId}/solutions`,
      {
        method: 'POST',
        body: JSON.stringify({
          content: input.content,
          codeSnippet: input.codeSnippet || undefined,
          language: input.language || undefined,
        }),
      }
    )
  },

  async vote(input: {
    targetType: 'scenario' | 'solution'
    targetId: string
    value: 1 | -1 | 0
  }) {
    return jsonFetch<{ value: number }>(`/api/vote`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },

  async acceptSolution(solutionId: string) {
    return jsonFetch<{ ok: boolean }>(`/api/solutions/${solutionId}/accept`, {
      method: 'POST',
    })
  },
}
