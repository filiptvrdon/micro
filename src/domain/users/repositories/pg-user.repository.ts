import type { User, UserProfile } from "../types/user"
import type { UserRepository } from "./user-repository.interface"
import { prisma } from "../../prisma/client"

export class PgUserRepository implements UserRepository {
  async getCurrentUser(): Promise<User | null> {
    // For now, we return a hardcoded user from the DB or create it if it doesn't exist
    // In a real app, this would come from session/auth
    let user = await prisma.user.findFirst()

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: "johndoe",
          displayName: "John Doe",
          bio: "Software Engineer",
        },
      })
    }

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl || undefined,
      bio: user.bio || undefined,
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl || undefined,
      bio: user.bio || undefined,
    }
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            posts: true,
            followedBy: true,
            following: true,
          },
        },
      },
    })

    if (!user) return null

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl || undefined,
      bio: user.bio || undefined,
      postCount: user._count.posts,
      followerCount: user._count.followedBy,
      followingCount: user._count.following,
    }
  }

  async getFollowing(userId: string): Promise<User[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        following: true,
      },
    })

    if (!user) return []

    return user.following.map((u) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl || undefined,
      bio: u.bio || undefined,
    }))
  }
}
