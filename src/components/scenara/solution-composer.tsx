'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Loader2, Send, Lightbulb } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

const LANGUAGES = [
  'plaintext',
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'go',
  'rust',
  'cpp',
  'php',
  'bash',
  'sql',
  'yaml',
  'json',
  'terraform',
  'dockerfile',
  'kotlin',
  'swift',
  'ruby',
] as const

export function SolutionComposer({
  open,
  onOpenChange,
  scenarioId,
  scenarioTitle,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  scenarioId: string
  scenarioTitle: string
}) {
  const [content, setContent] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [language, setLanguage] = useState<string>('plaintext')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const qc = useQueryClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (content.trim().length < 20) {
      toast({
        title: 'Too short',
        description: 'Please write at least 20 characters.',
        variant: 'destructive',
      })
      return
    }
    setLoading(true)
    try {
      await api.submitSolution({
        scenarioId,
        content,
        codeSnippet: codeSnippet.trim() || undefined,
        language: codeSnippet.trim() ? language : undefined,
      })
      toast({ title: 'Solution submitted', description: 'Thanks for contributing!' })
      setContent('')
      setCodeSnippet('')
      onOpenChange(false)
      qc.invalidateQueries({ queryKey: ['scenario', scenarioId] })
    } catch (err) {
      toast({
        title: 'Submission failed',
        description: err instanceof Error ? err.message : 'Try again later.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 border-border bg-background p-0 sm:max-w-lg">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-4 w-4 text-primary" />
            Submit a solution
          </SheetTitle>
          <SheetDescription className="line-clamp-1">
            For: {scenarioTitle}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="sol-content" className="text-xs text-muted-foreground">
              Your solution <span className="text-primary">*</span>
            </Label>
            <Textarea
              id="sol-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain your approach. Markdown is supported...

Example:
The root cause was a connection pool exhaustion. We:
1. Increased pool size
2. Added retry with backoff
3. Set a hard query timeout"
              className="min-h-[160px] resize-y bg-background/60 font-mono text-[13px] leading-relaxed"
            />
            <p className="text-[11px] text-muted-foreground/70">
              Markdown supported. Be specific about the fix and why it works.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="sol-code" className="text-xs text-muted-foreground">
                Code snippet <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-7 w-36 border-border bg-background/60 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              id="sol-code"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="// paste a code snippet, command, or config here"
              className="min-h-[140px] resize-y bg-[#1a1414] font-mono text-[13px] leading-relaxed"
            />
          </div>

          <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
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
                  Submit solution
                </>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

// re-export Input to avoid tree-shaking unused import warnings in some setups
export { Input }
