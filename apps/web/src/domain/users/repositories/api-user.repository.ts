import type { UserProfile, User } from "../types/user.ts"
import type { UserRepository } from "./user-repository.interface.ts"

const API_URL = import.meta.env.VITE_API_URL || ""

export class ApiUserRepository implements UserRepository {
  private getAuthHeaders(): Record<string, string> {
    // 1. Try to get from DevAuthRepository if in DEV
    if (import.meta.env.DEV) {
      const isDevLoggedIn = localStorage.getItem("dev_logged_in") === "true";
      if (isDevLoggedIn) {
        return { "Authorization": "Bearer dev-token-secret" };
      }
    }

    // 2. Fallback to Hanko cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hanko="))
      ?.split("=")[1];

    return token ? { "Authorization": `Bearer ${token}` } : {};
  }

  async getCurrentUser(userId?: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/api/users/current?userId=${userId}`, {
      headers: this.getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch current user")
    return response.json()
  }

  async getUserById(id: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      headers: this.getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch user")
    return response.json()
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    const response = await fetch(`${API_URL}/api/users/${username}/profile`, {
      headers: this.getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch user profile")
    return response.json()
  }

  async getFollowing(userId: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/users/${userId}/following`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch following")
    return response.json()
  }

  async getFollowers(userId: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/users/${userId}/followers`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch followers")
    return response.json()
  }

  async updateCurrentUser(data: { username?: string; displayName?: string; bio?: string }): Promise<User> {
    const response = await fetch(`${API_URL}/api/users/current`, {
      method: "PUT",
      headers: { ...this.getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error("Failed to update user")
    return response.json()
  }

  async uploadCurrentUserAvatar(file: File): Promise<User> {
    const form = new FormData()
    form.append("avatar", file)
    const response = await fetch(`${API_URL}/api/users/current/avatar`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: form
    })
    if (!response.ok) throw new Error("Failed to upload avatar")
    return response.json()
  }

  async searchUsers(query: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/users/search?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to search users")
    return response.json()
  }

  async getUsers(limit?: number): Promise<User[]> {
    const url = limit ? `${API_URL}/api/users?limit=${limit}` : `${API_URL}/api/users`
    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch users")
    return response.json()
  }

  async getUsersByTag(tag: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/users/by-tag?tag=${encodeURIComponent(tag)}`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch users by tag")
    return response.json()
  }

  async followUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/users/${userId}/follow`, {
      method: "POST",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to follow user")
  }

  async unfollowUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/users/${userId}/unfollow`, {
      method: "POST",
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to unfollow user")
  }

  async isFollowing(userId: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/users/${userId}/is-following`, {
      headers: this.getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to check if following")
    const data = await response.json()
    return data.isFollowing
  }
}
