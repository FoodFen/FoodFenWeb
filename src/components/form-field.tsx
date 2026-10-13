import { Label } from '@/components/ui/label'
import { useErrorText } from '@/i18n/use-error-text'
import { CircleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

/** Label above the control, helper text optional, error below (never a placeholder as label). */
export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  const errorText = useErrorText()
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-muted-foreground text-sm">{hint}</p>}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-destructive flex items-center gap-1.5 text-sm"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden />
          {errorText(error)}
        </p>
      )}
    </div>
  )
}
