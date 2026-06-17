'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/scenara/logo'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import {
  Flame,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  ArrowRight,
  Sparkles,
  GitBranch,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'signup'

export function AuthView() {
  const [mode, setMode] = useState<Mode>('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return

    if (!email.trim() || !password) {
      toast({
        title: 'Missing details',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await api.register({ email, password, name: name || undefined })
      }

      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (!res || res.error) {
        toast({
          title: mode === 'signup' ? 'Account created' : 'Sign in failed',
          description:
            mode === 'signup'
              ? 'Your account is ready, but auto sign-in failed. Please sign in manually.'
              : res?.error ?? 'Invalid email or password.',
          variant: mode === 'signup' ? 'default' : 'destructive',
        })
        if (mode === 'signup') setMode('login')
      } else {
        toast({
          title: `Welcome${mode === 'signup' ? ' to Scenara' : ' back'}`,
          description: 'You are signed in.',
        })
        // hard refresh so server components / session cookies re-evaluate
        window.location.reload()
      }
    } catch (err) {
      toast({
        title: 'Something went wrong',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-4 py-10">
      {/* grid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-grid bg-grid-fade" />
      {/* bright crimson glow directly behind the auth card (right side) so the
          glass transparency is clearly visible */}
      <div className="pointer-events-none absolute right-[8%] top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-primary/45 blur-[120px]" />
      <div className="pointer-events-none absolute left-[12%] top-1/3 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />

      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Left — brand / pitch */}
        <div className="hidden flex-col gap-6 lg:flex">
          <Logo size="lg" />
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight">
            Where engineers share{' '}
            <span className="text-gradient-ember">real production</span>{' '}
            scenarios.
          </h1>
          <p className="max-w-md text-balance text-muted-foreground">
            No tutorials. No fluff. Just the hard, real-world problems teams
            actually face — and the solutions that got them unblocked.
          </p>

          <div className="grid gap-3 pt-2">
            {[
              {
                icon: Flame,
                title: 'Share a scenario',
                desc: 'Post the outage, the leak, the scaling wall you hit.',
              },
              {
                icon: GitBranch,
                title: 'Tag your stack',
                desc: '120+ technologies pre-loaded. Add more anytime.',
              },
              {
                icon: Users,
                title: 'Get unblocked',
                desc: 'Collect solutions, code snippets and accept the best.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3 backdrop-blur-sm"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {title}
                  </div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — auth card */}
        <div className="glass-strong relative mx-auto w-full max-w-md rounded-2xl p-6 shadow-2xl shadow-black/50 sm:p-8">
          {/* inner top highlight for premium glass */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Logo />
          </div>

          <div className="mb-5">
            <h2 className="text-xl font-semibold text-foreground">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'signup'
                ? 'Start sharing and solving tech scenarios.'
                : 'Sign in to continue to the feed.'}
            </p>
          </div>

          {/* mode toggle */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/40 p-1">
            {(['signup', 'login'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-md py-1.5 text-sm font-medium transition-all',
                  mode === m
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {m === 'signup' ? 'Sign up' : 'Sign in'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-muted-foreground">
                  Name <span className="text-muted-foreground/60">(optional)</span>
                </Label>
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background/60 pl-9"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/60 pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/60 pl-9"
                />
              </div>
              <p className="text-[11px] text-muted-foreground/70">
                {mode === 'signup' && 'Use at least 6 characters.'}
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === 'signup' ? 'Create account' : 'Sign in'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary/70" />
            <span>
              {mode === 'signup'
                ? 'Already have an account?'
                : 'New to Scenara?'}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
              className="font-medium text-primary hover:underline"
            >
              {mode === 'signup' ? 'Sign in' : 'Create one'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
