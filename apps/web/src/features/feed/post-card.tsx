import type { Post } from "@/domain/posts/types/post.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.tsx"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useUserRepository } from "@/providers/user-provider.tsx"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const userRepository = useUserRepository()
  const [isFollowingAuthor, setIsFollowingAuthor] = useState<boolean | null>(null)

  useEffect(() => {
    userRepository
      .isFollowing(post.userId)
      .then((v) => setIsFollowingAuthor(!!v))
      .catch(() => setIsFollowingAuthor(false))
  }, [post.userId, userRepository])

  // Simple relative time formatter for stub
  const displayTime = post.createdAt.includes('T')
    ? new Date(post.createdAt).toLocaleDateString()
    : post.createdAt

  return (
    <Card className="border-none shadow-none overflow-hidden bg-transparent">
      <CardHeader className="flex flex-row items-center space-x-4 p-0 pb-4">
        <Link to={`/profile/${post.authorUsername}`} className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.authorAvatarUrl} />
            <AvatarFallback>{post.authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{post.authorName}</span>
            <span className="text-xs text-muted-foreground">{displayTime}</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={isFollowingAuthor ? "secondary" : "outline"}
            size="sm"
            className="h-7 rounded-full px-3"
            onClick={async () => {
              try {
                if (isFollowingAuthor) {
                  await userRepository.unfollowUser(post.userId)
                  setIsFollowingAuthor(false)
                } else {
                  await userRepository.followUser(post.userId)
                  setIsFollowingAuthor(true)
                }
              } catch (e) {
                console.error("Failed to toggle follow", e)
              }
            }}
          >
            {isFollowingAuthor ? "Following" : "Follow"}
          </Button>
          <Badge variant="secondary" className="font-normal">
            {post.tag}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Training"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="py-4 space-y-2">
          <p className="text-base leading-relaxed">
            {post.caption}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-0 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className={`px-2 h-8 ${liked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart className={`h-5 w-5 mr-1 ${liked ? 'fill-current' : ''}`} />
          <span className="text-xs">{liked ? post.likesCount + 1 : post.likesCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground font-normal">
          <MessageCircle className="h-5 w-5 mr-1" />
          <span className="text-xs">{post.commentsCount}</span>
        </Button>
        <Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground ml-auto">
          <Share2 className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
