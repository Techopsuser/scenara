'use client'

import { Github, Flame } from 'lucide-react'
import { Logo } from '@/components/scenara/logo'

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Logo size="sm" />
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            Real-world tech scenarios, solved together.
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-primary" />
            Built for engineers, by engineers
          </span>
          <span className="text-border">|</span>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            onClick={(e) => e.preventDefault()}
          >
            <Github className="h-3.5 w-3.5" />
            {new Date().getFullYear()}
          </a>
        </div>
      </div>
    </footer>
  )
}
