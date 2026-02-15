import type { User, UserProfile } from "../types/user"
import type { UserRepository } from "./user-repository.interface"

const MOCK_CURRENT_USER: User = {
  id: "u1",
  username: "johndoe",
  displayName: "John Doe",
  avatarUrl: "https://github.com/shadcn.png",
  bio: "Training for my first marathon. Focus on consistency."
}

const MOCK_USERS: User[] = [
  {
    id: "u2",
    username: "janesmith",
    displayName: "Jane Smith",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "u3",
    username: "mikeheavy",
    displayName: "Mike Heavy",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  }
]

export class StubUserRepository implements UserRepository {
  async getCurrentUser(): Promise<User | null> {
    return MOCK_CURRENT_USER
  }

  async getUserById(id: string): Promise<User | null> {
    if (id === MOCK_CURRENT_USER.id) return MOCK_CURRENT_USER
    return MOCK_USERS.find(u => u.id === id) || null
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    const user = username === MOCK_CURRENT_USER.username ? MOCK_CURRENT_USER : MOCK_USERS.find(u => u.username === username)
    if (!user) return null

    return {
      ...user,
      followerCount: 124,
      followingCount: 45,
      postCount: 12
    }
  }

  async getFollowing(userId: string): Promise<User[]> {
    // For stub purposes, John follows Jane and Mike
    if (userId === MOCK_CURRENT_USER.id) {
      return MOCK_USERS
    }
    return []
  }
}
