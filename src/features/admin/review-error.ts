import { parseApiError } from '@/api/errors'
import i18n from '@/i18n'

/** 409 means the owner edited the item after the admin loaded it; the page reloads on its own. */
export function reviewErrorMessage(error: unknown): string {
  const { status, message } = parseApiError(error)
  return status === 409 ? i18n.t('admin:review.conflict') : message
}
