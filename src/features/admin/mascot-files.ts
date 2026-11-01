import type { MascotState } from '@/api/generated'
import { MASCOT_STATES } from './mascot-states'

export const IMAGE_TYPES = ['image/png', 'image/webp']
export const IMAGE_ACCEPT = IMAGE_TYPES.join(',')
const MAX_BYTES = 5 * 1024 * 1024

/** `happy.png` is the happy state; any other name (`happy-2.png`) is not recognised. */
export function stateFromFilename(filename: string): MascotState | null {
  const name = filename.replace(/\.[^.]*$/, '').toLowerCase()
  return MASCOT_STATES.find((state) => state === name) ?? null
}

/** Key under `admin:mascots.validation` of what is wrong with the file, or null when it is fine. */
export function validateImageFile(file: File) {
  if (!IMAGE_TYPES.includes(file.type)) return 'imageType'
  return file.size > MAX_BYTES ? 'imageSize' : null
}
