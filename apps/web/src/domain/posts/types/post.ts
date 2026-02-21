export interface MediaItem {
  id: string
  url: string
  type: string
  order: number
}

export interface Post {
  id: string
  userId: string
  authorName: string
  authorUsername: string
  authorAvatarUrl?: string
  media: MediaItem[]
  imageUrl?: string
  caption: string
  tag: string
  createdAt: string
  likesCount: number
  commentsCount: number
}
