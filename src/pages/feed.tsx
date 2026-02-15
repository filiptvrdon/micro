import { PostCard } from "@/features/feed/post-card"
import { CaughtUp } from "@/features/feed/caught-up"
import { Separator } from "@/components/ui/separator"
import { usePostRepository } from "@/features/feed/context/post-context"
import { useEffect, useState } from "react"
import type { Post } from "@/features/feed/types/post"

export function FeedPage() {
  const postRepository = usePostRepository()
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
