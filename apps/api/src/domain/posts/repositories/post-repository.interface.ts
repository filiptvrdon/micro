import type { Post } from "../types/post"
import type { CreatePostInput } from "../types/create-post-input"

export interface PostRepository {
  getFeed(): Promise<Post[]>
  getPostsByUserId(userId: string): Promise<Post[]>
  getPostById(id: string): Promise<Post | null>
  createPost(post: CreatePostInput): Promise<Post>
}
