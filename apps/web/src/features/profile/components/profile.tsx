import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Separator } from "@/components/ui/separator.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { Grid, List, Settings } from "lucide-react"
import type { UserProfile, User } from "@/domain/users/types/user.ts"
import type { Post } from "@/domain/posts/types/post.ts"
import { useUserRepository } from "@/providers/user-provider.tsx"
import { compressImage } from "@/lib/image-compression.ts"

interface ProfileProps {
  profile: UserProfile
  posts: Post[]
  onProfileUpdated?: (updated: Partial<User>) => void
  isOwnProfile?: boolean
}

export function Profile({ profile, posts, onProfileUpdated, isOwnProfile = false }: ProfileProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(profile.username)
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [bio, setBio] = useState(profile.bio || "")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const userRepository = useUserRepository()
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [listMode, setListMode] = useState<"none" | "followers" | "following">("none")
  const [followers, setFollowers] = useState<User[]>([])
  const [followingList, setFollowingList] = useState<User[]>([])

  useEffect(() => {
    if (!isOwnProfile) {
      userRepository
        .isFollowing(profile.id)
        .then((v) => setIsFollowing(!!v))
        .catch(() => setIsFollowing(false))
    }
  }, [isOwnProfile, profile.id, userRepository])

  const handleSave = async () => {
    try {
      setSaving(true)
      let updatedUser: User | null = null

      // If avatar selected, upload it first to get new URL reflected back
      if (avatarFile) {
        const compressedAvatar = await compressImage(avatarFile, { maxSizeMB: 0.1, maxWidthOrHeight: 400 })
        updatedUser = await userRepository.uploadCurrentUserAvatar(compressedAvatar)
        onProfileUpdated?.(updatedUser)
      }

      // Then update text fields if any changed
      const changes: { username?: string; displayName?: string; bio?: string } = {}
      if (username !== profile.username) changes.username = username
      if (displayName !== profile.displayName) changes.displayName = displayName
      if ((profile.bio || "") !== bio) changes.bio = bio

      if (Object.keys(changes).length > 0) {
        updatedUser = await userRepository.updateCurrentUser(changes)
        onProfileUpdated?.(updatedUser)
      }

      setIsEditing(false)
      setAvatarFile(null)
    } catch (e) {
      console.error("Failed to update profile", e)
      // In a real app, show toast
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback className="text-2xl">{profile.displayName[0]}</AvatarFallback>
        </Avatar>

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight">{profile.displayName}</h2>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-sm text-center max-w-[280px] leading-relaxed">
            {profile.bio}
          </p>
        )}

        <div className="flex space-x-2 w-full pt-2">
          {isOwnProfile ? (
            <>
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => setIsEditing((v) => !v)}>
                {isEditing ? "Close" : "Edit Profile"}
              </Button>
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </>
          ) : (
            <Button
              className="flex-1 rounded-full"
              variant={isFollowing ? "secondary" : "default"}
              onClick={async () => {
                try {
                  if (isFollowing) {
                    await userRepository.unfollowUser(profile.id)
                    setIsFollowing(false)
                  } else {
                    await userRepository.followUser(profile.id)
                    setIsFollowing(true)
                  }
                } catch (e) {
                  console.error("Failed to toggle follow", e)
                }
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {isEditing && (
          <div className="w-full mt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="avatar">Avatar</Label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex justify-around py-2">
        <div className="text-center">
          <div className="font-bold">{profile.postCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Posts</div>
        </div>
        <button
          className="text-center"
          onClick={async () => {
            try {
              const list = await userRepository.getFollowers(profile.id)
              setFollowers(list)
              setListMode("followers")
            } catch (e) {
              console.error("Failed to fetch followers", e)
            }
          }}
        >
          <div className="font-bold">{profile.followerCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
        </button>
        <button
          className="text-center"
          onClick={async () => {
            try {
              const list = await userRepository.getFollowing(profile.id)
              setFollowingList(list)
              setListMode("following")
            } catch (e) {
              console.error("Failed to fetch following", e)
            }
          }}
        >
          <div className="font-bold">{profile.followingCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Following</div>
        </button>
      </div>

      {listMode !== "none" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {listMode === "followers" ? "Followers" : "Following"}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setListMode("none")}>Close</Button>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {(listMode === "followers" ? followers : followingList).map((u) => (
              <Link key={u.id} to={`/profile/${u.username}`} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={u.avatarUrl} />
                  <AvatarFallback>{u.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{u.displayName}</div>
                  <div className="text-xs text-muted-foreground truncate">@{u.username}</div>
                </div>
              </Link>
            ))}
            {(listMode === "followers" ? followers : followingList).length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">No users to show.</div>
            )}
          </div>
        </div>
      )}

      <Separator className="opacity-50" />

      {/* Profile Feed Toggle */}
      <div className="flex justify-center space-x-12">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none px-4 h-10 transition-colors",
            viewMode === "grid" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          )}
          onClick={() => setViewMode("grid")}
        >
          <Grid className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-none px-4 h-10 transition-colors",
            viewMode === "list" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
          )}
          onClick={() => setViewMode("list")}
        >
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Posts Display */}
      {posts.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div key={post.id} className="aspect-square bg-muted rounded-sm overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.tag}
                  className="object-cover w-full h-full hover:opacity-90 transition-opacity cursor-pointer"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center space-x-4 p-2 hover:bg-muted/50 rounded-md transition-colors">
                <div className="h-16 w-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                  <img
                    src={post.imageUrl}
                    alt={post.tag}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {post.caption}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{post.tag}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-xs text-center text-muted-foreground py-8">
          No training posts yet.
        </p>
      )}
    </div>
  )
}
