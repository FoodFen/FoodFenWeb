import { applyApiError } from '@/api/form-errors'
import { parseApiError } from '@/api/errors'
import i18n from '@/i18n'
import type { ParseKeys } from 'i18next'
import type { UseFormSetError } from 'react-hook-form'
import type { MascotValues } from './mascot-schema'

const FIELDS = ['id', 'name', 'coinCost', 'bodyColor'] as const

/** The text for a failed call: the translation of its error code, else the BE's message. */
export function mascotErrorText(error: unknown) {
  const { code, message } = parseApiError(error)
  const key = `admin:mascots.errors.${code}`
  return code && i18n.exists(key) ? i18n.t(key as ParseKeys) : message
}

/**
 * Puts a failed save where the admin can see it: the BE's field errors on their fields, a taken
 * id on the id, a missing idle image on the idle tile. Returns the text for the whole form when
 * there is nowhere else for it, else null.
 */
export function applyMascotError(
  error: unknown,
  setError: UseFormSetError<MascotValues>,
  failIdle: (message: string) => void,
) {
  const { code } = parseApiError(error)
  const text = mascotErrorText(error)
  if (code === 'mascot_id_taken') setError('id', { message: text })
  else if (code === 'mascot_missing_idle_image') failIdle(text)
  else return applyApiError(error, setError, FIELDS) === null ? null : text
  return null
}
