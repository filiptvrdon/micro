export interface Post {
  id: string
  userId: string
  authorName: string
  authorUsername: string
  authorAvatarUrl?: string
  imageUrl: string
  caption: string
  tag: string
  createdAt: string
  likesCount: number
  commentsCount: number
}
