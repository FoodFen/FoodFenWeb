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

/** True for the formats the admin may pick; checked before resizing, which may change the format. */
export const isImageType = (file: File) => IMAGE_TYPES.includes(file.type)

/** True when the file fits the upload limit; checked after resizing. */
export const fitsImageSize = (file: File) => file.size <= MAX_BYTES
