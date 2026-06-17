'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Trash2, Loader2 } from 'lucide-react'

/**
 * Delete button for a scenario. Only shown to the scenario author.
 * Opens a confirmation dialog, then calls the DELETE endpoint and
 * navigates back to the dashboard on success.
 */
export function DeleteScenarioButton({
  scenarioId,
  onDeleted,
}: {
  scenarioId: string
  onDeleted: () => void
}) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const qc = useQueryClient()
  const { toast } = useToast()

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.deleteScenario(scenarioId)
      // invalidate all scenario queries so feed/dashboard refresh
      qc.invalidateQueries({ queryKey: ['scenarios'] })
      qc.removeQueries({ queryKey: ['scenario', scenarioId] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast({
        title: 'Scenario deleted',
        description: 'Your scenario and all its solutions have been removed.',
      })
      setOpen(false)
      onDeleted()
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: err instanceof Error ? err.message : 'Try again later.',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete this scenario?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the scenario along with all of its
            solutions, votes, and attachments. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete scenario
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
