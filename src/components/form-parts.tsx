import { Button } from '@/components/ui/button'
import { CircleAlert, LoaderCircle } from 'lucide-react'
import type { ReactNode } from 'react'

export function SubmitButton({
  loading,
  disabled = false,
  children,
}: {
  loading: boolean
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <Button type="submit" disabled={loading || disabled} className="h-11 w-full text-base">
      {loading && <LoaderCircle className="animate-spin" aria-hidden />}
      {children}
    </Button>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg px-3 py-2 text-sm"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  )
}
