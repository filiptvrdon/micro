import type { User, UserProfile } from "../types/user"

export interface UserRepository {
  ensureUserExists(userId: string): Promise<void>
  getCurrentUser(userId?: string): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  getUserProfile(username: string): Promise<UserProfile | null>
  getFollowing(userId: string): Promise<User[]>
  updateUser(userId: string, data: { username?: string; displayName?: string; bio?: string; avatarUrl?: string }): Promise<User>
}
