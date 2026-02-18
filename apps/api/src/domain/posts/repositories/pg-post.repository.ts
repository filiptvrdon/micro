import type { Post } from "../types/post"
import type { PostRepository } from "./post-repository.interface"
import type { CreatePostInput } from "../types/create-post-input"
import { prisma } from "../../prisma/client.js"

export class PgPostRepository implements PostRepository {
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
      imageUrl: this.toProxiedUrl(post.imageUrl) as string,
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
      imageUrl: this.toProxiedUrl(post.imageUrl) as string,
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
      imageUrl: this.toProxiedUrl(post.imageUrl) as string,
      caption: post.caption,
      tag: post.tag,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    }
  }

  async createPost(postData: CreatePostInput): Promise<Post> {
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
      imageUrl: this.toProxiedUrl(post.imageUrl) as string,
      caption: post.caption,
      tag: post.tag,
      createdAt: post.createdAt.toISOString(),
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
    }
  }
}
