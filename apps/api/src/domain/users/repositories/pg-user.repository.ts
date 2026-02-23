import type { User, UserProfile } from "../types/user"
import type { UserRepository } from "./user-repository.interface"
import { prisma } from "../../prisma/client.js"

export class PgUserRepository implements UserRepository {
  private toProxiedUrl(value?: string | null): string | undefined {
    if (!value) return undefined
    if (value.startsWith("/media/")) return value

    let key = value
    const endpoint = (process.env.S3_ENDPOINT || "").replace(/\/+$/, "")
    const bucket = process.env.S3_BUCKET || ""

    if (endpoint && bucket && value.includes(endpoint) && value.includes(bucket)) {
      const searchStr = `${bucket}/`
      const index = value.indexOf(searchStr)
      if (index !== -1) {
        key = decodeURI(value.slice(index + searchStr.length))
      }
    } else if (value.startsWith("http")) {
      return value
    }

    return `/media/${encodeURI(key)}`
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapUser(user: any): User {
    const apiURL = (process.env.API_URL || "http://localhost:3000").replace(/\/+$/, "")
    const proxiedAvatar = this.toProxiedUrl(user.avatarUrl)
    return {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: proxiedAvatar ? `${apiURL}${proxiedAvatar}` : undefined,
      bio: user.bio || undefined,
    }
  }

  async ensureUserExists(userId: string): Promise<void> {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        username: `user_${userId.slice(0, 8)}`,
        displayName: `User ${userId.slice(0, 4)}`,
      },
    })
  }

  async getCurrentUser(userId?: string): Promise<User | null> {
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) return null

    return this.mapUser(user)
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return this.mapUser(user)
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
      ...this.mapUser(user),
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

    return user.following.map((u) => this.mapUser(u))
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followedBy: true,
      },
    })

    if (!user) return []

    return user.followedBy.map((u) => this.mapUser(u))
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

    return this.mapUser(updated)
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

    return users.map((u) => this.mapUser(u))
  }

  async getUsers(limit?: number): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })

    return users.map((u) => this.mapUser(u))
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

    const users = posts.map((p) => p.author)
    return users.map((u) => this.mapUser(u))
  }
}
