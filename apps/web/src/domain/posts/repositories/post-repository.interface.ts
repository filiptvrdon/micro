import type { Post } from "../types/post.ts"

export interface PostRepository {
  getFeed(): Promise<Post[]>
  getPostsByUserId(userId: string): Promise<Post[]>
  getPostById(id: string): Promise<Post | null>
  createPost(post: Omit<Post, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<Post>
  createPostWithImages(files: File[], caption: string, tag: string): Promise<Post>
}
