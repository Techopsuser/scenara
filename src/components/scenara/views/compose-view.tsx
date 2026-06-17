'use client'

import { useState } from 'react'
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
import { Card } from '@/components/ui/card'
import { TechSelector } from '@/components/scenara/tech-selector'
import { Markdown } from '@/components/scenara/markdown'
import { useAppStore } from '@/lib/store'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import {
  DIFFICULTY_META,
  type Difficulty,
  type Technology,
} from '@/lib/types'
import {
  ArrowLeft,
  Loader2,
  Send,
  Eye,
  Pencil,
  Flame,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComposeView() {
  const goFeed = useAppStore((s) => s.goFeed)
  const openScenario = useAppStore((s) => s.openScenario)
  const { toast } = useToast()

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate')
  const [techs, setTechs] = useState<Technology[]>([])
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(false)

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
      })
      toast({
        title: 'Scenario published',
        description: 'Your scenario is now live on the feed.',
      })
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Button variant="ghost" size="sm" onClick={goFeed} className="mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Button>

      <div className="mb-6">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          <Flame className="h-3 w-3" />
          New scenario
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Share a real-world tech scenario
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Post the production problem you faced. The community will help solve it.
        </p>
      </div>

      {/* tips */}
      <Card className="mb-5 border-primary/20 bg-primary/[0.04] p-4">
        <div className="flex gap-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Good scenarios include:</span>{' '}
            the symptoms you observed, what you expected, what you tried, the
            environment / scale, and any logs or metrics. Markdown is supported
            in the details field.
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* title */}
        <div className="space-y-1.5">
          <Label htmlFor="title" className="text-xs text-muted-foreground">
            Title <span className="text-primary">*</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fixing a memory leak in a Node.js microservice under load"
            className="h-11 border-border bg-background/60 text-base"
            maxLength={140}
          />
          <div className="flex justify-end text-[11px] text-muted-foreground/70">
            {title.length}/140
          </div>
        </div>

        {/* summary */}
        <div className="space-y-1.5">
          <Label htmlFor="summary" className="text-xs text-muted-foreground">
            Short summary <span className="text-primary">*</span>
          </Label>
          <Textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="One or two sentences describing the scenario. This shows on the feed card."
            className="min-h-[70px] resize-y bg-background/60"
            maxLength={280}
          />
          <div className="flex justify-end text-[11px] text-muted-foreground/70">
            {summary.length}/280
          </div>
        </div>

        {/* difficulty + technologies */}
        <div className="grid gap-5 sm:grid-cols-2">
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

        {/* content with preview toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="content" className="text-xs text-muted-foreground">
              Full scenario details <span className="text-primary">*</span>
            </Label>
            <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5">
              <button
                type="button"
                onClick={() => setPreview(false)}
                className={cn(
                  'inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors',
                  !preview ? 'bg-background text-foreground' : 'text-muted-foreground'
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
                  preview ? 'bg-background text-foreground' : 'text-muted-foreground'
                )}
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>
            </div>
          </div>

          {preview ? (
            <div className="min-h-[260px] rounded-md border border-border bg-card/40 p-4">
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
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Describe the scenario in detail. Markdown supported.

## Context
What system, scale, and environment?

## Symptoms
What went wrong? Errors, metrics, user impact?

## What we tried
Steps already attempted.`}
              className="min-h-[260px] resize-y bg-background/60 font-mono text-[13px] leading-relaxed"
            />
          )}
        </div>

        {/* actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={goFeed}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publish scenario
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
