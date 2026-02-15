import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { useState } from "react"

interface PostCardProps {
  author: string
  avatarUrl: string
  timestamp: string
  tag: string
  imageUrl: string
  caption: string
  likes: number
  comments: number
}

export function PostCard({
  author,
  avatarUrl,
  timestamp,
  tag,
  imageUrl,
  caption,
  likes,
  comments,
}: PostCardProps) {
  const [liked, setLiked] = useState(false)

  return (
    <Card className="border-none shadow-none overflow-hidden bg-transparent">
      <CardHeader className="flex flex-row items-center space-x-4 p-0 pb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{author[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{author}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <Badge variant="secondary" className="ml-auto font-normal">
          {tag}
        </Badge>
      </CardHeader>

      <CardContent className="p-0">
        <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
          <img
            src={imageUrl}
            alt="Training"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="py-4 space-y-2">
          <p className="text-base leading-relaxed">
            {caption}
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
          <span className="text-xs">{liked ? likes + 1 : likes}</span>
        </Button>
        <Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground font-normal">
          <MessageCircle className="h-5 w-5 mr-1" />
          <span className="text-xs">{comments}</span>
        </Button>
        <Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground ml-auto">
          <Share2 className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
