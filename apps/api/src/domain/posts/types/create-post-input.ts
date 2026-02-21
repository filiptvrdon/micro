export interface CreatePostMediaInput {
  url: string
  type: string
  order: number
}

export interface CreatePostInput {
  userId: string
  media: CreatePostMediaInput[]
  caption: string
  tag: string
}
