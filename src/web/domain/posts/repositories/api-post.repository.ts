import type { Post } from "../types/post"
import type { PostRepository } from "./post-repository.interface"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export class ApiPostRepository implements PostRepository {
  async getFeed(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/api/posts`)
    if (!response.ok) throw new Error("Failed to fetch feed")
    return response.json()
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const response = await fetch(`${API_URL}/api/posts?userId=${userId}`)
    if (!response.ok) throw new Error("Failed to fetch user posts")
    return response.json()
  }

  async getPostById(id: string): Promise<Post | null> {
    const response = await fetch(`${API_URL}/api/posts/${id}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch post")
    return response.json()
  }

  async createPost(postData: Omit<Post, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<Post> {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
    if (!response.ok) throw new Error("Failed to create post")
    return response.json()
  }
}
