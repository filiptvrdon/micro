import { useState } from "react"
import type { FormEvent } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { usePostRepository } from "@/providers/post-provider.tsx"
import type { Post } from "@/domain/posts/types/post.ts"

interface CreatePostFormProps {
  onCreated?: (post: Post) => void
}

export function CreatePostForm({ onCreated }: CreatePostFormProps) {
  const postRepository = usePostRepository()
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState("")
  const [tag, setTag] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!file) {
      setError("Please select an image to upload.")
      return
    }
    try {
      setSubmitting(true)
      const created = await postRepository.createPostWithImage(file, caption, tag)
      setCaption("")
      setTag("")
      setFile(null)
      if (onCreated) onCreated(created)
    } catch (err) {
      console.error(err)
      setError("Failed to create post. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <form onSubmit={onSubmit} className="space-y-4">
        <CardHeader className="p-0">
          <div className="text-sm font-medium">Share a new image</div>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              type="text"
              placeholder="e.g. Training"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
        </CardContent>
        <CardFooter className="p-0">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
