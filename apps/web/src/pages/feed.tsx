import { PostCard } from "@/features/feed/post-card.tsx"
import { CaughtUp } from "@/features/feed/caught-up.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { usePostRepository } from "@/providers/post-provider.tsx"
import { useEffect, useState } from "react"
import type { Post } from "@/domain/posts/types/post.ts"
import { CreatePostForm } from "@/features/create-post/create-post-form.tsx"
import { useAuth } from "@/providers/auth-provider.tsx"

export function FeedPage() {
  const postRepository = usePostRepository()
  const { session } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const feedPosts = await postRepository.getFeed()
        setPosts(feedPosts)
      } catch (error) {
        console.error("Failed to fetch feed:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [postRepository])

  if (loading) {
    return <div className="py-20 text-center text-muted-foreground">Loading feed...</div>
  }

  return (
    <div className="space-y-8">
      {session && (
        <div className="space-y-6">
          <CreatePostForm onCreated={(p) => setPosts((prev) => [p, ...prev])} />
          <Separator className="opacity-50" />
        </div>
      )}
      {posts.map((post) => (
        <div key={post.id} className="space-y-8">
          <PostCard post={post} />
          <Separator className="opacity-50" />
        </div>
      ))}
      <CaughtUp />
    </div>
  )
}
