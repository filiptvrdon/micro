import type { User, UserProfile } from "../types/user"
import type { UserRepository } from "./user-repository.interface"
import { prisma } from "../../prisma/client.js"

export class PgUserRepository implements UserRepository {
  private toProxiedUrl(value?: string | null): string | undefined {
    if (!value) return undefined
    let key = value
    if (value.startsWith("http")) {
      const endpoint = (process.env.S3_ENDPOINT || "").replace(/\/+$/, "")
      const bucket = process.env.S3_BUCKET || ""
      const prefix = endpoint && bucket ? `${endpoint}/${bucket}/` : ""
      if (prefix && value.startsWith(prefix)) {
        key = decodeURI(value.slice(prefix.length))
      } else {
        return value
      }
    }
    return `/media/${encodeURI(key)}`
  }

  async ensureUserExists(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      await prisma.user.create({
        data: {
          id: userId,
          username: `user_${userId.slice(0, 8)}`,
          displayName: `User ${userId.slice(0, 4)}`,
        },
      })
    }
  }

  async getCurrentUser(userId?: string): Promise<User | null> {
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return null

    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: this.toProxiedUrl(user.avatarUrl) || undefined,
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
      avatarUrl: this.toProxiedUrl(user.avatarUrl) || undefined,
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
      avatarUrl: this.toProxiedUrl(user.avatarUrl) || undefined,
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
      avatarUrl: this.toProxiedUrl(u.avatarUrl) || undefined,
      bio: u.bio || undefined,
    }))
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followedBy: true,
      },
    })

    if (!user) return []

    return user.followedBy.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: this.toProxiedUrl(u.avatarUrl) || undefined,
      bio: u.bio || undefined,
    }))
  }

  async updateUser(userId: string, data: { username?: string; displayName?: string; bio?: string; avatarUrl?: string }): Promise<User> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username ?? undefined,
        displayName: data.displayName ?? undefined,
        bio: data.bio ?? undefined,
        avatarUrl: data.avatarUrl ?? undefined,
      },
    })

    return {
      id: updated.id,
      username: updated.username,
      displayName: updated.displayName,
      avatarUrl: this.toProxiedUrl(updated.avatarUrl) || undefined,
      bio: updated.bio || undefined,
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { displayName: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
    })

    return users.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: this.toProxiedUrl(u.avatarUrl) || undefined,
      bio: u.bio || undefined,
    }))
  }

  async getNewUsers(limit: number): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return users.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: this.toProxiedUrl(u.avatarUrl) || undefined,
      bio: u.bio || undefined,
    }))
  }

  async followUser(followerId: string, followingId: string): Promise<void> {
    await prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          connect: { id: followingId },
        },
      },
    })
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await prisma.user.update({
      where: { id: followerId },
      data: {
        following: {
          disconnect: { id: followingId },
        },
      },
    })
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: {
        id: followerId,
        following: {
          some: { id: followingId },
        },
      },
    })
    return count > 0
  }

  async getUsersByTag(tag: string): Promise<User[]> {
    const posts = await prisma.post.findMany({
      where: { tag: { contains: tag, mode: "insensitive" } },
      distinct: ["userId"],
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    })

    const users = posts.map((p: any) => p.author)
    return users.map((u: any) => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: this.toProxiedUrl(u.avatarUrl) || undefined,
      bio: u.bio || undefined,
    }))
  }
}
