'use client'

import {
  Flame,
  Github,
  Layers,
  Boxes,
  Heart,
  Mail,
  Twitter,
  Linkedin,
} from 'lucide-react'
import { Logo } from '@/components/scenara/logo'
import { TECH_CATEGORIES } from '@/lib/types'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Logo size="md" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The community platform where engineers share real-world production
              scenarios and solve them together.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <SocialLink icon={Github} label="GitHub" />
              <SocialLink icon={Twitter} label="Twitter" />
              <SocialLink icon={Linkedin} label="LinkedIn" />
              <SocialLink icon={Mail} label="Email" />
            </div>
          </div>

          {/* Platform links */}
 <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Flame className="h-3.5 w-3.5 text-primary" />
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <FooterLink label="Dashboard" />
              <FooterLink label="Trending scenarios" />
              <FooterLink label="Top solutions" />
              <FooterLink label="Post a scenario" />
            </ul>
          </div>

          {/* Tech stacks */}
 <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Tech stacks
            </h4>
            <ul className="space-y-2 text-sm">
              {TECH_CATEGORIES.slice(0, 6).map((cat) => (
                <FooterLink key={cat} label={cat} />
              ))}
            </ul>
          </div>

          {/* Resources */}
 <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Boxes className="h-3.5 w-3.5 text-primary" />
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <FooterLink label="How it works" />
              <FooterLink label="Community guidelines" />
              <FooterLink label="API documentation" />
              <FooterLink label="Privacy policy" />
              <FooterLink label="Terms of service" />
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1.5">
            <span>© {year} Scenara.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Built for engineers, by engineers</span>
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ label }: { label: string }) {
  return (
    <li>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="text-muted-foreground transition-colors hover:text-primary"
      >
        {label}
      </a>
    </li>
  )
}

function SocialLink({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
    >
      <Icon className="h-4 w-4" />
    </a>
  )
}
