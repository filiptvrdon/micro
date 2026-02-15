import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Grid, List, Settings } from "lucide-react"
import type { UserProfile } from "@/features/users/types/user"
import type { Post } from "@/features/feed/types/post"

interface ProfileProps {
  profile: UserProfile
  posts: Post[]
}

export function Profile({ profile, posts }: ProfileProps) {
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
          <Button variant="outline" className="flex-1 rounded-full">
            Edit Profile
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around py-2">
        <div className="text-center">
          <div className="font-bold">{profile.postCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Posts</div>
        </div>
        <div className="text-center">
          <div className="font-bold">{profile.followerCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
        </div>
        <div className="text-center">
          <div className="font-bold">{profile.followingCount}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Following</div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Profile Feed Toggle (Simplified for now) */}
      <div className="flex justify-center space-x-12">
        <Button variant="ghost" size="sm" className="text-primary border-b-2 border-primary rounded-none px-4 h-10">
          <Grid className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground rounded-none px-4 h-10">
          <List className="h-5 w-5" />
        </Button>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
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
        <p className="text-xs text-center text-muted-foreground py-8">
          No training posts yet.
        </p>
      )}
    </div>
  )
}
