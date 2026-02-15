import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

function App() {
  const [liked, setLiked] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-4">
      {/* Header */}
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Feed</h1>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Main Feed */}
      <main className="w-full max-w-md space-y-8">
        {/* Sample Training Post */}
        <Card className="border-none shadow-none overflow-hidden">
          <CardHeader className="flex flex-row items-center space-x-4 p-0 pb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <Badge variant="secondary" className="ml-auto font-normal">
              Morning Run
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Placeholder for Hero Media */}
              <img
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
                alt="Training"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="py-4 space-y-2">
              <p className="text-base leading-relaxed">
                Found a new trail today. The air was crisp and the pace felt intentional.
                Focusing on the breath rather than the clock.
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
              <span className="text-xs">12</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground font-normal">
              <MessageCircle className="h-5 w-5 mr-1" />
              <span className="text-xs">3</span>
            </Button>
            <Button variant="ghost" size="sm" className="px-2 h-8 text-muted-foreground ml-auto">
              <Share2 className="h-5 w-5" />
            </Button>
          </CardFooter>
        </Card>

        <Separator className="opacity-50" />

        {/* Caught Up State */}
        <div className="text-center py-12 space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary mb-2">
            <Badge variant="outline" className="border-none text-xl">✓</Badge>
          </div>
          <h2 className="text-lg font-medium">You're all caught up</h2>
          <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
            You've seen all new training updates from your friends. Time to log off and focus on your next session.
          </p>
          <Button variant="outline" className="mt-4 rounded-full px-8">
            Come back tomorrow
          </Button>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-8 text-center opacity-30">
        <span className="text-xs tracking-widest uppercase">Micro</span>
      </footer>
    </div>
  )
}

export default App
