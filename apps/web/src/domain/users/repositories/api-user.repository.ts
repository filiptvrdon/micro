import type { UserProfile, User } from "../types/user.ts"
import type { UserRepository } from "./user-repository.interface.ts"

const API_URL = import.meta.env.VITE_API_URL || ""

const getAuthHeaders = (): Record<string, string> => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("hanko="))
    ?.split("=")[1];

  return token ? { "Authorization": `Bearer ${token}` } : {};
};

export class ApiUserRepository implements UserRepository {
  async getCurrentUser(userId?: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/api/users/current?userId=${userId}`, {
      headers: getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch current user")
    return response.json()
  }

  async getUserById(id: string): Promise<User | null> {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      headers: getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch user")
    return response.json()
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    const response = await fetch(`${API_URL}/api/users/${username}/profile`, {
      headers: getAuthHeaders()
    })
    if (response.status === 404) return null
    if (!response.ok) throw new Error("Failed to fetch user profile")
    return response.json()
  }

  async getFollowing(userId: string): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/users/${userId}/following`, {
      headers: getAuthHeaders()
    })
    if (!response.ok) throw new Error("Failed to fetch following")
    return response.json()
  }
}
