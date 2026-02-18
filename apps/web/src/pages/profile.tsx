import { useEffect, useState } from "react"
import { useUserRepository } from "@/providers/user-provider.tsx"
import { usePostRepository } from "@/providers/post-provider.tsx"
import type { UserProfile, User } from "@/domain/users/types/user.ts"
import type { Post } from "@/domain/posts/types/post.ts"
import { Profile } from "@/features/profile/components/profile.tsx"

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

  const handleProfileUpdated = (updated: Partial<User>) => {
    setProfile((prev) =>
      prev
        ? {
            ...prev,
            username: updated.username ?? prev.username,
            displayName: updated.displayName ?? prev.displayName,
            avatarUrl: updated.avatarUrl ?? prev.avatarUrl,
            bio: updated.bio ?? prev.bio,
          }
        : prev
    )
  }

  if (loading) {
    return <div className="py-20 text-center">Loading profile...</div>
  }

  if (!profile) {
    return <div className="py-20 text-center">User not found</div>
  }

  return <Profile profile={profile} posts={posts} onProfileUpdated={handleProfileUpdated} />
}
