import type { ParseKeys } from 'i18next'
import { useTranslation } from 'react-i18next'

/**
 * Form error messages are either translation keys (`'validation:email'`, set by zod schemas) or
 * plain text already written for people (server field errors from `applyApiError`). Keys are
 * translated, anything else is shown as it is.
 */
export function useErrorText() {
  const { t, i18n } = useTranslation()
  return (message: string | undefined) =>
    message && i18n.exists(message) ? t(message as ParseKeys) : message
}
