'use client'

import type { CSSProperties } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { cn } from '@/lib/utils'

/**
 * Markdown renderer with code block syntax highlighting themed for the
 * red/black Scenara palette.
 */
export function Markdown({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'prose-scenara max-w-none text-sm leading-relaxed text-foreground/90',
        className
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="mb-3 mt-5 text-xl font-semibold text-foreground">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 mt-4 text-lg font-semibold text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-3 text-base font-semibold text-foreground">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-2.5 text-sm leading-relaxed text-foreground/90">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-2.5 list-disc space-y-1 pl-5 text-sm text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 list-decimal space-y-1 pl-5 text-sm text-foreground/90">
              {children}
            </ol>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-l-2 border-primary/50 bg-primary/5 py-1 pl-4 text-sm italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code(props) {
            const { className: cls, children, ...rest } = props as {
              className?: string
              children?: React.ReactNode
            }
            const match = /language-(\w+)/.exec(cls || '')
            const isInline = !match && !String(children).includes('\n')
            if (isInline) {
              return (
                <code
                  className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
                  {...rest}
                >
                  {children}
                </code>
              )
            }
            return (
              <div className="my-3 overflow-hidden rounded-lg border border-border bg-[#1a1414]">
                <SyntaxHighlighter
                  style={vscDarkPlus as CSSProperties}
                  language={match?.[1] ?? 'text'}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    background: 'transparent',
                    fontSize: '13px',
                    padding: '14px 16px',
                  }}
                  codeTagProps={{
                    style: { fontFamily: 'var(--font-geist-mono), monospace' },
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            )
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
