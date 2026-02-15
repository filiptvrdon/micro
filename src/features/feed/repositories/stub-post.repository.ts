import type { Post } from "../types/post"
import type { PostRepository } from "./post-repository.interface"

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    userId: "u2",
    authorName: "Jane Smith",
    authorAvatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-02-15T10:00:00Z",
    tag: "Morning Run",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
    caption: "Found a new trail today. The air was crisp and the pace felt intentional. Focusing on the breath rather than the clock.",
    likesCount: 12,
    commentsCount: 3
  },
  {
    id: "2",
    userId: "u3",
    authorName: "Mike Heavy",
    authorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    createdAt: "2026-02-15T08:00:00Z",
    tag: "Heavy Lift",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    caption: "New PR on deadlifts today. 3 plates feel lighter when you don't overthink the setup. Consistency over everything.",
    likesCount: 24,
    commentsCount: 7
  },
  {
    id: "3",
    userId: "u1",
    authorName: "John Doe",
    authorAvatarUrl: "https://github.com/shadcn.png",
    createdAt: "2026-02-14T15:00:00Z",
    tag: "Beach Yoga",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    caption: "Sun, sand, and some mobility work. Essential for recovery.",
    likesCount: 18,
    commentsCount: 2
  }
]

export class StubPostRepository implements PostRepository {
  async getFeed(): Promise<Post[]> {
    return MOCK_POSTS
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return MOCK_POSTS.filter(post => post.userId === userId)
  }

  async getPostById(id: string): Promise<Post | null> {
    return MOCK_POSTS.find(post => post.id === id) || null
  }

  async createPost(post: Omit<Post, "id" | "createdAt" | "likesCount" | "commentsCount">): Promise<Post> {
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0
    }
    MOCK_POSTS.unshift(newPost)
    return newPost
  }
}
