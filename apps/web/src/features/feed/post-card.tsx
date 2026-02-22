import type { Post } from "@/domain/posts/types/post.ts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx"
import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.tsx"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { useUserRepository } from "@/providers/user-provider.tsx"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils.ts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const userRepository = useUserRepository()
  const [isFollowingAuthor, setIsFollowingAuthor] = useState<boolean | null>(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    userRepository
      .isFollowing(post.userId)
      .then((v) => setIsFollowingAuthor(!!v))
      .catch(() => setIsFollowingAuthor(false))
  }, [post.userId, userRepository])

  useEffect(() => {
    // Small delay to ensure styles are applied and we get correct measurements
    const timeout = setTimeout(() => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current
        setShouldShowReadMore(scrollHeight > clientHeight)
      }
    }, 100)
    return () => clearTimeout(timeout)
  }, [post.caption])

  // Simple relative time formatter for stub
  const displayTime = post.createdAt.includes('T')
    ? new Date(post.createdAt).toLocaleDateString()
    : post.createdAt

  const hasMultipleMedia = post.media.length > 1


  return (
    <Card className="border-none shadow-none overflow-hidden bg-transparent">
      <CardHeader className="flex flex-row items-center space-x-4 p-0 pb-4">
        <Link to={`/profile/${post.authorUsername}`} className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.authorAvatarUrl} crossOrigin="anonymous" />
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
        <div className={`bg-muted rounded-xl relative overflow-hidden group ${hasMultipleMedia ? 'aspect-square' : ''}`}>
          {post.media && post.media.length > 0 ? (
            <div
              ref={mediaRef}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
              onScroll={(e) => {
                const target = e.currentTarget
                if (target.clientWidth > 0) {
                  const index = Math.round(target.scrollLeft / target.clientWidth)
                  if (index !== currentMediaIndex) {
                    setCurrentMediaIndex(index)
                  }
                }
              }}
            >
              {post.media.map((item, idx) => (
                <div key={item.id} className="flex-none w-full h-full snap-center relative">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      controls
                      className="object-cover w-full h-full"
                      preload="metadata"
                      playsInline
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={`Post media ${idx + 1}`}
                      className="object-cover w-full h-full"
                      crossOrigin="anonymous"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt="Post image"
              className="object-cover w-full h-full"
              crossOrigin="anonymous"
            />
          ) : null}

          {hasMultipleMedia && (
            <>
              <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto"
                  onClick={() => {
                    const newIndex = currentMediaIndex === 0 ? post.media.length - 1 : currentMediaIndex - 1
                    if (mediaRef.current) {
                      mediaRef.current.scrollTo({
                        left: newIndex * mediaRef.current.clientWidth,
                        behavior: "smooth",
                      })
                    }
                  }}
                >
                  <span className="sr-only">Previous image</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-4 w-4"><path d="m15 18-6-6 6-6"/></svg>
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm pointer-events-auto"
                  onClick={() => {
                    const newIndex = currentMediaIndex === post.media.length - 1 ? 0 : currentMediaIndex + 1
                    if (mediaRef.current) {
                      mediaRef.current.scrollTo({
                        left: newIndex * mediaRef.current.clientWidth,
                        behavior: "smooth",
                      })
                    }
                  }}
                >
                  <span className="sr-only">Next image</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right h-4 w-4"><path d="m9 18 6-6-6-6"/></svg>
                </Button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 rounded-full bg-background/50 backdrop-blur-md">
                {post.media.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      idx === currentMediaIndex ? "bg-primary w-3" : "bg-primary/30"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="py-4 space-y-2">
          <div
            ref={contentRef}
            className={cn(
              "text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none transition-all duration-200",
              !isExpanded && "line-clamp-5 overflow-hidden"
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.caption}
            </ReactMarkdown>
          </div>
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-primary hover:underline mt-1"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
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
