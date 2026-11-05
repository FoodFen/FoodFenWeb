import i18n from '@/i18n'
import { isAxiosError } from 'axios'

export type ApiFailure = {
  status?: number
  message: string
  /** Machine-readable code from the body (`error`, or `code` on catalog-food 422s), e.g. `mascot_id_taken`. */
  code?: string
  /** The one field a `code` is about (camelCase, nested as `servings.1.grams`), when the BE names it. */
  field?: string
  /** Field name (camelCase, as sent by the BE) to its error message. */
  fields: Record<string, string>
}

type ErrorBody = {
  message?: string
  error?: string
  code?: string
  field?: string
  errors?: Record<string, string>
}

// Fallback texts live in the `errors` namespace; a message sent by the BE always wins.
const byStatus = {
  401: 'unauthorized',
  403: 'forbidden',
  404: 'notFound',
  409: 'conflict',
  422: 'invalid',
  429: 'tooManyRequests',
} as const

// Failure bodies from the BE look like { message?, error?, errors?: { field: message } }.
export function parseApiError(error: unknown): ApiFailure {
  const t = i18n.getFixedT(null, 'errors')
  if (!isAxiosError<ErrorBody>(error)) return { message: t('unknown'), fields: {} }
  const { response } = error
  if (!response) return { message: t('network'), fields: {} }
  const status = response.status
  const fallback =
    byStatus[status as keyof typeof byStatus] ?? (status >= 500 ? 'server' : 'generic')
  return {
    status,
    message: response.data?.message ?? t(fallback),
    code: response.data?.error ?? response.data?.code,
    field: response.data?.field,
    fields: response.data?.errors ?? {},
  }
}

// Client errors will not fix themselves on retry; network failures and 5xx might.
export function shouldRetry(failureCount: number, error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined
  return failureCount < 2 && !(status !== undefined && status < 500)
}
