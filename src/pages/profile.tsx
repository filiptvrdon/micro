import { useEffect, useState } from "react"
import { useUserRepository } from "@/providers/user-provider"
import { usePostRepository } from "@/providers/post-provider"
import type { UserProfile } from "@/domain/users/types/user"
import type { Post } from "@/domain/posts/types/post"
import { Profile } from "@/features/profile/components/profile"

export function ProfilePage() {
  const userRepository = useUserRepository()
  const postRepository = usePostRepository()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const currentUser = await userRepository.getCurrentUser()
        if (currentUser) {
          const [userProfile, userPosts] = await Promise.all([
            userRepository.getUserProfile(currentUser.username),
            postRepository.getPostsByUserId(currentUser.id)
          ])
          setProfile(userProfile)
          setPosts(userPosts)
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndPosts()
  }, [userRepository, postRepository])

  if (loading) {
    return <div className="py-20 text-center">Loading profile...</div>
  }

  if (!profile) {
    return <div className="py-20 text-center">User not found</div>
  }

  return <Profile profile={profile} posts={posts} />
}
