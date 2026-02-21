import { CreatePostForm } from "@/features/create-post/create-post-form.tsx"
import { useNavigate } from "react-router-dom"

export function UploadPage() {
  const navigate = useNavigate()

  return (
    <div className="py-6 px-4 max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">
          Share your favorite moments with your followers.
        </p>
      </div>
      <div className="pt-2">
        <CreatePostForm onCreated={() => navigate("/feed")} />
      </div>
    </div>
  )
}
