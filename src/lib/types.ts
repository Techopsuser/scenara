export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type ScenarioStatus = 'open' | 'solved' | 'archived'

export interface UserSummary {
  id: string
  name: string | null
  email: string
  image: string | null
}

export interface Technology {
  id: string
  name: string
  slug: string
  category: string
  icon?: string | null
}

export interface ScenarioListItem {
  id: string
  title: string
  summary: string
  difficulty: Difficulty
  status: ScenarioStatus
  views: number
  createdAt: string
  updatedAt: string
  author: UserSummary
  technologies: Technology[]
  solutionsCount: number
  votesCount: number
  netVotes: number
  myVote: number
}

export interface Solution {
  id: string
  content: string
  codeSnippet: string | null
  language: string | null
  isAccepted: boolean
  upvotes: number
  createdAt: string
  author: UserSummary
  myVote: number
}

export interface ScenarioDetail extends Omit<ScenarioListItem, 'solutionsCount'> {
  content: string
  solutions: Solution[]
  isAuthor: boolean
}

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; className: string }
> = {
  beginner: {
    label: 'Beginner',
    className:
      'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-orange-500/10 text-orange-300 border-orange-500/25',
  },
  expert: {
    label: 'Expert',
    className: 'bg-red-500/15 text-red-300 border-red-500/30',
  },
}

export const TECH_CATEGORIES = [
  'Programming Languages',
  'Web Development',
  'Databases',
  'Cloud Computing',
  'DevOps',
  'Networking',
  'Cybersecurity',
  'Artificial Intelligence',
  'Data Engineering & Analytics',
  'Monitoring & Observability',
  'Mobile Development',
  'Emerging Technologies',
] as const
