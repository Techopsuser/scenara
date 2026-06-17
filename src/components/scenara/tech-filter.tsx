'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown, Search, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'
import { TECH_CATEGORIES } from '@/lib/types'

export function TechFilter({
  value,
  onChange,
}: {
  value: string | null
  onChange: (slug: string | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const { data } = useQuery({
    queryKey: ['technologies', 'all'],
    queryFn: () => api.listTechnologies(),
  })

  const techs = data?.technologies ?? []
  const selected = techs.find((t) => t.slug === value)

  const filtered = query
    ? techs.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.category.toLowerCase().includes(query.toLowerCase())
      )
    : techs

  // group by category
  const grouped = TECH_CATEGORIES.map((cat) => ({
    category: cat,
    items: filtered.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 justify-between border-border bg-background/60 px-3 text-sm font-normal"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {selected ? (
              <span className="text-foreground">{selected.name}</span>
            ) : (
              <span className="text-muted-foreground">All technologies</span>
            )}
          </span>
          {selected ? (
            <X
              className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
              }}
            />
          ) : (
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="border-b border-border p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search technologies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 border-transparent bg-secondary/40 pl-8 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="h-72">
          <div className="p-1">
            <button
              className={cn(
                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary',
                !value && 'bg-primary/10 text-primary'
              )}
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              All technologies
              {!value && <Check className="h-3.5 w-3.5" />}
            </button>
            {grouped.map((g) => (
              <div key={g.category} className="mt-1">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {g.category}
                </div>
                {g.items.map((t) => (
                  <button
                    key={t.id}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary',
                      value === t.slug && 'bg-primary/10 text-primary'
                    )}
                    onClick={() => {
                      onChange(t.slug)
                      setOpen(false)
                    }}
                  >
                    <span className="truncate">{t.name}</span>
                    {value === t.slug && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            ))}
            {grouped.length === 0 && (
              <div className="px-2 py-6 text-center text-xs text-muted-foreground">
                No technologies match "{query}"
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
