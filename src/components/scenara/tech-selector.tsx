'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, X, Check, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TechBadge } from '@/components/scenara/tech-badge'
import { api } from '@/lib/api'
import { TECH_CATEGORIES, type Technology } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function TechSelector({
  selected,
  onChange,
}: {
  selected: Technology[]
  onChange: (techs: Technology[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCategory, setNewCategory] = useState<string>(TECH_CATEGORIES[0])
  const [adding, setAdding] = useState(false)
  const qc = useQueryClient()
  const { toast } = useToast()

  const { data } = useQuery({
    queryKey: ['technologies', 'all'],
    queryFn: () => api.listTechnologies(),
  })
  const allTechs = data?.technologies ?? []

  const filtered = query
    ? allTechs.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : allTechs

  const grouped = TECH_CATEGORIES.map((cat) => ({
    category: cat,
    items: filtered.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0)

  function toggle(tech: Technology) {
    const exists = selected.find((t) => t.id === tech.id)
    if (exists) {
      onChange(selected.filter((t) => t.id !== tech.id))
    } else {
      onChange([...selected, tech])
    }
  }

  async function handleAddNew(e: React.FormEvent) {
    e.preventDefault()
    if (adding) return
    if (!newName.trim() || !newCategory) return
    setAdding(true)
    try {
      const { technology } = await api.addTechnology({
        name: newName.trim(),
        category: newCategory,
      })
      qc.invalidateQueries({ queryKey: ['technologies'] })
      onChange([...selected, technology])
      toast({
        title: 'Technology added',
        description: `${technology.name} is now available for everyone.`,
      })
      setNewName('')
      setAddOpen(false)
    } catch (err) {
      toast({
        title: 'Could not add technology',
        description: err instanceof Error ? err.message : 'Try again later.',
        variant: 'destructive',
      })
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-2">
      {/* selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((t) => (
            <div key={t.id} className="group relative">
              <TechBadge tech={t} size="md" active />
              <button
                type="button"
                onClick={() => toggle(t)}
                className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full border border-primary/40 bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${t.name}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="h-10 flex-1 justify-start border-border bg-background/60 font-normal text-muted-foreground"
            >
              <Search className="mr-2 h-4 w-4" />
              {selected.length === 0
                ? 'Search technologies to tag...'
                : `${selected.length} selected · add more`}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[360px] p-0" align="start">
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search technologies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-8 border-transparent bg-secondary/40 pl-8 text-sm"
                />
              </div>
            </div>
            <ScrollArea className="h-72">
              <div className="p-1">
                {grouped.map((g) => (
                  <div key={g.category} className="mt-1">
                    <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      {g.category}
                    </div>
                    {g.items.map((t) => {
                      const isSelected = !!selected.find((s) => s.id === t.id)
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={cn(
                            'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary',
                            isSelected && 'bg-primary/10 text-primary'
                          )}
                          onClick={() => toggle(t)}
                        >
                          <span className="truncate">{t.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </button>
                      )
                    })}
                  </div>
                ))}
                {grouped.length === 0 && (
                  <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                    No matches for "{query}"
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setAddOpen(true)
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 px-2 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Can't find it? Add a new technology
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setAddOpen(true)}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
          Add new
        </Button>
      </div>

      {/* Add new technology dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Add a new technology
            </DialogTitle>
            <DialogDescription>
              Can't find your tech in the list? Add it so the whole community can
              use it. It will be available immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddNew} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-tech-name" className="text-xs text-muted-foreground">
                Technology name
              </Label>
              <Input
                id="new-tech-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Bun, Tauri, Drizzle ORM"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-tech-cat" className="text-xs text-muted-foreground">
                Category
              </Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger id="new-tech-cat" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TECH_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setAddOpen(false)}
                disabled={adding}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adding || !newName.trim()}>
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add technology
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
