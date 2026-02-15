import { PostCard } from "@/features/feed/post-card"
import { CaughtUp } from "@/features/feed/caught-up"
import { Separator } from "@/components/ui/separator"

const SAMPLE_POSTS = [
  {
    id: "1",
    author: "John Doe",
    avatarUrl: "https://github.com/shadcn.png",
    timestamp: "2 hours ago",
    tag: "Morning Run",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
    caption: "Found a new trail today. The air was crisp and the pace felt intentional. Focusing on the breath rather than the clock.",
    likes: 12,
    comments: 3
  },
  {
    id: "2",
    author: "Jane Smith",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    timestamp: "5 hours ago",
    tag: "Heavy Lift",
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    caption: "New PR on deadlifts today. 3 plates feel lighter when you don't overthink the setup. Consistency over everything.",
    likes: 24,
    comments: 7
  }
]

export function FeedPage() {
  return (
    <div className="space-y-8">
      {SAMPLE_POSTS.map((post) => (
        <div key={post.id} className="space-y-8">
          <PostCard {...post} />
          <Separator className="opacity-50" />
        </div>
      ))}
      <CaughtUp />
    </div>
  )
}
