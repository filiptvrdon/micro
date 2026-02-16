import type { Post } from "../types/post.ts"
import type { PostRepository } from "./post-repository.interface.ts"

const API_URL = ""

const getAuthHeaders = (): Record<string, string> => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hanko="))
    ?.split("=")[1];
  
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export class ApiPostRepository implements PostRepository {
  async getFeed(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/api/posts`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch feed")
    return response.json()
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const response = await fetch(`${API_URL}/api/posts?userId=${userId}`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch user posts")
    return response.json()
  }

  async getPostById(id: string): Promise<Post | null> {
    const response = await fetch(`${API_URL}/api/posts/${id}`, {
      headers: getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch post")
    return response.json()
  }

  async createPost(postData: Omit<Post, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<Post> {
    const response = await fetch(`${API_URL}/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(postData),
    })
    if (!response.ok) throw new Error("Failed to create post")
    return response.json()
  }
}
