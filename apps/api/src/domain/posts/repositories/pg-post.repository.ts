import type { Post } from "../types/post"
import type { PostRepository } from "./post-repository.interface"
import { prisma } from "../../prisma/client.js"

export class PgPostRepository implements PostRepository {
  async getFeed(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return posts.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      authorName: post.author.displayName,
      authorAvatarUrl: post.author.avatarUrl || undefined,
      imageUrl: post.imageUrl,
      caption: post.caption,
      tag: post.tag,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    }))
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return posts.map((post: any) => ({
      id: post.id,
      userId: post.userId,
      authorName: post.author.displayName,
      authorAvatarUrl: post.author.avatarUrl || undefined,
      imageUrl: post.imageUrl,
      caption: post.caption,
      tag: post.tag,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    }))
  }

  async getPostById(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })

    if (!post) return null

    return {
      id: post.id,
      userId: post.userId,
      authorName: post.author.displayName,
      authorAvatarUrl: post.author.avatarUrl || undefined,
      imageUrl: post.imageUrl,
      caption: post.caption,
      tag: post.tag,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    }
  }

  async createPost(postData: Omit<Post, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        userId: postData.userId,
        imageUrl: postData.imageUrl,
        caption: postData.caption,
        tag: postData.tag,
      },
      include: {
        author: true,
      },
    })

    return {
      id: post.id,
      userId: post.userId,
      authorName: post.author.displayName,
      authorAvatarUrl: post.author.avatarUrl || undefined,
      imageUrl: post.imageUrl,
      caption: post.caption,
      tag: post.tag,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    }
  }
}
