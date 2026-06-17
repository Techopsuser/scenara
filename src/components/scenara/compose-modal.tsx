'use client'

import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TechSelector } from '@/components/scenara/tech-selector'
import { Markdown } from '@/components/scenara/markdown'
import { UserAvatar } from '@/components/scenara/user-avatar'
import {
  formatBytes,
  extOf,
} from '@/components/scenara/attachments-list'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import {
  DIFFICULTY_META,
  type Difficulty,
  type Technology,
  type Attachment,
} from '@/lib/types'
import {
  Loader2,
  Send,
  Eye,
  Pencil,
  Flame,
  ImagePlus,
  Paperclip,
  X,
  FileText,
  Info,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MAX_ATTACHMENTS = 6
const MAX_BYTES = 2 * 1024 * 1024 // 2MB

export function ComposeModal() {
  const { composerOpen, closeComposer, openScenario } = useAppStore()
  const { user } = useAuth()
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate')
  const [techs, setTechs] = useState<Technology[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busyFile, setBusyFile] = useState(false)

  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = useCallback(() => {
    setTitle('')
    setSummary('')
    setContent('')
    setDifficulty('intermediate')
    setTechs([])
    setAttachments([])
    setPreview(false)
  }, [])

  function handleClose(open: boolean) {
    if (!open) {
      closeComposer()
      // slight delay so the dialog close animation isn't janky
      setTimeout(resetForm, 200)
    }
  }

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const addFiles = useCallback(
    async (files: FileList | null, asImage: boolean) => {
      if (!files || files.length === 0) return
      if (attachments.length >= MAX_ATTACHMENTS) {
        toast({
          title: 'Attachment limit',
          description: `Max ${MAX_ATTACHMENTS} attachments per scenario.`,
          variant: 'destructive',
        })
        return
      }
      setBusyFile(true)
      try {
        const incoming = Array.from(files)
        const slots = MAX_ATTACHMENTS - attachments.length
        const picked = incoming.slice(0, slots)
        const built: Attachment[] = []
        for (const f of picked) {
          if (f.size > MAX_BYTES) {
            toast({
              title: 'File too large',
              description: `${f.name} exceeds ${formatBytes(MAX_BYTES)}.`,
              variant: 'destructive',
            })
            continue
          }
          const data = await readFileAsDataUrl(f)
          const isImg = asImage && f.type.startsWith('image/')
          built.push({
            type: isImg ? 'image' : 'file',
            name: f.name,
            mime: f.type || 'application/octet-stream',
            size: f.size,
            data,
          })
        }
        if (built.length) {
          setAttachments((prev) => [...prev, ...built])
        }
      } catch {
        toast({
          title: 'Could not read file',
          description: 'Please try a different file.',
          variant: 'destructive',
        })
      } finally {
        setBusyFile(false)
        // reset input so the same file can be re-selected
        if (asImage && imageInputRef.current) imageInputRef.current.value = ''
        if (!asImage && fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [attachments.length, toast]
  )

  function removeAttachment(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    if (title.trim().length < 8) {
      toast({
        title: 'Title too short',
        description: 'Use at least 8 characters.',
        variant: 'destructive',
      })
      return
    }
    if (summary.trim().length < 20) {
      toast({
        title: 'Summary too short',
        description: 'Give at least 20 characters of context.',
        variant: 'destructive',
      })
      return
    }
    if (content.trim().length < 30) {
      toast({
        title: 'Details too short',
        description: 'Describe the scenario with at least 30 characters.',
        variant: 'destructive',
      })
      return
    }
    if (techs.length === 0) {
      toast({
        title: 'Tag technologies',
        description: 'Please tag at least one technology.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { scenario } = await api.createScenario({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        difficulty,
        technologyIds: techs.map((t) => t.id),
        attachments: attachments.length > 0 ? attachments : undefined,
      })
      toast({
        title: 'Scenario published',
        description: attachments.length
          ? `Posted with ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}.`
          : 'Your scenario is now live.',
      })
      handleClose(false)
      openScenario(scenario.id)
    } catch (err) {
      toast({
        title: 'Publish failed',
        description: err instanceof Error ? err.message : 'Try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const images = attachments.filter((a) => a.type === 'image')
  const files = attachments.filter((a) => a.type === 'file')

  return (
    <Dialog open={composerOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[92vh] flex-col overflow-hidden border-border bg-background p-0 sm:max-w-2xl">
        {/* Header — LinkedIn/Facebook style composer (fixed) */}
        <DialogHeader className="shrink-0 border-b border-border px-5 py-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-primary" />
            Share a scenario
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            {user && (
              <>
                <UserAvatar name={user.name} image={user.image} size={20} />
                Posting as{' '}
                <span className="font-medium text-foreground">
                  {user.name ?? user.email.split('@')[0]}
                </span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Scrollable body — users can scroll through all fields */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            {/* tips */}
            <div className="flex gap-2 rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-[11px] text-muted-foreground">
                Include the symptoms, what you expected, what you tried, and
                your environment. Add screenshots or logs as attachments for
                portable sharing. Markdown supported.
              </p>
            </div>

            {/* title */}
            <div className="space-y-1.5">
              <Label htmlFor="m-title" className="text-xs text-muted-foreground">
                Title <span className="text-primary">*</span>
              </Label>
              <Input
                id="m-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fixing a memory leak in a Node.js microservice under load"
                className="h-10 border-border bg-background/60"
                maxLength={140}
              />
            </div>

            {/* summary */}
            <div className="space-y-1.5">
              <Label htmlFor="m-summary" className="text-xs text-muted-foreground">
                Short summary <span className="text-primary">*</span>
              </Label>
              <Textarea
                id="m-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="One or two sentences describing the scenario..."
                className="min-h-[60px] resize-y bg-background/60"
                maxLength={280}
              />
            </div>

            {/* difficulty + tech */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Difficulty <span className="text-primary">*</span>
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as Difficulty)}
                >
                  <SelectTrigger className="h-10 border-border bg-background/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((d) => (
                      <SelectItem key={d} value={d}>
                        {DIFFICULTY_META[d].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs text-muted-foreground">
                  Technologies <span className="text-primary">*</span>
                </Label>
                <TechSelector selected={techs} onChange={setTechs} />
              </div>
            </div>

            {/* content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="m-content" className="text-xs text-muted-foreground">
                  Details <span className="text-primary">*</span>
                </Label>
                <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreview(false)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors',
                      !preview
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Pencil className="h-3 w-3" />
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreview(true)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors',
                      preview
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                </div>
              </div>
              {preview ? (
                <div className="min-h-[180px] rounded-md border border-border bg-card/40 p-4">
                  {content.trim() ? (
                    <Markdown>{content}</Markdown>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nothing to preview yet.
                    </p>
                  )}
                </div>
              ) : (
                <Textarea
                  id="m-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Describe the scenario in detail. Markdown supported..."
                  className="min-h-[180px] resize-y bg-background/60 font-mono text-[13px] leading-relaxed"
                />
              )}
            </div>

            {/* attachments */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Attachments{' '}
                  <span className="text-muted-foreground/60">
                    ({attachments.length}/{MAX_ATTACHMENTS} · max {formatBytes(MAX_BYTES)} each)
                  </span>
                </Label>
                <div className="flex items-center gap-1.5">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files, true)}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => addFiles(e.target.files, false)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={
                      busyFile || attachments.length >= MAX_ATTACHMENTS
                    }
                    className="h-8"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Photos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={
                      busyFile || attachments.length >= MAX_ATTACHMENTS
                    }
                    className="h-8"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    Files
                  </Button>
                </div>
              </div>

              {/* image previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {images.map((img, i) => {
                    const realIdx = attachments.indexOf(img)
                    return (
                      <div
                        key={i}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-[#1a1414]"
                      >
                        <img
                          src={img.data}
                          alt={img.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(realIdx)}
                          className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          aria-label="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* file chips */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, i) => {
                    const realIdx = attachments.indexOf(file)
                    return (
                      <div
                        key={i}
                        className="group inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 py-1.5 pl-2 pr-1.5 text-xs"
                      >
                        <div className="grid h-6 w-6 place-items-center rounded bg-primary/10">
                          <FileText className="h-3 w-3 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="max-w-[140px] truncate font-medium text-foreground">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {extOf(file.name)} · {formatBytes(file.size)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(realIdx)}
                          className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove file"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {busyFile && (
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Reading files...
                </div>
              )}
            </div>
          </div>

          {/* footer actions (fixed at bottom — does not scroll) */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary/70" />
              Attachments travel with the scenario for portable sharing.
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleClose(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
