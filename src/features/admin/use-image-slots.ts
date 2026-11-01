import type { MascotState } from '@/api/generated'
import { parseApiError } from '@/api/errors'
import i18n from '@/i18n'
import { useState } from 'react'
import { validateImageFile } from './mascot-files'
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
    const problem = validateImageFile(file)
    if (problem) return setSlot(state, { error: i18n.t(`admin:mascots.validation.${problem}`) })
    setSlot(state, { pending: true })
    try {
      const { url } = await upload.mutateAsync({ body: { image: file } })
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
