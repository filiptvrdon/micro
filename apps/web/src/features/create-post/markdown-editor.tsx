import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Eye,
  Edit3,
  Heading2
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const before = value.substring(0, start)
    const after = value.substring(end)

    const newValue = before + prefix + selectedText + suffix + after
    onChange(newValue)

    // Set focus back and select the inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      )
    }, 0)
  }

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case "bold":
        insertMarkdown("**", "**")
        break
      case "italic":
        insertMarkdown("_", "_")
        break
      case "heading":
        insertMarkdown("## ", "")
        break
      case "list":
        insertMarkdown("- ", "")
        break
      case "ordered-list":
        insertMarkdown("1. ", "")
        break
      case "link":
        insertMarkdown("[", "](url)")
        break
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "preview")} className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList className="bg-muted/50 p-1 h-9 rounded-lg">
            <TabsTrigger value="write" className="text-xs px-3 py-1 rounded-md">
              <Edit3 className="h-3.5 w-3.5 mr-1.5" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs px-3 py-1 rounded-md">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </TabsTrigger>
          </TabsList>

          {activeTab === "write" && (
            <div className="flex items-center gap-0.5 bg-muted/30 p-0.5 rounded-lg border border-muted-foreground/10">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={() => handleToolbarAction("bold")}
                title="Bold"
              >
                <Bold className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={() => handleToolbarAction("italic")}
                title="Italic"
              >
                <Italic className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={() => handleToolbarAction("heading")}
                title="Heading"
              >
                <Heading2 className="h-3.5 w-3.5" />
              </Button>
              <div className="w-[1px] h-4 bg-muted-foreground/20 mx-0.5" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={() => handleToolbarAction("list")}
                title="Bullet List"
              >
                <List className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={() => handleToolbarAction("ordered-list")}
                title="Ordered List"
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-background"
                onClick={() => handleToolbarAction("link")}
                title="Add Link"
              >
                <LinkIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="write" className="mt-0">
          <Textarea
            ref={textareaRef}
            placeholder={placeholder}
            className="min-h-[150px] rounded-xl resize-none border-muted-foreground/20 focus-visible:ring-primary/20 bg-muted/20 text-base p-4"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[150px] rounded-xl border border-muted-foreground/20 bg-muted/5 p-4 prose prose-sm dark:prose-invert max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic text-sm">Nothing to preview</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <div className="text-[10px] text-muted-foreground px-1 flex justify-between">
        <span>Markdown supported</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  )
}
