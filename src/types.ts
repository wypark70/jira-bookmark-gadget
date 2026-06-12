export interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  createdAt: number
  lastVisitedAt?: number
}

export type ViewMode = 'card' | 'icon' | 'graph' | 'timeline' | 'visual'
