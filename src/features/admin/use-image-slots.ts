import type { MascotState } from '@/api/generated'
import { parseApiError } from '@/api/errors'
import i18n from '@/i18n'
import { useState } from 'react'
import { fitsImageSize, isImageType } from './mascot-files'
import { resizeImage } from './resize-image'
import { useUploadMascotImage } from './use-mascots'

/** Upload progress of one state's tile. */
export type Slot = { pending?: boolean; error?: string }

/**
 * Uploads picked files at once, per state, and keeps each tile's spinner and error. `onUploaded`
 * gets the new url so the form can store it.
 */
export function useImageSlots(onUploaded: (state: MascotState, url: string) => void) {
  const upload = useUploadMascotImage()
  const [slots, setSlots] = useState<Partial<Record<MascotState, Slot>>>({})
  const setSlot = (state: MascotState, slot: Slot) => setSlots((all) => ({ ...all, [state]: slot }))

  const assign = async (state: MascotState, file: File) => {
    const reject = (problem: 'imageType' | 'imageUnreadable' | 'imageSize') =>
      setSlot(state, { error: i18n.t(`admin:mascots.validation.${problem}`) })
    if (!isImageType(file)) return reject('imageType')
    setSlot(state, { pending: true })
    try {
      const image = await resizeImage(file).catch(() => null)
      if (!image) return reject('imageUnreadable')
      if (!fitsImageSize(image)) return reject('imageSize')
      const { url } = await upload.mutateAsync({ body: { image } })
      onUploaded(state, url)
      setSlot(state, {})
    } catch (error) {
      setSlot(state, { error: parseApiError(error).message })
    }
  }

  return {
    slots,
    assign,
    fail: (state: MascotState, error: string) => setSlot(state, { error }),
    clear: (state: MascotState) => setSlot(state, {}),
    busy: Object.values(slots).some((slot) => slot.pending),
  }
}
