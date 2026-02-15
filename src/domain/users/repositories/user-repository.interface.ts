import type { User, UserProfile } from "../types/user"

export interface UserRepository {
  getCurrentUser(): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  getUserProfile(username: string): Promise<UserProfile | null>
  getFollowing(userId: string): Promise<User[]>
}
