import { parseApiError } from './errors'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

/**
 * Puts the BE's per-field errors on the matching form fields. Returns the message to show for the
 * whole form when there was no field to attach it to, else null.
 */
export function applyApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
  statusMessages: Record<number, string> = {},
) {
  const failure = parseApiError(error)
  let attached = false
  for (const [field, message] of Object.entries(failure.fields)) {
    if (fields.includes(field as Path<T>)) {
      setError(field as Path<T>, { message })
      attached = true
    }
  }
  if (attached) return null
  return (failure.status && statusMessages[failure.status]) || failure.message
}
