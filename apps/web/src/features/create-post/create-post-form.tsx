import { useState, useRef } from "react"
import type { FormEvent } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { Textarea } from "@/components/ui/textarea.tsx"
import { usePostRepository } from "@/providers/post-provider.tsx"
import type { Post } from "@/domain/posts/types/post.ts"
import { compressImage } from "@/lib/image-compression.ts"
import { toast } from "@/hooks/use-toast.ts"
import { X, Image as ImageIcon, Plus, Loader2 } from "lucide-react"

interface CreatePostFormProps {
  onCreated?: (post: Post) => void
}

export function CreatePostForm({ onCreated }: CreatePostFormProps) {
  const postRepository = usePostRepository()
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState("")
  const [tag, setTag] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles]
      setFiles(newFiles)
      const newPreviews = [...previews, ...selectedFiles.map((file) => URL.createObjectURL(file))]
      setPreviews(newPreviews)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (files.length === 0) {
      setError("Please select at least one image to upload.")
      return
    }

    setIsUploading(true)

    const currentFiles = [...files]
    const currentCaption = caption
    const currentTag = tag || "General"

    try {
      // Notify user that upload started
      toast({
        title: "Uploading post...",
        description: `Your ${currentFiles.length} images are being compressed and uploaded.`,
      })

      const compressedFiles = await Promise.all(
        currentFiles.map((file) => compressImage(file, { maxSizeMB: 0.2 }))
      )
      const created = await postRepository.createPostWithImages(compressedFiles, currentCaption, currentTag)

      toast({
        title: "Post ready!",
        description: "Your post has been successfully uploaded and is now visible.",
      })

      // Reset form
      setCaption("")
      setTag("")
      setFiles([])
      setPreviews([])
      setIsUploading(false)

      if (onCreated) onCreated(created)
    } catch (err) {
      console.error(err)
      setIsUploading(false)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-none shadow-none bg-background overflow-hidden">
      <form onSubmit={onSubmit}>
        <CardContent className="p-0 space-y-6">
          {/* Image Selection & Preview */}
          <div className="space-y-4">
            {previews.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x px-1">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative flex-none w-48 aspect-[3/4] rounded-xl overflow-hidden bg-muted shadow-sm snap-start group">
                    <img src={preview} alt={`Preview ${idx}`} className="object-cover w-full h-full" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={() => removeFile(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full">
                      {idx + 1} / {previews.length}
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-none w-32 aspect-[3/4] rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-all bg-muted/30"
                >
                  <Plus className="h-6 w-6" />
                  <span className="text-xs font-medium">Add more</span>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square sm:aspect-video rounded-3xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary transition-all bg-muted/30 cursor-pointer group"
              >
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-semibold">Tap to upload images</p>
                  <p className="text-xs">Multiple files supported</p>
                </div>
              </div>
            )}
            
            <Input
              ref={fileInputRef}
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-4 px-1">
            <div className="space-y-2">
              <Label htmlFor="caption" className="text-sm font-semibold ml-1">Caption</Label>
              <Textarea
                id="caption"
                placeholder="What's on your mind?..."
                className="min-h-[120px] rounded-2xl resize-none border-muted-foreground/20 focus-visible:ring-primary/20 bg-muted/20"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-sm font-semibold ml-1">Tag</Label>
              <Input
                id="tag"
                type="text"
                placeholder="e.g. Daily, Training, Recipe..."
                className="rounded-full border-muted-foreground/20 focus-visible:ring-primary/20 bg-muted/20"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-500 px-1">{error}</div>}
        </CardContent>
        <CardFooter className="p-0 pt-8 flex justify-end">
          <Button 
            type="submit" 
            disabled={isUploading || files.length === 0}
            className="w-full sm:w-auto min-w-[140px] h-12 rounded-full font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Posting...
              </>
            ) : (
              "Share Post"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
