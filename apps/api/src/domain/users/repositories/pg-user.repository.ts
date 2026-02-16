import type { User, UserProfile } from "../types/user"
import type { UserRepository } from "./user-repository.interface"
import { prisma } from "../../prisma/client"

export class PgUserRepository implements UserRepository {
  async getCurrentUser(userId?: string): Promise<User | null> {
    if (!userId) return null;

    let user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      // For new users from Hanko, we create a profile
      // In a real app, we might want to ask for a username/display name
      // For now, we use a placeholder based on the ID
      user = await prisma.user.create({
        data: {
          id: userId,
          username: `user_${userId.slice(0, 8)}`,
          displayName: `User ${userId.slice(0, 4)}`,
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

    return user.following.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl || undefined,
      bio: u.bio || undefined,
    }))
  }
}
