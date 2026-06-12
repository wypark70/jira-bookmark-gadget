export interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  tags: string[]
  createdAt: number
}

export type ViewMode = 'card' | 'icon'
