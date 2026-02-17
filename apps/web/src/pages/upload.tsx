import { CreatePostForm } from "@/features/create-post/create-post-form.tsx"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card.tsx"

export function UploadPage() {
  const navigate = useNavigate()

  return (
    <div className="py-10 space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl">Create Post</CardTitle>
          <CardDescription>
            Share your favorite moments with your followers.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pt-6">
          <CreatePostForm onCreated={() => navigate("/")} />
        </CardContent>
      </Card>
    </div>
  )
}
