'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Logo } from '@/components/scenara/logo'
import { UserAvatar } from '@/components/scenara/user-avatar'
import { useAppStore } from '@/lib/store'
import { useAuth } from '@/hooks/use-auth'
import {
  Plus,
  LayoutGrid,
  LogOut,
  User as UserIcon,
  Flame,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function SiteHeader({ onShowAuth }: { onShowAuth: () => void }) {
  const { status } = useSession()
  const { user, isLoading } = useAuth()
  const { view, goFeed, goCompose } = useAppStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const authenticated = status === 'authenticated' && !!user

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <button
            onClick={goFeed}
            className="transition-opacity hover:opacity-90"
            aria-label="Scenara home"
          >
            <Logo />
          </button>

          {authenticated && (
            <nav className="hidden items-center gap-1 sm:flex">
              <button
                onClick={goFeed}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  view === 'feed'
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Feed
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {authenticated ? (
            <>
              <Button
                size="sm"
                onClick={goCompose}
                className="hidden sm:inline-flex"
              >
                <Plus className="h-4 w-4" />
                New scenario
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={goCompose}
                className="sm:hidden"
                aria-label="New scenario"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full ring-offset-background transition hover:ring-2 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <UserAvatar
                      name={user.name}
                      image={user.image}
                      size={32}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {user.name ?? user.email.split('@')[0]}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={goFeed}>
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Browse feed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={goCompose}>
                    <Flame className="mr-2 h-4 w-4" />
                    Share a scenario
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            !isLoading && (
              <Button size="sm" onClick={onShowAuth}>
                <UserIcon className="h-4 w-4" />
                Sign in
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
