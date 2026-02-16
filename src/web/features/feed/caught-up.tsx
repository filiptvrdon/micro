import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CaughtUp() {
  return (
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
  )
}
