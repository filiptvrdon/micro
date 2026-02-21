import { useState } from "react"
import type { FormEvent } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { usePostRepository } from "@/providers/post-provider.tsx"
import type { Post } from "@/domain/posts/types/post.ts"
import { compressImage } from "@/lib/image-compression.ts"
import { toast } from "@/hooks/use-toast.ts"

interface CreatePostFormProps {
  onCreated?: (post: Post) => void
}

export function CreatePostForm({ onCreated }: CreatePostFormProps) {
  const postRepository = usePostRepository()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState("")
  const [tag, setTag] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles)
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (files.length === 0) {
      setError("Please select at least one image to upload.")
      return
    }

    const currentFiles = [...files]
    const currentCaption = caption
    const currentTag = tag || "General"

    // Reset form immediately
    setCaption("")
    setTag("")
    setFiles([])
    setPreviews([])
    setSubmitting(false)

    // Notify user that upload started
    toast({
      title: "Uploading post...",
      description: `Your ${currentFiles.length} images are being compressed and uploaded in the background.`,
    })

    // Perform compression and upload in background
    ;(async () => {
      try {
        const compressedFiles = await Promise.all(
          currentFiles.map((file) => compressImage(file, { maxSizeMB: 0.2 }))
        )
        const created = await postRepository.createPostWithImages(compressedFiles, currentCaption, currentTag)

        toast({
          title: "Post ready!",
          description: "Your post has been successfully uploaded and is now visible.",
        })

        if (onCreated) onCreated(created)
      } catch (err) {
        console.error(err)
        toast({
          title: "Upload failed",
          description: "There was an error uploading your post. Please try again.",
          variant: "destructive",
        })
      }
    })()
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <form onSubmit={onSubmit} className="space-y-4">
        <CardHeader className="p-0">
          <div className="text-sm font-medium">Share new images</div>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, idx) => (
                <div key={idx} className="aspect-square relative rounded-md overflow-hidden bg-muted">
                  <img src={preview} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
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
