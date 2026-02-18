import { useEffect, useState } from "react"
import { useUserRepository } from "@/providers/user-provider.tsx"
import { usePostRepository } from "@/providers/post-provider.tsx"
import type { UserProfile, User } from "@/domain/users/types/user.ts"
import type { Post } from "@/domain/posts/types/post.ts"
import { Profile } from "@/features/profile/components/profile.tsx"
import { useParams } from "react-router-dom"

export function ProfilePage() {
  const userRepository = useUserRepository()
  const postRepository = usePostRepository()
  const params = useParams()
  const viewingUsername = params.username
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isOwn, setIsOwn] = useState(false)

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        const currentUser = await userRepository.getCurrentUser()
        if (viewingUsername) {
          const userProfile = await userRepository.getUserProfile(viewingUsername)
          if (userProfile) {
            setProfile(userProfile)
            setIsOwn(!!currentUser && currentUser.username === userProfile.username)
            const userPosts = await postRepository.getPostsByUserId(userProfile.id)
            setPosts(userPosts)
          }
        } else if (currentUser) {
          const [userProfile, userPosts] = await Promise.all([
            userRepository.getUserProfile(currentUser.username),
            postRepository.getPostsByUserId(currentUser.id)
          ])
          setProfile(userProfile)
          setIsOwn(true)
          setPosts(userPosts)
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndPosts()
  }, [userRepository, postRepository, viewingUsername])

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

  return <Profile profile={profile} posts={posts} onProfileUpdated={handleProfileUpdated} isOwnProfile={isOwn} />
}
