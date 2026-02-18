import type { User, UserProfile } from "../types/user.ts"

export interface UserRepository {
  getCurrentUser(userId?: string): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  getUserProfile(username: string): Promise<UserProfile | null>
  getFollowing(userId: string): Promise<User[]>
  getFollowers(userId: string): Promise<User[]>
  updateCurrentUser(data: { username?: string; displayName?: string; bio?: string }): Promise<User>
  uploadCurrentUserAvatar(file: File): Promise<User>
  searchUsers(query: string): Promise<User[]>
  getNewUsers(limit: number): Promise<User[]>
  getUsersByTag(tag: string): Promise<User[]>
  followUser(userId: string): Promise<void>
  unfollowUser(userId: string): Promise<void>
  isFollowing(userId: string): Promise<boolean>
}
