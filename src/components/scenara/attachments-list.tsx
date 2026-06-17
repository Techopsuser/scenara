'use client'

import { Download, FileText, Image as ImageIcon, X } from 'lucide-react'
import type { Attachment } from '@/lib/types'
import { cn } from '@/lib/utils'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function extOf(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop()!.toUpperCase() : 'FILE'
}

export function AttachmentsList({
  attachments,
  className,
}: {
  attachments: Attachment[]
  className?: string
}) {
  if (!attachments.length) return null

  const images = attachments.filter((a) => a.type === 'image')
  const files = attachments.filter((a) => a.type === 'file')

  return (
    <div className={cn('space-y-3', className)}>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((img, i) => (
            <a
              key={i}
              href={img.data}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-lg border border-border/60 bg-[#1a1414]"
            >
              <img
                src={img.data}
                alt={img.name}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                <span className="truncate text-[10px] text-foreground/80">
                  {img.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <a
              key={i}
              href={file.data}
              download={file.name}
              className="group inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-xs transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="max-w-[160px] truncate font-medium text-foreground">
                  {file.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {extOf(file.name)} · {formatBytes(file.size)}
                </span>
              </div>
              <Download className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export { formatBytes, extOf }
